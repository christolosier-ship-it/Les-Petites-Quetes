import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const required = [
  'vendor/beyond-fable/LICENSE',
  'vendor/beyond-fable/package.json',
  'vendor/beyond-fable/package-lock.json',
  'vendor/beyond-fable/src/world/World.ts',
  'vendor/origin/LICENSE',
  'vendor/origin/index.html',
  'vendor/vroom-scadoodles/UPSTREAM.md',
  'vendor/vroom-scadoodles/web/index.html',
  'vendor/vroom-scadoodles/web/index.js',
  'vendor/vroom-scadoodles/web/index.pck',
  'vendor/vroom-scadoodles/web/index.wasm',
];

const missing = required.filter((path) => !existsSync(resolve(root, path)));
if (missing.length) {
  console.error('Sources de jeux vendored manquantes :\n' + missing.map((path) => ' - ' + path).join('\n'));
  process.exit(1);
}
if (existsSync(resolve(root, '.gitmodules'))) {
  console.error('.gitmodules ne doit plus exister : les mini-jeux doivent être copiés localement.');
  process.exit(1);
}
for (const path of ['vendor/beyond-fable', 'vendor/vroom-scadoodles']) {
  const index = execFileSync('git', ['ls-files', '--stage', path], { cwd: root, encoding: 'utf8' });
  if (index.split('\n').some((line) => line.startsWith('160000 '))) {
    console.error(`${path} est encore un gitlink/submodule au lieu de vrais fichiers.`);
    process.exit(1);
  }
}
const origin = readFileSync(resolve(root, 'scripts/materialize-origin-game.mjs'), 'utf8');
if (origin.includes('raw.githubusercontent.com') || origin.includes('ORIGIN_URL')) {
  console.error('Origin dépend encore d’un téléchargement GitHub externe.');
  process.exit(1);
}
const vroom = readFileSync(resolve(root, 'scripts/materialize-vroom-scadoodles.mjs'), 'utf8');
if (vroom.includes('raw.githubusercontent.com') || vroom.includes('github.com/pstupka')) {
  console.error('Vroom Scadoodles dépend encore d’un téléchargement GitHub externe à l’exécution.');
  process.exit(1);
}
const ci = readFileSync(resolve(root, '.github/workflows/ci.yml'), 'utf8');
if (/submodules\s*:\s*recursive/.test(ci)) {
  console.error('La CI initialise encore des sous-modules Git.');
  process.exit(1);
}
console.log('Sources de jeux autonomes : Beyond Fable, Origin et Vroom Scadoodles sont vendored localement.');
