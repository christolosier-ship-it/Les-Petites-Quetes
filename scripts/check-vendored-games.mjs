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
const origin = readFileSync(resolve(root, 'scripts/materialize-origin-game.mjs'), 'utf8');
if (origin.includes('raw.githubusercontent.com') || origin.includes('ORIGIN_URL')) {
  console.error('Origin dépend encore d’un téléchargement GitHub externe.');
  process.exit(1);
}
const ci = readFileSync(resolve(root, '.github/workflows/ci.yml'), 'utf8');
if (/submodules\s*:\s*recursive/.test(ci)) {
  console.error('La CI initialise encore des sous-modules Git.');
  process.exit(1);
}
console.log('Sources de jeux autonomes : Beyond Fable et Origin sont vendored localement.');
