import { test, expect, type Page } from '@playwright/test';
import { exercises, basicExercises, stretchingExercises } from '../src/lib/exercises';
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

async function map(page:Page,lang:'en'|'ru'='en'){
 await page.getByRole('navigation').getByRole('button',{name:lang==='en'?'My map':'Моя карта',exact:true}).click();
 await expect(page.locator('[data-model-ready="true"]')).toBeVisible({timeout:45_000});
}
async function openCheck(page:Page,name:string){
 await page.getByRole('navigation').getByRole('button',{name:'Practice',exact:true}).click();
 const catalog=page.locator('.catalog');
 if(await catalog.getAttribute('open')===null)await catalog.locator('summary').click();
 await catalog.locator('.exercise-card').filter({hasText:name}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
}
async function choose(page:Page,level:number){
 await page.getByRole('dialog').getByRole('button',{name:new RegExp(`^Level ${level}:`)}).click();
 await page.getByLabel('I can hold this position without pain or compensation.').check();
}

test('starts with two clear sections and preserves RU/EN static routes',async({page},info)=>{
 const base=info.project.use.baseURL!;
 await page.goto(base);
 await expect(page.locator('.hero-action')).toHaveText(/Start this stretch/);
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.getByRole('navigation').getByRole('button')).toHaveCount(2);
 await expect(page.locator('.catalog')).not.toHaveAttribute('open');
 await map(page);
 await expect(page.locator('.anatomy-wrap canvas')).toBeVisible();
 await expect(page.getByRole('link',{name:/Écorché/})).toBeVisible();
 await page.goto(appUrl(base,'en/'));
 await expect(page.locator('.hero-action')).toHaveText(/Start this stretch/);
 await page.goto(appUrl(base,'ru/'));
 await expect(page.locator('.hero-action')).toHaveText(/Начать упражнение/);
 await expect(page.getByRole('navigation').getByRole('button',{name:'Практика'})).toBeVisible();
});

test('keeps safe side selection, retakes, history, backups and scores',async({page},info)=>{
 await page.goto(info.project.use.baseURL!);
 await page.getByRole('button',{name:'Basic mobility',exact:true}).click();
 await page.locator('.hero-action').click();
 const dialog=page.getByRole('dialog');
 const left=dialog.getByRole('button',{name:'Save & check right side',exact:true});
 await expect(left).toBeDisabled();
 await dialog.getByRole('button',{name:/^Level 3:/}).click();
 await expect(left).toBeDisabled();
 await page.getByLabel('I can hold this position without pain or compensation.').check();
 await left.click();
 await expect(dialog.getByRole('button',{name:'Right',exact:true})).toHaveAttribute('aria-pressed','true');
 await choose(page,3);
 await dialog.getByRole('button',{name:'Save result',exact:true}).click();
 await expect(dialog.getByRole('button',{name:'Try the next movement'})).toBeVisible();
 await dialog.getByRole('button',{name:'Close',exact:true}).click();
 await openCheck(page,'Raise an arm overhead');
 await choose(page,4);
 await dialog.getByRole('button',{name:'Save & check right side',exact:true}).click();
 await page.keyboard.press('Escape');
 await openCheck(page,'Lift a knee');
 await dialog.getByRole('button',{name:'Stop: pain or discomfort',exact:true}).click();
 await expect(dialog.getByText('Stopped safely. No score was assigned.')).toBeVisible();
 await dialog.getByRole('button',{name:'Close',exact:true}).click();
 await page.reload();
 await map(page);
 await expect(page.locator('.map-summary')).toContainText('2 / 31 positions checked');
 await expect(page.locator('.map-summary')).toContainText('Movement score 63');
 await page.getByRole('button',{name:'Check history',exact:true}).click();
 await expect(page.getByRole('table').getByText('Raise an arm overhead')).toHaveCount(3);
 await expect(page.getByRole('row').filter({hasText:'Raise an arm overhead'}).filter({hasText:'Left'}).first()).toContainText('+25');
 await expect(page.getByRole('table').getByText('Stopped',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Settings',exact:true}).click();
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Export JSON',exact:true}).click();
 const backup=(await pending);const backupPath=await backup.path();expect(backupPath).toBeTruthy();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Delete all results',exact:true}).click();
 await page.locator('input[type="file"]').setInputFiles(backupPath!);
 await expect(page.getByText('Backup imported.')).toBeVisible();
 await page.locator('input[type="file"]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{ invalid')});
 await expect(page.getByText('Could not import this file. Use a valid FlexMap version 1 backup.')).toBeVisible();
 await map(page);await expect(page.locator('.map-summary')).toContainText('Movement score 63');
});

