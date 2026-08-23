import rawAssets from './assets.json';
import rawAvatars from './avatars.json';
import type { AssetDefinition } from './types';

const avatarIds = new Set(rawAvatars.map((asset) => asset.id));
const assets = [
  ...rawAssets.filter((asset) => !avatarIds.has(asset.id)),
  ...rawAvatars,
] as readonly AssetDefinition[];
const assetsById = new Map(assets.map((asset) => [asset.id, asset]));

export function getAsset(id: string): AssetDefinition {
  const asset = assetsById.get(id);
  if (!asset) throw new Error(`Asset inconnu : ${id}`);
  return asset;
}

export function getAssetUrl(id: string): string {
  const asset = getAsset(id);
  return `${import.meta.env.BASE_URL}${asset.path}`;
}

export function listAssets(): readonly AssetDefinition[] {
  return assets;
}
