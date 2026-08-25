import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = process.cwd();
const bundleFiles = [
  'assets/dragon-mountain/bundles/actors.json',
  'assets/dragon-mountain/bundles/dragons.json',
];
const outputRoot = join(root, 'public/worlds/dragon-mountain/ninja-adventure');
let count = 0;

for (const bundleFile of bundleFiles) {
  const raw = await readFile(join(root, bundleFile), 'utf8');
  const bundle = JSON.parse(raw);
  for (const [relativePath, encoded] of Object.entries(bundle.files ?? {})) {
    const outputPath = join(outputRoot, relativePath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, Buffer.from(encoded, 'base64'));
    count += 1;
  }
}

console.log(`Dragon Mountain: ${count} assets materialized.`);