test('shows five real image ranges and fits narrow mobile screens',async({page},info)=>{
 await page.setViewportSize({width:390,height:844});await page.goto(info.project.use.baseURL!);
 await expect(page.locator('.hero-action')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.hero-action').click();
 await expect(page.locator('.level-card')).toHaveCount(5);
 await expect(page.locator('.active-pose [role="img"]')).toBeVisible();
 const dimensions=await page.locator('.active-pose [role="img"]').boundingBox();expect(Math.abs(dimensions!.width-dimensions!.height)).toBeLessThan(2);
 const background=await page.locator('.active-pose [role="img"]').evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(background).toContain('/flexmap-pwa/exercises/standing-forward-fold.webp');
 await choose(page,4);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'output/playwright/mobile-check.png',fullPage:true});
 await page.keyboard.press('Escape');await map(page);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'output/playwright/mobile-map.png',fullPage:true});
});

test('caches illustrations and real anatomy for offline reloads in both languages',async({page,context},info)=>{
 const base=info.project.use.baseURL!;await page.goto(base);
 await expect(page.getByText('Offline access ready')).toBeVisible({timeout:60_000});
 await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
 // Only the initial check screen was visited online. The model must already be cached.
 await context.setOffline(true);
 for(const lang of ['en','ru'] as const){
  await page.goto(appUrl(base,`${lang}/`));
  await expect(page.locator('.hero-action')).toBeVisible();
  await expect(page.getByRole('complementary',{name:/App status|Статус приложения/})).toContainText(/Offline|Нет сети/);
  await map(page,lang);
  await expect(page.locator('.anatomy-wrap canvas')).toBeVisible();
  await page.reload();await expect(page.locator('.hero-action')).toBeVisible();
  await page.locator('.hero-action').click();await expect(page.locator('.active-pose [role="img"]')).toBeVisible();
  const asset=await page.locator('.active-pose [role="img"]').evaluate(el=>getComputedStyle(el).backgroundImage);
  const url=asset.slice(5,-2);expect((await page.evaluate(async url=>(await fetch(url)).status,url))).toBe(200);
  await page.keyboard.press('Escape');
 }
});

