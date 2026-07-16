import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const graph = new Map();

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), specifier);
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ];
  return candidates.find(existsSync) ?? null;
}

const files = walk(sourceRoot).filter((path) => /\.(ts|tsx)$/.test(path) && !/\.test\.(ts|tsx)$/.test(path));
for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const imports = [...content.matchAll(/(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g)]
    .map((match) => resolveImport(file, match[1]))
    .filter(Boolean)
    .map(normalize);
  graph.set(normalize(file), imports);
}

const visiting = new Set();
const visited = new Set();
const stack = [];
let cycle = null;

function visit(file) {
  if (cycle || visited.has(file)) return;
  if (visiting.has(file)) {
    const start = stack.indexOf(file);
    cycle = [...stack.slice(start), file];
    return;
  }

  visiting.add(file);
  stack.push(file);
  for (const dependency of graph.get(file) ?? []) visit(dependency);
  stack.pop();
  visiting.delete(file);
  visited.add(file);
}

for (const file of graph.keys()) visit(file);

if (cycle) {
  console.error(`Cycle de dépendances détecté :\n${cycle.map((file) => relative(root, file)).join(' -> ')}`);
  process.exit(1);
}

console.log(`Aucun cycle détecté dans ${graph.size} modules applicatifs.`);
