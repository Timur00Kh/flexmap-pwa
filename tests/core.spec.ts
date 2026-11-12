import { test, expect } from '@playwright/test';
import { exercises } from '../src/lib/exercises';
import { latestResults, summarize, validateImport, type Result } from '../src/lib/store';

const appUrl = (baseURL: string, path = '') => new URL(path, baseURL).toString();

test.describe('FlexMap core calculations', () => {
  test('keeps the latest result per side and excludes stopped checks from scores and coverage', () => {
    const rows: Result[] = [
      { id: 'old-left', exerciseId: 'shoulder-flexion', side: 'left', level: 2, stopped: false, date: '2026-11-10T10:00:00.000Z' },
      { id: 'stopped-left', exerciseId: 'shoulder-flexion', side: 'left', level: null, stopped: true, date: '2026-11-11T10:00:00.000Z' },
      { id: 'right', exerciseId: 'shoulder-flexion', side: 'right', level: 3, stopped: false, date: '2026-11-10T11:00:00.000Z' },
    ];

    const latest = latestResults(rows);
    expect(latest).toHaveLength(2);
    expect(latest.find((result) => result.side === 'left')).toMatchObject({ stopped: true, level: null });
    const summary = summarize(rows);
    const total = exercises.reduce((count, exercise) => count + (exercise.bilateral ? 2 : 1), 0);
    expect(summary).toMatchObject({
      scores: { shoulders: 75 },
      coverage: Math.round(1 / total * 100),
      count: 1,
      total,
      average: 75,
    });
  });

  test('validates export shape and permits valid stopped records without scoring them', () => {
    const raw = {
      version: 1,
      exportedAt: '2026-11-12T09:00:00.000Z',
      results: [
        { id: 'scored', exerciseId: 'neck-rotation', side: 'left', level: 2, stopped: false, date: '2026-11-10T10:00:00.000Z' },
        { id: 'stopped', exerciseId: 'hip-flexion', side: 'left', level: null, stopped: true, date: '2026-11-11T10:00:00.000Z' },
      ],
    };
    const imported = validateImport(raw);
    expect(imported).toHaveLength(2);
    expect(imported[1]).toMatchObject({ stopped: true, level: null });
    expect(summarize(imported)).toMatchObject({ count: 1, average: 50 });
    expect(() => validateImport({ version: 1, results: [{ ...raw.results[0], side: 'both' }] })).toThrow();
    expect(() => validateImport({ version: 2, results: [] })).toThrow();
  });
});

test.describe('FlexMap browser smoke', () => {
  test('shows onboarding and the WebGL map at root, English, and Russian routes', async ({ page }, testInfo) => {
    const base = testInfo.project.use.baseURL as string;
    await page.goto(appUrl(base));
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Meet your body where it is.' })).toBeVisible();
    await page.getByRole('button', { name: /Let.s explore/ }).click();
    await expect(page.getByRole('heading', { name: 'Your movement, mapped.' })).toBeVisible();
    const canvas = page.locator('.anatomy-wrap canvas');
    await expect(canvas).toBeVisible();
    await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) => Boolean(node.getContext('webgl2') || node.getContext('webgl')))).toBe(true);

    await page.goto(appUrl(base, 'en/'));
    await expect(page.getByRole('heading', { name: 'Your movement, mapped.' })).toBeVisible();
    await page.goto(appUrl(base, 'ru/'));
    await expect(page.getByRole('heading', { name: 'Карта вашей подвижности.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Проверки движений' })).toBeVisible();
  });

  test('saves both sides, persists results, excludes stopped checks, and round-trips export/import', async ({ page }, testInfo) => {
    const base = testInfo.project.use.baseURL as string;
    await page.goto(appUrl(base));
    await page.getByRole('button', { name: /Let.s explore/ }).click();
    await page.getByRole('button', { name: 'Movement checks' }).click();

    await page.getByRole('button', { name: /Raise an arm overhead/ }).click();
    const save = page.getByRole('button', { name: 'Save result' });
    await expect(save).toBeDisabled();
    await page.getByRole('button', { name: /Level 3/ }).click();
    await expect(save).toBeDisabled();
    await page.getByLabel('I can hold this position without pain or compensation.').check();
    await expect(save).toBeEnabled();
    await save.click();

    await expect(page.getByRole('button', { name: 'Right', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: /Level 3/ })).not.toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: /Level 3/ }).click();
    await page.getByLabel('I can hold this position without pain or compensation.').check();
    await save.click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.getByRole('button', { name: /Raise an arm overhead/ }).click();
    await page.getByRole('button', { name: /Level 4/ }).click();
    await page.getByLabel('I can hold this position without pain or compensation.').check();
    await save.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await page.getByRole('button', { name: 'Movement checks' }).click();
    await page.getByRole('button', { name: /Lift a knee/ }).click();
    await page.getByRole('button', { name: 'Stop: pain or discomfort' }).click();
    await expect(page.getByText('Stopped safely. No score was assigned.')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Your movement, mapped.' })).toBeVisible();
    await expect(page.getByText(/2 \/ \d+ positions checked/)).toBeVisible();
    await expect(page.locator('.stat').filter({ hasText: 'Movement score' }).locator('strong')).toHaveText('63');
    await page.getByRole('button', { name: 'Your progress' }).click();
    await expect(page.getByRole('table').getByText('Raise an arm overhead')).toHaveCount(3);
    const retakeRow = page.getByRole('table').getByRole('row').filter({ hasText: 'Raise an arm overhead' }).filter({ hasText: 'Left' }).first();
    await expect(retakeRow.getByText('+25')).toBeVisible();
    await expect(page.getByRole('table').getByText('Stopped safely. No score was assigned.')).toBeVisible();

    await page.getByRole('button', { name: 'Settings' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export JSON' }).click();
    const download = await downloadPromise;
    const backupPath = await download.path();
    expect(backupPath).toBeTruthy();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Delete all results' }).click();
    await page.getByRole('button', { name: 'Body map' }).click();
    await expect(page.getByText(/0 \/ \d+ positions checked/)).toBeVisible();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.locator('input[type="file"]').setInputFiles(backupPath!);
    await expect(page.getByText('Backup imported.')).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{ broken json'),
    });
    await expect(page.getByText('Could not import this file. Use a valid FlexMap version 1 backup.')).toBeVisible();

    await page.getByRole('button', { name: 'Body map' }).click();
    await expect(page.getByText(/2 \/ \d+ positions checked/)).toBeVisible();
    await expect(page.locator('.stat').filter({ hasText: 'Movement score' }).locator('strong')).toHaveText('63');
  });

  test('fits mobile layouts without horizontal overflow', async ({ page }, testInfo) => {
    const base = testInfo.project.use.baseURL as string;
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(base));
    await page.getByRole('button', { name: /Let.s explore/ }).click();
    const checkOverflow = async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(await checkOverflow()).toBe(true);
    await page.locator('.page-heading').getByRole('button', { name: 'Start a check' }).click();
    expect(await checkOverflow()).toBe(true);
    await page.getByRole('button', { name: /Raise an arm overhead/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await checkOverflow()).toBe(true);
  });

  test('reloads the app while offline after its shell is cached', async ({ page, context }, testInfo) => {
    const base = testInfo.project.use.baseURL as string;
    await page.goto(appUrl(base));
    await page.getByRole('button', { name: /Let.s explore/ }).click();
    await expect(page.getByText('Offline access ready')).toBeVisible({ timeout: 30_000 });
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
    await context.setOffline(true);
    for (const [path, title] of [
      ['', 'Your movement, mapped.'],
      ['en/', 'Your movement, mapped.'],
      ['ru/', 'Карта вашей подвижности.'],
    ] as const) {
      await page.goto(appUrl(base, path), { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
      await expect(page.getByRole('complementary',{name:/App status|Статус приложения/})).toContainText(/Offline|Нет сети/);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
      const canvas = page.locator('.anatomy-wrap canvas');
      await expect(canvas).toBeVisible();
      await expect.poll(() => canvas.evaluate((node: HTMLCanvasElement) => Boolean(node.getContext('webgl2') || node.getContext('webgl')))).toBe(true);
    }
  });
});