test('detects browser language and persists language and theme',async({browser},info)=>{
 const context=await browser.newContext({locale:'ru-RU'});const page=await context.newPage();
 await page.goto(info.project.use.baseURL!);await expect(page.locator('.hero-action')).toHaveText(/Начать упражнение/);
 await page.getByRole('button',{name:'Настройки',exact:true}).click();
 await page.getByRole('button',{name:'English',exact:true}).click();
 await page.getByRole('button',{name:'Dark',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.reload();await expect(page.locator('.hero-action')).toHaveText(/Start this stretch/);
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await context.close();
});

test('real muscle selection, back view, orbit and zoom change the 3D view',async({page},info)=>{
 await page.goto(info.project.use.baseURL!);await map(page);
 const canvas=page.locator('.anatomy-wrap canvas');
 await expect.poll(()=>canvas.evaluate((node:HTMLCanvasElement)=>{const gl=node.getContext('webgl2');return Boolean(gl?.getParameter(gl.CURRENT_PROGRAM))})).toBe(true);
 await page.screenshot({path:'output/playwright/desktop-map.png',fullPage:true});
 const box=(await canvas.boundingBox())!;
 await canvas.click({position:{x:box.width*.48,y:box.height*.34}});
 await expect(page.locator('.detail-panel h2')).toBeVisible();
 const front=await canvas.screenshot();
 await page.getByRole('button',{name:'Back',exact:true}).click();
 await expect(page.getByRole('button',{name:'Back',exact:true})).toHaveAttribute('aria-pressed','true');
 const back=await canvas.screenshot();expect(front.equals(back)).toBe(false);
 const b=(await canvas.boundingBox())!;await page.mouse.move(b.x+b.width*.6,b.y+b.height*.5);await page.mouse.down();await page.mouse.move(b.x+b.width*.75,b.y+b.height*.5,{steps:12});await page.mouse.up();
 const orbit=await canvas.screenshot();expect(orbit.equals(back)).toBe(false);
 await page.mouse.wheel(0,-150);const zoom=await canvas.screenshot();expect(zoom.equals(orbit)).toBe(false);
});

test('ships every illustrated five-frame sheet and the licensed model locally',async({request},info)=>{
 const base=info.project.use.baseURL!;
 for(const exercise of exercises){
  const response=await request.get(appUrl(base,`exercises/${exercise.id}.webp`));
  expect(response.status(),exercise.id).toBe(200);
  expect(response.headers()['content-type'],exercise.id).toContain('image/webp');
  expect((await response.body()).byteLength,exercise.id).toBeGreaterThan(3000);
 }
 const model=await request.get(appUrl(base,'models/ecorche.meshopt.glb'));
 expect(model.status()).toBe(200);expect((await model.body()).subarray(0,4).toString()).toBe('glTF');
 const credits=await request.get(appUrl(base,'models/ATTRIBUTION.md'));expect(credits.status()).toBe(200);
 expect(await credits.text()).toContain('CC BY-SA');
 const manifest=await request.get(appUrl(base,'precache.json'));const precache=await manifest.json();
 expect(precache.assets.filter((path:string)=>path.includes('/exercises/'))).toHaveLength(exercises.length);
 expect(precache.assets).toContain('/flexmap-pwa/models/ecorche.meshopt.glb');
});

test('mode summaries exclude unrelated observations and retain shared movements',()=>{
 expect(basicExercises).toHaveLength(18);expect(stretchingExercises).toHaveLength(18);expect(exercises).toHaveLength(32);
 const rows:Result[]=[
  {id:'basic',exerciseId:'neck-rotation',side:'left',level:2,stopped:false,date:'2026-11-12T12:00:00Z'},
  {id:'sport',exerciseId:'standing-forward-fold',side:'both',level:4,stopped:false,date:'2026-11-12T12:01:00Z'},
  {id:'shared',exerciseId:'shoulder-flexion',side:'left',level:3,stopped:false,date:'2026-11-12T12:02:00Z'},
 ];
 expect(summarize(rows,basicExercises)).toMatchObject({count:2,scores:{neck:50,shoulders:75}});
 expect(summarize(rows,stretchingExercises)).toMatchObject({count:2,scores:{hamstrings:100,shoulders:75}});
 expect(summarize(rows,stretchingExercises).scores.neck).toBeUndefined();
 expect(validateImport({version:1,results:rows})).toHaveLength(3);
});

test('tracks athletic straight-knee fold milestones separately from basic mobility',async({page},info)=>{
 await page.goto(info.project.use.baseURL!);
 await expect(page.getByRole('button',{name:'Stretching',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.locator('.hero-action').click();
 const dialog=page.getByRole('dialog');await expect(dialog.getByRole('heading',{name:'Standing forward fold',exact:true})).toBeVisible();
 await choose(page,3);await dialog.getByRole('button',{name:'Save result',exact:true}).click();
 await dialog.getByRole('button',{name:'Close',exact:true}).click();
 await map(page);await expect(page.locator('.map-summary')).toContainText('Level 3');
 await page.getByRole('button',{name:'Basic mobility',exact:true}).click();
 await expect(page.locator('.map-summary')).toContainText('0 / 31 positions checked');
 await page.getByRole('button',{name:'Stretching',exact:true}).click();
 await openCheck(page,'Standing forward fold');await choose(page,5);await dialog.getByRole('button',{name:'Save result',exact:true}).click();
 await dialog.getByRole('button',{name:'Close',exact:true}).click();
 await map(page);await page.getByRole('button',{name:'Check history',exact:true}).click();
 const rows=page.getByRole('table').getByRole('row').filter({hasText:'Standing forward fold'});
 await expect(rows).toHaveCount(2);await expect(rows.first()).toContainText('5 / 5');await expect(rows.first()).toContainText('+2');
 await page.getByRole('button',{name:'Basic mobility',exact:true}).click();await page.reload();
 await expect(page.getByRole('button',{name:'Basic mobility',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Stretching',exact:true}).click();await map(page);await expect(page.locator('.map-summary')).toContainText('Level 5');
});
