import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TEMP = join(ROOT, '.generated', 'vendor-bootstrap');
const BEYOND_COMMIT = '6e33885a2327e28dceaf70940e1563d6e75e1219';
const ORIGIN_COMMIT = '1e11bd3faee664160faa6b2e6bd440fa7304b603';

function run(command, args, cwd = ROOT) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

function replaceExact(path, before, after, expected = 1) {
  const source = readFileSync(path, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== expected) throw new Error(`Patch inattendu dans ${path}: ${count}/${expected}`);
  writeFileSync(path, source.split(before).join(after), 'utf8');
}

function checkout(url, commit, target) {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  run('git', ['init', '-q'], target);
  run('git', ['remote', 'add', 'origin', url], target);
  run('git', ['fetch', '--depth=1', 'origin', commit], target);
  run('git', ['checkout', '--detach', 'FETCH_HEAD'], target);
}

rmSync(TEMP, { recursive: true, force: true });
mkdirSync(TEMP, { recursive: true });

const beyondTmp = join(TEMP, 'beyond-fable');
checkout('https://github.com/xikhar/beyond-fable.git', BEYOND_COMMIT, beyondTmp);
const beyondVendor = join(ROOT, 'vendor', 'beyond-fable');
rmSync(beyondVendor, { recursive: true, force: true });
cpSync(beyondTmp, beyondVendor, {
  recursive: true,
  filter(source) {
    const rel = relative(beyondTmp, source).replaceAll('\\', '/');
    if (!rel) return true;
    if (rel === '.git' || rel.startsWith('.git/')) return false;
    if (rel === '.github' || rel.startsWith('.github/')) return false;
    if (rel === 'AGENTS.md' || rel === 'CLAUDE.md') return false;
    return true;
  },
});
write(join(beyondVendor, 'UPSTREAM.md'), `# Beyond Fable — provenance\n\n- Projet original : https://github.com/xikhar/beyond-fable\n- Auteur / copyright : Shikhar, 2026\n- Licence : MIT (voir \`LICENSE\`)\n- Commit importé : \`${BEYOND_COMMIT}\`\n- Mode d'intégration : copie locale vendored dans Les Petites Quêtes. Le build ne dépend plus du dépôt Git amont.\n- Adaptations LPQ : commandes tactiles, preset tablette et intégration iframe appliqués par \`scripts/materialize-beyond-fable.mjs\`.\n`);

const originTmp = join(TEMP, 'origin');
checkout('https://github.com/DFarm6/origin-16bit-arpg.git', ORIGIN_COMMIT, originTmp);
const originVendor = join(ROOT, 'vendor', 'origin');
rmSync(originVendor, { recursive: true, force: true });
mkdirSync(originVendor, { recursive: true });
cpSync(join(originTmp, 'index.html'), join(originVendor, 'index.html'));
cpSync(join(originTmp, 'LICENSE'), join(originVendor, 'LICENSE'));
write(join(originVendor, 'UPSTREAM.md'), `# Origin 16-bit ARPG — provenance\n\n- Projet original : https://github.com/DFarm6/origin-16bit-arpg\n- Auteur / copyright : DFarm6, 2026\n- Licence : MIT (voir \`LICENSE\`)\n- Commit importé : \`${ORIGIN_COMMIT}\`\n- Mode d'intégration : copie locale vendored dans Les Petites Quêtes. Le build ne télécharge plus le jeu depuis GitHub.\n- Adaptations LPQ : traduction française, persistance locale et intégration tactile appliquées par les scripts \`origin-fr-*\` et \`materialize-origin-game.mjs\`.\n`);

const gitmodules = join(ROOT, '.gitmodules');
if (existsSync(gitmodules)) rmSync(gitmodules);

const originMaterializer = join(ROOT, 'scripts', 'materialize-origin-game.mjs');
replaceExact(
  originMaterializer,
  "import { mkdir, writeFile } from 'node:fs/promises';",
  "import { mkdir, readFile, writeFile } from 'node:fs/promises';",
);
replaceExact(
  originMaterializer,
  "const OUTPUT = resolve(ROOT, 'public/games/origin/index.html');",
  "const SOURCE = resolve(ROOT, 'vendor/origin/index.html');\nconst OUTPUT = resolve(ROOT, 'public/games/origin/index.html');",
);
replaceExact(
  originMaterializer,
  "const ORIGIN_URL = `https://raw.githubusercontent.com/DFarm6/origin-16bit-arpg/${ORIGIN_COMMIT}/index.html`;\n",
  '',
);
replaceExact(
  originMaterializer,
  "const response = await fetch(ORIGIN_URL, { headers: { 'user-agent': 'les-petites-quetes-build' } });\nif (!response.ok) throw new Error(`Impossible de récupérer Origin (${response.status} ${response.statusText})`);\nconst upstream = await response.text();\nconst actualSha = gitBlobSha(upstream);\nif (actualSha !== ORIGIN_BLOB_SHA) throw new Error(`Origin: empreinte source inattendue (${actualSha}, attendu ${ORIGIN_BLOB_SHA})`);",
  "const upstream = await readFile(SOURCE, 'utf8');\nconst actualSha = gitBlobSha(upstream);\nif (actualSha !== ORIGIN_BLOB_SHA) throw new Error(`Origin (${ORIGIN_COMMIT}) : empreinte source vendored inattendue (${actualSha}, attendu ${ORIGIN_BLOB_SHA})`);",
);

