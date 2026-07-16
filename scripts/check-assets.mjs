import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const registryPath = join(root, 'src/assets/registry/assets.json');
const assets = JSON.parse(readFileSync(registryPath, 'utf8'));
const errors = [];
const ids = new Set();

if (!Array.isArray(assets) || assets.length === 0) errors.push('Le registre doit contenir au moins un asset.');

for (const asset of assets) {
  if (!asset.id || ids.has(asset.id)) errors.push(`Identifiant absent ou dupliqué : ${asset.id ?? '(vide)'}`);
  ids.add(asset.id);

  if (!asset.path || !asset.alt || !asset.type) errors.push(`Métadonnées incomplètes pour ${asset.id}.`);
  if (!Number.isInteger(asset.width) || !Number.isInteger(asset.height)) errors.push(`Dimensions invalides pour ${asset.id}.`);
  if (!Number.isInteger(asset.maxBytes) || asset.maxBytes <= 0) errors.push(`Budget invalide pour ${asset.id}.`);
  if (!Array.isArray(asset.ageBands) || asset.ageBands.length === 0) errors.push(`Tranche d’âge absente pour ${asset.id}.`);

  const publicPath = join(root, 'public', asset.path ?? '');
  if (!existsSync(publicPath)) {
    errors.push(`Fichier introuvable pour ${asset.id} : public/${asset.path}`);
    continue;
  }

  const bytes = statSync(publicPath).size;
  if (bytes > asset.maxBytes) errors.push(`${asset.id} dépasse son budget : ${bytes}/${asset.maxBytes} octets.`);
}

if (errors.length > 0) {
  console.error(`Validation des assets en échec :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`${assets.length} assets validés : identifiants, métadonnées, fichiers et budgets conformes.`);
