import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SOURCE = resolve(ROOT, 'vendor/galaxy-explorer');
const OUTPUT = resolve(ROOT, 'public/games/galaxy-explorer');

const EXPECTED_BLOBS = new Map([
  ['index.html', '8c03aec85a4d20ffc18fdf22a736796b4e1b5caa'],
  ['styles.css', 'e6a5385a621584241b16958f9549524f0d5b9246'],
  ['src/main.js', '9af0adbc7fbf3e96f021de1f6f33e24b4f20a44e'],
  ['vendor/three.module.js', '0bcc7a286da2c115853ceec9deea19923e10ddc1'],
  ['audio/tracks/frozen_star.mp3', '3b9092afca37119d0a64028db1fdb3fa2008d455'],
  ['audio/tracks/echoes_of_time.mp3', '1c54206138053e74cbc3120f8f7bad0122246bd6'],
  ['audio/tracks/out_there.ogg', '975ecb12fd620d986ddadec91e5e326799899146'],
]);

const RUNTIME_ENTRIES = [
  'index.html',
  'styles.css',
  'favicon.svg',
  'src',
  'audio',
  'textures',
  'vendor',
  'media/hero',
];

function gitBlobSha(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

for (const [name, expectedSha] of EXPECTED_BLOBS) {
  const bytes = await readFile(resolve(SOURCE, name));
  const actualSha = gitBlobSha(bytes);
  if (actualSha !== expectedSha) {
    throw new Error(`Galaxy Explorer : empreinte inattendue pour ${name} (${actualSha}, attendu ${expectedSha})`);
  }
}

await rm(OUTPUT, { recursive: true, force: true });
await mkdir(OUTPUT, { recursive: true });
for (const entry of RUNTIME_ENTRIES) {
  await cp(resolve(SOURCE, entry), resolve(OUTPUT, entry), { recursive: true });
}

console.log(`Galaxy Explorer matérialisé depuis ${SOURCE} vers ${OUTPUT} (${EXPECTED_BLOBS.size} empreintes du snapshot local validées).`);
