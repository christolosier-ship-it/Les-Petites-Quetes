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
  const raw = await readFile(bundleFile, 'utf8');
  return JSON.parse(raw);
}

async function materializeBundle(bundle) {
  let count = 0;
  for (const [relativePath, encoded] of Object.entries(bundle.files ?? {})) {
    const outputPath = join(outputRoot, relativePath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, Buffer.from(encoded, 'base64'));
    count += 1;
  }
  return count;
}

function auditBundle(bundle, manifest) {
  const actual = new Map(Object.entries(bundle.files ?? {}).map(([path, encoded]) => {
    const data = Buffer.from(encoded, 'base64');
    return [path, { bytes: data.byteLength, sha256: sha256(data) }];
  }));
  const mismatches = [];
  for (const entry of manifest.materialized ?? []) {
    const found = actual.get(entry.path);
    if (!found) {
      mismatches.push(`${entry.path}: MISSING`);
    } else if (found.bytes !== entry.bytes || found.sha256 !== entry.sha256) {
      mismatches.push(`${entry.path}: expected ${entry.bytes}/${entry.sha256}, got ${found.bytes}/${found.sha256}`);
    }
  }
  if (mismatches.length > 0) {
    const inventory = [...actual.entries()].map(([path, meta]) => `${path}: ${meta.bytes}/${meta.sha256}`);
    throw new Error(`Dragon derived bundle audit failed (${mismatches.length}):\n${mismatches.join('\n')}\nActual bundle inventory:\n${inventory.join('\n')}`);
  }
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

const manifest = JSON.parse(await readFile(pass2Manifest, 'utf8'));
const pass2 = await readBundle(pass2Bundle);
auditBundle(pass2, manifest);
let count = 0;
for (const bundleFile of legacyBundles) count += await materializeBundle(await readBundle(join(root, bundleFile)));
count += await materializeBundle(pass2);
const assembled = await assemblePass2(manifest);
console.log(`Dragon Mountain: ${count} assets materialized, ${assembled} assembled, ${(manifest.materialized?.length ?? 0) + assembled} pass-2 assets verified.`);
