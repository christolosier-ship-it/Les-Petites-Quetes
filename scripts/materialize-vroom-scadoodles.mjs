import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SOURCE = resolve(ROOT, 'vendor/vroom-scadoodles/web');
const OUTPUT = resolve(ROOT, 'public/games/vroom-scadoodles');

const EXPECTED_BLOBS = new Map([
  ['index.apple-touch-icon.png', '871ad64011020c7ff8ed286ca04107adc61ddce6'],
  ['index.audio.worklet.js', 'd9330c735f3da52a20f5e54e0b463ac03b7dff70'],
  ['index.html', '4cd85d7a91861e4c2c50b0bd3829b2e12c3a01e7'],
  ['index.icon.png', 'f2a8c86862cdb7c083bb57e6192f097a98b3a95c'],
  ['index.js', 'a34f13cca0827c7bfbcb5ca22ec1f19f8b3c8546'],
  ['index.pck', '0bae6b388bc3402d5119338bbe3d558defbb97be'],
  ['index.png', '766b0b66efb1ac8cb53d9cd6b7fa2ef70c6ec559'],
  ['index.wasm', 'af0c84d084ca092155e4747028ded881b84d2492'],
]);

function gitBlobSha(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}

for (const [name, expectedSha] of EXPECTED_BLOBS) {
  const bytes = await readFile(resolve(SOURCE, name));
  const actualSha = gitBlobSha(bytes);
  if (actualSha !== expectedSha) {
    throw new Error(`Vroom Scadoodles : empreinte inattendue pour ${name} (${actualSha}, attendu ${expectedSha})`);
  }
}

await rm(OUTPUT, { recursive: true, force: true });
await mkdir(OUTPUT, { recursive: true });
await cp(SOURCE, OUTPUT, { recursive: true });

console.log(`Vroom Scadoodles matérialisé depuis ${SOURCE} vers ${OUTPUT} (${EXPECTED_BLOBS.size} fichiers validés).`);
