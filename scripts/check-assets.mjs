import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const registryFiles = ['assets.json', 'avatars.json'];
const registries = registryFiles.map((file) => ({
  file,
  assets: JSON.parse(readFileSync(join(root, 'src/assets/registry', file), 'utf8')),
}));
const errors = [];

for (const registry of registries) {
  const ids = new Set();
  for (const asset of registry.assets) {
    if (!asset.id || ids.has(asset.id)) errors.push(`Identifiant absent ou dupliqué dans ${registry.file} : ${asset.id ?? '(vide)'}`);
    ids.add(asset.id);
  }
}

const avatarIds = new Set(registries[1].assets.map((asset) => asset.id));
const assets = [
  ...registries[0].assets.filter((asset) => !avatarIds.has(asset.id)),
  ...registries[1].assets,
];

if (assets.length === 0) errors.push('Le registre doit contenir au moins un asset.');

for (const asset of assets) {
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

console.log(`${assets.length} assets effectifs validés dans ${registryFiles.length} registres.`);
