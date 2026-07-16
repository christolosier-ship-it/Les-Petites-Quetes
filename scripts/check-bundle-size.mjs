import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const distAssets = join(process.cwd(), 'dist', 'assets');
if (!existsSync(distAssets)) {
  console.error('Le dossier dist/assets est absent. Lancez le build avant le contrôle du bundle.');
  process.exit(1);
}

const files = readdirSync(distAssets);
const javascriptBytes = files
  .filter((file) => file.endsWith('.js'))
  .reduce((total, file) => total + statSync(join(distAssets, file)).size, 0);
const cssBytes = files
  .filter((file) => file.endsWith('.css'))
  .reduce((total, file) => total + statSync(join(distAssets, file)).size, 0);

const budgets = { javascript: 350_000, css: 120_000 };
const errors = [];
if (javascriptBytes > budgets.javascript) errors.push(`JavaScript : ${javascriptBytes}/${budgets.javascript} octets.`);
if (cssBytes > budgets.css) errors.push(`CSS : ${cssBytes}/${budgets.css} octets.`);

if (errors.length > 0) {
  console.error(`Budget du bundle dépassé :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Bundle conforme : ${javascriptBytes} octets JS, ${cssBytes} octets CSS.`);
