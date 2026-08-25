import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';

const root = process.cwd();
const legacyBundles = [
  'assets/dragon-mountain/bundles/actors.json',
  'assets/dragon-mountain/bundles/dragons.json',
];
const pass2Bundle = 'assets/dragon-mountain/pass2/derived-assets.json';
const pass2Manifest = 'assets/dragon-mountain/pass2/manifest.json';
const outputRoot = join(root, 'public/worlds/dragon-mountain/ninja-adventure');

async function materializeBundle(bundleFile) {
  const raw = await readFile(join(root, bundleFile), 'utf8');
  const bundle = JSON.parse(raw);
  let count = 0;
  for (const [relativePath, encoded] of Object.entries(bundle.files ?? {})) {
    const outputPath = join(outputRoot, relativePath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, Buffer.from(encoded, 'base64'));
    count += 1;
  }
  return count;
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function verifyPass2() {
  const manifest = JSON.parse(await readFile(join(root, pass2Manifest), 'utf8'));
  for (const entry of [...(manifest.direct ?? []), ...(manifest.materialized ?? [])]) {
    const file = join(outputRoot, entry.path);
    const data = await readFile(file);
    if (data.byteLength !== entry.bytes) throw new Error(`Dragon asset size mismatch: ${entry.path}`);
    if (sha256(data) !== entry.sha256) throw new Error(`Dragon asset checksum mismatch: ${entry.path}`);
  }
  await stat(join(outputRoot, 'Derived/dragon-world.webp'));
  return (manifest.direct?.length ?? 0) + (manifest.materialized?.length ?? 0);
}

let count = 0;
for (const bundle of legacyBundles) count += await materializeBundle(bundle);
count += await materializeBundle(pass2Bundle);
const verified = await verifyPass2();
console.log(`Dragon Mountain: ${count} assets materialized, ${verified} pass-2 assets verified.`);