test('detects Russian browser language and keeps selected theme and language after reload',async({browser},testInfo)=>{
 const context=await browser.newContext({locale:'ru-RU'});
 const page=await context.newPage();
 await page.goto(testInfo.project.use.baseURL!);
 await expect(page.getByRole('heading',{name:'Познакомьтесь со своим телом.'})).toBeVisible();
 await page.getByRole('button',{name:'Начать знакомство'}).click();
 await expect(page.getByRole('heading',{name:'Карта вашей подвижности.'})).toBeVisible();
 await page.locator('.topbar .language-pill').click();
 await expect(page.getByRole('heading',{name:'Your movement, mapped.'})).toBeVisible();
 await page.getByRole('button',{name:'Appearance',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Your movement, mapped.'})).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await context.close();
});

test('selects a muscle with a raycast and rotates and zooms the 3D model',async({page},testInfo)=>{
 await page.goto(testInfo.project.use.baseURL!);
 await page.getByRole('button',{name:/Let.s explore/}).click();
 const canvas=page.locator('.anatomy-wrap canvas');
 await expect(canvas).toBeVisible();
 await expect.poll(()=>canvas.evaluate((node:HTMLCanvasElement)=>{const gl=node.getContext('webgl2');return Boolean(gl?.getParameter(gl.CURRENT_PROGRAM))})).toBe(true);
 const box=(await canvas.boundingBox())!;
 await canvas.click({position:{x:box.width*.455,y:box.height*.335}});
 await expect(page.locator('.detail-panel .panel-header h2')).toHaveText('Chest');
 const front=await canvas.screenshot();
 await page.getByRole('button',{name:'Back',exact:true}).click();
 await expect(page.getByRole('button',{name:'Back',exact:true})).toHaveAttribute('aria-pressed','true');
 const back=await canvas.screenshot();
 expect(front.equals(back)).toBe(false);
 const orbitBox=(await canvas.boundingBox())!;
 await page.mouse.move(orbitBox.x+orbitBox.width*.6,orbitBox.y+orbitBox.height*.5);
 await page.mouse.down();
 await page.mouse.move(orbitBox.x+orbitBox.width*.8,orbitBox.y+orbitBox.height*.52,{steps:12});
 await page.mouse.up();
 const rotated=await canvas.screenshot();
 expect(rotated.equals(back)).toBe(false);
 await page.mouse.wheel(0,-180);
 const zoomed=await canvas.screenshot();
 expect(zoomed.equals(rotated)).toBe(false);
});