const beyondMaterializer = join(ROOT, 'scripts', 'materialize-beyond-fable.mjs');
replaceExact(
  beyondMaterializer,
  "fail('Le sous-module vendor/beyond-fable est absent. Initialisez les sous-modules Git avant le build.');",
  "fail('La copie locale vendor/beyond-fable est absente ou incomplète.');",
);

const ci = join(ROOT, '.github', 'workflows', 'ci.yml');
replaceExact(ci, "        with:\n          submodules: recursive\n", '');

write(join(ROOT, 'scripts', 'check-vendored-games.mjs'), `import { existsSync, readFileSync } from 'node:fs';\nimport { resolve } from 'node:path';\n\nconst root = process.cwd();\nconst required = [\n  'vendor/beyond-fable/LICENSE',\n  'vendor/beyond-fable/package.json',\n  'vendor/beyond-fable/package-lock.json',\n  'vendor/beyond-fable/src/world/World.ts',\n  'vendor/origin/LICENSE',\n  'vendor/origin/index.html',\n];\n\nconst missing = required.filter((path) => !existsSync(resolve(root, path)));\nif (missing.length) {\n  console.error('Sources de jeux vendored manquantes :\\n' + missing.map((path) => ' - ' + path).join('\\n'));\n  process.exit(1);\n}\nif (existsSync(resolve(root, '.gitmodules'))) {\n  console.error('.gitmodules ne doit plus exister : les mini-jeux doivent être copiés localement.');\n  process.exit(1);\n}\nconst origin = readFileSync(resolve(root, 'scripts/materialize-origin-game.mjs'), 'utf8');\nif (origin.includes('raw.githubusercontent.com') || origin.includes('ORIGIN_URL')) {\n  console.error('Origin dépend encore d’un téléchargement GitHub externe.');\n  process.exit(1);\n}\nconst ci = readFileSync(resolve(root, '.github/workflows/ci.yml'), 'utf8');\nif (/submodules\\s*:\\s*recursive/.test(ci)) {\n  console.error('La CI initialise encore des sous-modules Git.');\n  process.exit(1);\n}\nconsole.log('Sources de jeux autonomes : Beyond Fable et Origin sont vendored localement.');\n`);

const packagePath = join(ROOT, 'package.json');
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
pkg.scripts['check:vendor'] = 'node scripts/check-vendored-games.mjs';
pkg.scripts['check:architecture'] = 'npm run check:vendor && node scripts/check-architecture.mjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

write(join(ROOT, 'docs', 'ORIGIN-INTEGRATION.md'), `# Origin dans Les Petites Quêtes\n\nLe tableau **La Montagne du Dragon** embarque le mini-jeu Origin 16-bit ARPG comme jeu web autonome.\n\n## Source locale figée\n\n- Projet amont : \`DFarm6/origin-16bit-arpg\`\n- Commit importé : \`${ORIGIN_COMMIT}\`\n- Licence : MIT, conservée dans \`vendor/origin/LICENSE\` et \`public/games/origin/LICENSE\`\n- Source : copie locale dans \`vendor/origin/index.html\`\n\nLe build de Les Petites Quêtes ne contacte plus le dépôt amont. \`materialize-origin-game.mjs\` lit la copie locale, vérifie son Git blob SHA, applique la traduction française et génère \`public/games/origin/index.html\`.\n\n## Intégration UI\n\n\`DragonMountainGame.tsx\` charge le jeu dans une iframe same-origin. Le mini-jeu conserve ses contrôles clavier et tactiles et propose un mode grand écran. Les sauvegardes utilisent \`localStorage\` avec le préfixe \`lpq:origin:\`.\n`);

write(join(ROOT, 'docs', 'BEYOND-FABLE-INTEGRATION.md'), `# Beyond Fable dans Les Petites Quêtes\n\nLe tableau **Forêt des Lucioles** embarque Beyond Fable comme mini-jeu web autonome.\n\n## Source locale figée\n\n- Projet amont : \`xikhar/beyond-fable\`\n- Commit importé : \`${BEYOND_COMMIT}\`\n- Licence : MIT, conservée dans \`vendor/beyond-fable/LICENSE\`\n- Source : copie locale complète dans \`vendor/beyond-fable/\`\n\nIl ne s'agit plus d'un sous-module. Le clone de Les Petites Quêtes contient réellement le code du jeu. \`materialize-beyond-fable.mjs\` copie cette source dans un workspace temporaire, applique uniquement les adaptations LPQ puis compile le mini-jeu vers \`public/games/beyond-fable/\`.\n\nLes références au dépôt amont restent uniquement documentaires dans \`UPSTREAM.md\`; elles ne participent ni au build ni au runtime.\n`);

rmSync(TEMP, { recursive: true, force: true });
console.log('Migration vendored préparée : Beyond Fable et Origin sont désormais locaux.');
