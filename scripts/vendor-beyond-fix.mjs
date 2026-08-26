import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TEMP = join(ROOT, '.generated', 'vendor-fix');
const TARGET = join(ROOT, 'vendor', 'beyond-fable');
const COMMIT = '6e33885a2327e28dceaf70940e1563d6e75e1219';

function run(command, args, cwd = ROOT) {
  return execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

rmSync(TEMP, { recursive: true, force: true });
mkdirSync(TEMP, { recursive: true });
run('git', ['init', '-q'], TEMP);
run('git', ['remote', 'add', 'origin', 'https://github.com/xikhar/beyond-fable.git'], TEMP);
run('git', ['fetch', '--depth=1', 'origin', COMMIT], TEMP);
run('git', ['checkout', '--detach', 'FETCH_HEAD'], TEMP);

// Important : retirer explicitement le gitlink de l'index avant de poser les fichiers.
run('git', ['rm', '-f', '--cached', 'vendor/beyond-fable']);
rmSync(TARGET, { recursive: true, force: true });
cpSync(TEMP, TARGET, {
  recursive: true,
  filter(source) {
    const rel = relative(TEMP, source).replaceAll('\\', '/');
    if (!rel) return true;
    if (rel === '.git' || rel.startsWith('.git/')) return false;
    if (rel === '.github' || rel.startsWith('.github/')) return false;
    if (rel === 'AGENTS.md' || rel === 'CLAUDE.md') return false;
    return true;
  },
});
write(join(TARGET, 'UPSTREAM.md'), `# Beyond Fable — provenance\n\n- Projet original : https://github.com/xikhar/beyond-fable\n- Auteur / copyright : Shikhar, 2026\n- Licence : MIT (voir \`LICENSE\`)\n- Commit importé : \`${COMMIT}\`\n- Mode d'intégration : copie locale vendored dans Les Petites Quêtes. Le build ne dépend plus du dépôt Git amont.\n- Adaptations LPQ : commandes tactiles, preset tablette et intégration iframe appliqués par \`scripts/materialize-beyond-fable.mjs\`.\n`);

const checkPath = join(ROOT, 'scripts', 'check-vendored-games.mjs');
let check = readFileSync(checkPath, 'utf8');
check = check.replace(
  "import { existsSync, readFileSync } from 'node:fs';",
  "import { execFileSync } from 'node:child_process';\nimport { existsSync, readFileSync } from 'node:fs';",
);
check = check.replace(
  "if (existsSync(resolve(root, '.gitmodules'))) {\n  console.error('.gitmodules ne doit plus exister : les mini-jeux doivent être copiés localement.');\n  process.exit(1);\n}\n",
  "if (existsSync(resolve(root, '.gitmodules'))) {\n  console.error('.gitmodules ne doit plus exister : les mini-jeux doivent être copiés localement.');\n  process.exit(1);\n}\nconst beyondIndex = execFileSync('git', ['ls-files', '--stage', 'vendor/beyond-fable'], { cwd: root, encoding: 'utf8' });\nif (beyondIndex.split('\\n').some((line) => line.startsWith('160000 '))) {\n  console.error('vendor/beyond-fable est encore un gitlink/submodule au lieu de vrais fichiers.');\n  process.exit(1);\n}\n",
);
writeFileSync(checkPath, check, 'utf8');

rmSync(TEMP, { recursive: true, force: true });
console.log('Gitlink Beyond Fable remplacé par une vraie arborescence vendored.');
