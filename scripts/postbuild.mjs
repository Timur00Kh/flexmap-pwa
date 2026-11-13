import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.resolve('out');
const basePath = '/flexmap-pwa/';
const shellFiles = [
  ['index.html', ''],
  ['en/index.html', 'en/'],
  ['ru/index.html', 'ru/'],
  ['manifest.webmanifest', 'manifest.webmanifest'],
  ['icon-192.png', 'icon-192.png'],
  ['icon-512.png', 'icon-512.png'],
  ['maskable-512.png', 'maskable-512.png'],
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }));
  return files.flat();
}

const precacheFiles = [];
for (const [relativePath] of shellFiles) {
  const fullPath = path.join(outputDir, relativePath);
  try {
    await readFile(fullPath);
  } catch {
    throw new Error(`Required exported PWA file is missing: out/${relativePath}`);
  }
  precacheFiles.push(relativePath);
}

const staticDir = path.join(outputDir, '_next', 'static');
for (const fullPath of await walk(staticDir)) {
  if (/\.(?:js|css)$/i.test(fullPath)) precacheFiles.push(path.relative(outputDir, fullPath));
}

// Local visual assets are part of the offline contract, including the mesh.
for (const directory of ['models', 'exercises']) {
  try {
    for (const fullPath of await walk(path.join(outputDir, directory))) {
      if (/\.(?:glb|gltf|webp|png|jpg|jpeg|bin)$/i.test(fullPath)) {
        precacheFiles.push(path.relative(outputDir, fullPath));
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const uniqueFiles = [...new Set(precacheFiles)].sort();
const hash = createHash('sha256');
for (const relativePath of uniqueFiles) {
  hash.update(relativePath);
  hash.update('\0');
  hash.update(await readFile(path.join(outputDir, relativePath)));
  hash.update('\0');
}
const workerPath = path.join(outputDir, 'sw.js');
const worker = await readFile(workerPath, 'utf8');
hash.update('sw.js\0');
hash.update(worker);
hash.update('\0');
const version = hash.digest('hex').slice(0, 20);
const assets = uniqueFiles.map((relativePath) => {
  const shellRoute = shellFiles.find(([file]) => file === relativePath)?.[1];
  const assetPath = shellRoute ?? relativePath.split(path.sep).join('/');
  return `${basePath}${assetPath.split('/').map(encodeURIComponent).join('/')}`;
});

if (!worker.includes('__BUILD_HASH__')) throw new Error('Service worker build hash placeholder is missing');
await writeFile(path.join(outputDir, 'precache.json'), `${JSON.stringify({ version, assets }, null, 2)}\n`);
await writeFile(workerPath, worker.replaceAll('__BUILD_HASH__', version));

console.log(`Prepared PWA precache ${version} with ${assets.length} assets.`);
