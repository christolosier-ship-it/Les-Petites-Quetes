export type SceneAssetCategory = 'Structure' | 'Classe' | 'Cantine' | 'Cour' | 'Personnages' | 'Terrain' | 'Décor' | 'Monstres';

export interface SceneAssetDefinition {
  readonly id: string;
  readonly file: string;
  readonly label: string;
  readonly category: SceneAssetCategory;
  readonly source: string;
  readonly width: number;
  readonly height: number;
  readonly sourceWidth?: number;
  readonly cropX?: number;
}

type ManifestItem = Readonly<{ file: string; source: string; width: number; height: number }>;
type Manifest = Readonly<{ items?: ManifestItem[] }>;
type ManifestSource = Readonly<{ url: string; prefix: string }>;

const GNOME_MANIFESTS: ManifestSource[] = [
  { url: '/worlds/gnome-village/structure/manifest.json', prefix: 'structure/' },
  { url: '/worlds/gnome-village/manifest-habbo-only-school.json', prefix: '' },
  { url: '/worlds/gnome-village/manifest-lots-2-4.json', prefix: '' },
];

const STRAIGHT_WALLS: SceneAssetDefinition[] = [
  { id: 'derived:wall-school-straight', file: 'structure/wall-school.png', label: 'Mur droit école', category: 'Structure', source: 'school_wall · section centrale droite', width: 84, height: 186, sourceWidth: 111, cropX: 14 },
  { id: 'derived:wall-academic-straight', file: 'structure/wall-academic.png', label: 'Mur droit académique', category: 'Structure', source: 'school_c22_wall · section centrale droite', width: 84, height: 187, sourceWidth: 111, cropX: 14 },
];

const NINJA_ROOT = '/worlds/dragon-mountain/ninja-adventure';
const ninja = (path: string) => `${NINJA_ROOT}/${path}`;
const source = 'Pixel-Boy / Ninja Adventure CC0';

const DRAGON_ASSETS: SceneAssetDefinition[] = [
  { id: 'ninja:ninja-green', file: ninja('Actor/CharacterAnimated/NinjaGreen/SpriteSheet.png'), label: 'Ninja vert animé', category: 'Personnages', source, width: 64, height: 136 },
  { id: 'ninja:ninja-blue', file: ninja('Actor/Character/NinjaBlue/SpriteSheet.png'), label: 'Ninja bleu', category: 'Personnages', source, width: 64, height: 112 },
  { id: 'ninja:samurai-blue', file: ninja('Actor/Character/SamuraiBlue/SpriteSheet.png'), label: 'Samouraï bleu', category: 'Personnages', source, width: 64, height: 112 },
  { id: 'ninja:skeleton', file: ninja('Actor/Character/Skeleton/SpriteSheet.png'), label: 'Squelette', category: 'Monstres', source, width: 64, height: 112 },
  { id: 'ninja:slime', file: ninja('Actor/Monster/Slime/Slime.png'), label: 'Slime', category: 'Monstres', source, width: 64, height: 64 },
  { id: 'ninja:lizard', file: ninja('Actor/Monster/Lizard/Lizard.png'), label: 'Lézard', category: 'Monstres', source, width: 64, height: 64 },
  { id: 'ninja:dragon-green-head', file: ninja('Actor/Boss/DragonGreen/Head.png'), label: 'Dragon vert · tête', category: 'Monstres', source, width: 88, height: 92 },
  { id: 'ninja:dragon-green-wing', file: ninja('Actor/Boss/DragonGreen/Wing.png'), label: 'Dragon vert · aile', category: 'Monstres', source, width: 114, height: 114 },
  { id: 'ninja:tiles-nature', file: ninja('Backgrounds/Tilesets/TilesetNature.png'), label: 'Tileset nature', category: 'Terrain', source, width: 192, height: 168 },
  { id: 'ninja:tiles-water', file: ninja('Backgrounds/Tilesets/TilesetWater.png'), label: 'Tileset eau', category: 'Terrain', source, width: 224, height: 136 },
  { id: 'ninja:tiles-desert', file: ninja('Backgrounds/Tilesets/TilesetDesert.png'), label: 'Tileset désert', category: 'Terrain', source, width: 160, height: 96 },
  { id: 'ninja:tiles-relief', file: ninja('Backgrounds/Tilesets/TilesetRelief.png'), label: 'Tileset relief', category: 'Terrain', source, width: 160, height: 96 },
  { id: 'ninja:tiles-house', file: ninja('Backgrounds/Tilesets/TilesetHouse.png'), label: 'Tileset village', category: 'Structure', source, width: 264, height: 184 },
  { id: 'ninja:tiles-ruins', file: ninja('Backgrounds/Tilesets/TilesetVillageAbandoned.png'), label: 'Village abandonné', category: 'Décor', source, width: 212, height: 160 },
];

function categoryFor(file: string): SceneAssetCategory {
  if (file.startsWith('classroom/')) return 'Classe';
  if (file.startsWith('cafeteria/')) return 'Cantine';
  if (file.startsWith('courtyard/')) return 'Cour';
  if (file.startsWith('actors/')) return 'Personnages';
  return 'Structure';
}

function humanize(file: string) {
  const name = file.split('/').at(-1) ?? file;
  return name.replace(/\.(png|svg|webp)$/i, '').replace(/[-_]+/g, ' ');
}

async function loadManifest(sourceManifest: ManifestSource) {
  const response = await fetch(sourceManifest.url);
  if (!response.ok) throw new Error(`Manifest indisponible: ${sourceManifest.url}`);
  const manifest = await response.json() as Manifest;
  return (manifest.items ?? []).flatMap((item): SceneAssetDefinition[] => {
    if (!item.file || !item.source || !Number.isFinite(item.width) || !Number.isFinite(item.height)) return [];
    const file = `${sourceManifest.prefix}${item.file}`;
    return [{ id: `${sourceManifest.url}:${file}`, file, label: humanize(file), category: categoryFor(file), source: item.source, width: item.width, height: item.height }];
  });
}

export async function loadSceneAssetCatalog(sceneId = 'gnome-village-campus-v1') {
  if (sceneId.startsWith('dragon-mountain')) return DRAGON_ASSETS;
  const groups = await Promise.all(GNOME_MANIFESTS.map(loadManifest));
  const unique = new Map<string, SceneAssetDefinition>();
  for (const asset of [...groups.flat(), ...STRAIGHT_WALLS]) {
    const key = `${asset.id}:${asset.file}`;
    if (!unique.has(key)) unique.set(key, asset);
  }
  return [...unique.values()].sort((a, b) => a.category.localeCompare(b.category, 'fr') || a.label.localeCompare(b.label, 'fr'));
}

export function assetSrc(file: string) {
  if (file.startsWith('/')) return file;
  return /^https?:\/\//.test(file) ? file : `/worlds/gnome-village/${file}`;
}
