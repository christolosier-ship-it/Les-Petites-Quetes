import rawFireflyAssets from './firefly-assets.json';
import type { AssetDefinition } from './types';

const fireflyAssets = rawFireflyAssets as readonly AssetDefinition[];
const fireflyAssetsById = new Map(fireflyAssets.map((asset) => [asset.id, asset]));

export const FIREFLY_ILLUSTRATION_ASSETS = {
  meadow: 'world.firefly-forest.diorama-meadow',
  cottage: 'world.firefly-forest.diorama-cottage',
  rusticHouse: 'world.firefly-forest.diorama-rustic-house',
  treeHouse: 'world.firefly-forest.diorama-tree-house',
  foliage: 'world.firefly-forest.diorama-foliage',
  reliefPeakA: 'world.firefly-forest.relief-peak-a',
  reliefPeakB: 'world.firefly-forest.relief-peak-b',
  reliefCliff: 'world.firefly-forest.relief-cliff',
  distantPines: 'world.firefly-forest.distant-pines',
  deciduous1: 'world.firefly-forest.tree-deciduous-1',
  deciduous2: 'world.firefly-forest.tree-deciduous-2',
  deciduous3: 'world.firefly-forest.tree-deciduous-3',
  coniferous1: 'world.firefly-forest.tree-coniferous-1',
  coniferous3: 'world.firefly-forest.tree-coniferous-3',
  bridge: 'world.firefly-forest.bridge-original',
  bushRound: 'world.firefly-forest.vegetation-bush-round',
  bushLow: 'world.firefly-forest.vegetation-bush-low',
  fern: 'world.firefly-forest.vegetation-fern',
  flowerBush: 'world.firefly-forest.vegetation-flower-bush',
  wildflowers: 'world.firefly-forest.vegetation-wildflowers',
  mushroomAmanita: 'world.firefly-forest.vegetation-mushroom-amanita',
  mushroomAqua: 'world.firefly-forest.vegetation-mushroom-aqua',
  reeds: 'world.firefly-forest.vegetation-reeds',
  waterRockA: 'world.firefly-forest.terrain-water-rock-a',
  waterRockB: 'world.firefly-forest.terrain-water-rock-b',
  groundPatchA: 'world.firefly-forest.terrain-ground-patch-a',
  groundPatchB: 'world.firefly-forest.terrain-ground-patch-b',
  wave1: 'world.firefly-forest.terrain-wave-1',
  wave2: 'world.firefly-forest.terrain-wave-2',
  wave3: 'world.firefly-forest.terrain-wave-3',
} as const;

export function getFireflyAssetUrl(id: string): string {
  const asset = fireflyAssetsById.get(id);
  if (!asset) throw new Error(`Asset Firefly inconnu : ${id}`);
  return `${import.meta.env.BASE_URL}${asset.path}`;
}
