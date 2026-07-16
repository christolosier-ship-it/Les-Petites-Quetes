import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const errors = [];
const warnings = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(sourceRoot).filter((path) => /\.(ts|tsx|css)$/.test(path))) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/).length;
  const path = relative(root, file);
  const maximum = file.endsWith('.tsx') ? 180 : 300;
  const warning = file.endsWith('.tsx') ? 140 : 220;

  if (lines > maximum) errors.push(`${path} dépasse ${maximum} lignes (${lines}).`);
  else if (lines > warning) warnings.push(`${path} approche la limite (${lines}/${maximum}).`);
}

for (const warning of warnings) console.warn(`Avertissement : ${warning}`);
if (errors.length > 0) {
  console.error(`Budgets de fichiers dépassés :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Budgets de fichiers respectés.');
