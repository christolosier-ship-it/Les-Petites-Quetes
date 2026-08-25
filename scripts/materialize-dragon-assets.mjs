import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';

const root = process.cwd();
const legacyBundles = [
  'assets/dragon-mountain/bundles/actors.json',
  'assets/dragon-mountain/bundles/dragons.json',
];
const pass2Root = join(root, 'assets/dragon-mountain/pass2');
const pass2Bundle = join(pass2Root, 'derived-assets.json');
const pass2Manifest = join(pass2Root, 'manifest.json');
const outputRoot = join(root, 'public/worlds/dragon-mountain/ninja-adventure');

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function writeVerified(relativePath, data, expected) {
  if (data.byteLength !== expected.bytes) throw new Error(`Dragon asset size mismatch: ${relativePath}`);
  if (sha256(data) !== expected.sha256) throw new Error(`Dragon asset checksum mismatch: ${relativePath}`);
  const outputPath = join(outputRoot, relativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, data);
}

async function materializeBundle(bundleFile) {
  const raw = await readFile(bundleFile, 'utf8');
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

async function assemblePass2(manifest) {
  let count = 0;
  for (const entry of manifest.assembled ?? []) {
    const encoded = (await Promise.all(entry.parts.map((part) => readFile(join(pass2Root, part), 'utf8')))).join('');
    const data = Buffer.from(encoded, entry.encoding ?? 'base64');
    await writeVerified(entry.path, data, entry);
    count += 1;
  }
  return count;
}

async function verifyMaterialized(manifest) {
  for (const entry of manifest.materialized ?? []) {
    const data = await readFile(join(outputRoot, entry.path));
    if (data.byteLength !== entry.bytes) throw new Error(`Dragon asset size mismatch: ${entry.path}`);
    if (sha256(data) !== entry.sha256) throw new Error(`Dragon asset checksum mismatch: ${entry.path}`);
  }
  return manifest.materialized?.length ?? 0;
}

const manifest = JSON.parse(await readFile(pass2Manifest, 'utf8'));
let count = 0;
for (const bundle of legacyBundles) count += await materializeBundle(join(root, bundle));
count += await materializeBundle(pass2Bundle);
const assembled = await assemblePass2(manifest);
const verified = await verifyMaterialized(manifest);
console.log(`Dragon Mountain: ${count} assets materialized, ${assembled} assembled, ${verified + assembled} pass-2 assets verified.`);
