import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const distAssets = join(process.cwd(), 'dist', 'assets');
const manifestPath = join(process.cwd(), 'dist', '.vite', 'manifest.json');
if (!existsSync(distAssets) || !existsSync(manifestPath)) {
  console.error('Le build ou son manifeste Vite est absent. Lancez le build avant le contrôle du bundle.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entries = Object.entries(manifest);
const entry = entries.find(([, value]) => value.isEntry);
if (!entry) {
  console.error('Le manifeste Vite ne contient aucune entrée applicative.');
  process.exit(1);
}

function closure(rootKey) {
  const visited = new Set();
  const stack = [rootKey];
  while (stack.length > 0) {
    const key = stack.pop();
    if (!key || visited.has(key)) continue;
    visited.add(key);
    for (const imported of manifest[key]?.imports ?? []) stack.push(imported);
  }
  return visited;
}

function javascriptBytes(keys) {
  const files = new Set(
    [...keys]
      .map((key) => manifest[key]?.file)
      .filter((file) => typeof file === 'string' && file.endsWith('.js')),
  );
  return [...files].reduce((total, file) => total + statSync(join(process.cwd(), 'dist', file)).size, 0);
}

const coreKeys = closure(entry[0]);
const coreBytes = javascriptBytes(coreKeys);
const dynamicEntries = entries.filter(([, value]) => value.isDynamicEntry);
const dynamicBudgets = dynamicEntries.map(([key]) => {
  const keys = closure(key);
  for (const coreKey of coreKeys) keys.delete(coreKey);
  return { key, bytes: javascriptBytes(keys) };
});
const cssBytes = readdirSync(distAssets)
  .filter((file) => file.endsWith('.css'))
  .reduce((total, file) => total + statSync(join(distAssets, file)).size, 0);

const budgets = { core: 350_000, dynamicEntry: 650_000, css: 120_000 };
const errors = [];
if (coreBytes > budgets.core) errors.push(`JavaScript initial : ${coreBytes}/${budgets.core} octets.`);
for (const dynamic of dynamicBudgets) {
  if (dynamic.bytes > budgets.dynamicEntry) errors.push(`Chunk différé ${dynamic.key} : ${dynamic.bytes}/${budgets.dynamicEntry} octets.`);
}
if (cssBytes > budgets.css) errors.push(`CSS : ${cssBytes}/${budgets.css} octets.`);

if (errors.length > 0) {
  console.error(`Budget du bundle dépassé :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

const dynamicSummary = dynamicBudgets.length === 0
  ? 'aucun chunk différé'
  : dynamicBudgets.map(({ key, bytes }) => `${key}: ${bytes}`).join(', ');
console.log(`Bundle conforme : ${coreBytes} octets JS initiaux, ${cssBytes} octets CSS ; ${dynamicSummary}.`);
