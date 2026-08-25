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

const directPass2Assets = new Set([
  'Derived/villager-walk.webp',
  'Derived/dog-walk.webp',
  'Derived/chicken-walk.webp',
  'Derived/bat-fly.webp',
  'Derived/samurai-blue-walk.webp',
  'Derived/knight-walk.webp',
]);

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function integrityMismatch(relativePath, data, expected) {
  const actualSha = sha256(data);
  if (data.byteLength === expected.bytes && actualSha === expected.sha256) return null;
  return `${relativePath}: expected ${expected.bytes}/${expected.sha256}, got ${data.byteLength}/${actualSha}`;
}

async function writeVerified(relativePath, data, expected) {
  const mismatch = integrityMismatch(relativePath, data, expected);
  if (mismatch) throw new Error(`Dragon asset integrity mismatch: ${mismatch}`);
  const outputPath = join(outputRoot, relativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, data);
}

async function readBundle(bundleFile) {
  return JSON.parse(await readFile(bundleFile, 'utf8'));
}

async function materializeBundle(bundle, preservedPaths = new Set()) {
  let count = 0;
  let preserved = 0;
  for (const [relativePath, encoded] of Object.entries(bundle.files ?? {})) {
    if (preservedPaths.has(relativePath)) {
      preserved += 1;
      continue;
    }
    const outputPath = join(outputRoot, relativePath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, Buffer.from(encoded, 'base64'));
    count += 1;
  }
  return { count, preserved };
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
  const mismatches = [];
  for (const entry of manifest.materialized ?? []) {
    try {
      const data = await readFile(join(outputRoot, entry.path));
      const mismatch = integrityMismatch(entry.path, data, entry);
      if (mismatch) mismatches.push(mismatch);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        mismatches.push(`${entry.path}: MISSING`);
      } else {
        throw error;
      }
    }
  }
  if (mismatches.length > 0) {
    throw new Error(`Dragon pass-2 integrity check failed (${mismatches.length}):\n${mismatches.join('\n')}`);
  }
  return manifest.materialized?.length ?? 0;
}

const manifest = JSON.parse(await readFile(pass2Manifest, 'utf8'));
let materialized = 0;
for (const bundleFile of legacyBundles) {
  const result = await materializeBundle(await readBundle(join(root, bundleFile)));
  materialized += result.count;
}
const pass2Result = await materializeBundle(await readBundle(pass2Bundle), directPass2Assets);
materialized += pass2Result.count;
const assembled = await assemblePass2(manifest);
const verified = await verifyMaterialized(manifest);
console.log(`Dragon Mountain: ${materialized} assets materialized, ${pass2Result.preserved} direct pass-2 assets preserved, ${assembled} assembled, ${verified + assembled} pass-2 assets verified.`);
