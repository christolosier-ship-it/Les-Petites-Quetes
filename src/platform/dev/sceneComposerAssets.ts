export type SceneAssetCategory = 'Structure' | 'Classe' | 'Cantine' | 'Cour' | 'Personnages' | 'Terrain' | 'Décor' | 'Monstres' | 'FX';

export interface SceneAssetDefinition {
  readonly id: string;
  readonly file: string;
  readonly label: string;
  readonly category: SceneAssetCategory;
  readonly source: string;
  readonly width: number;
  readonly height: number;
  readonly sourceWidth?: number;
  readonly sourceHeight?: number;
  readonly cropX?: number;
  readonly cropY?: number;
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
const derived = (name: string) => `${NINJA_ROOT}/Derived/${name}.webp`;
const ninja = (path: string) => `${NINJA_ROOT}/${path}`;
const source = 'Pixel-Boy / Ninja Adventure CC0';

const DRAGON_ASSETS: SceneAssetDefinition[] = [
  { id: 'dragon:tree-round-green', file: derived('static-atlas'), label: 'Arbre rond vert', category: 'Terrain', source, width: 64, height: 58, sourceWidth: 2048, sourceHeight: 544, cropX: 8, cropY: 8 },
  { id: 'dragon:tree-pine-green', file: derived('static-atlas'), label: 'Pin vert', category: 'Terrain', source, width: 64, height: 94, sourceWidth: 2048, sourceHeight: 544, cropX: 80, cropY: 8 },
  { id: 'dragon:tree-dead', file: derived('static-atlas'), label: 'Arbre mort', category: 'Terrain', source, width: 64, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 152, cropY: 8 },
  { id: 'dragon:tree-rooted-green', file: derived('static-atlas'), label: 'Arbre racines', category: 'Terrain', source, width: 64, height: 94, sourceWidth: 2048, sourceHeight: 544, cropX: 224, cropY: 8 },
  { id: 'dragon:tree-snow', file: derived('static-atlas'), label: 'Arbre enneigé', category: 'Terrain', source, width: 64, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 296, cropY: 8 },
  { id: 'dragon:tree-pink', file: derived('static-atlas'), label: 'Arbre rose', category: 'Terrain', source, width: 64, height: 92, sourceWidth: 2048, sourceHeight: 544, cropX: 368, cropY: 8 },
  { id: 'dragon:tree-big-green', file: derived('static-atlas'), label: 'Grand arbre vert', category: 'Terrain', source, width: 96, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 440, cropY: 8 },
  { id: 'dragon:tree-big-white', file: derived('static-atlas'), label: 'Grand arbre blanc', category: 'Terrain', source, width: 96, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 544, cropY: 8 },
  { id: 'dragon:tree-big-autumn', file: derived('static-atlas'), label: 'Grand arbre automne', category: 'Terrain', source, width: 96, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 648, cropY: 8 },
  { id: 'dragon:rocks-orange', file: derived('static-atlas'), label: 'Rochers ocre', category: 'Terrain', source, width: 160, height: 92, sourceWidth: 2048, sourceHeight: 544, cropX: 752, cropY: 8 },
  { id: 'dragon:rocks-gray', file: derived('static-atlas'), label: 'Rochers gris', category: 'Terrain', source, width: 160, height: 92, sourceWidth: 2048, sourceHeight: 544, cropX: 920, cropY: 8 },
  { id: 'dragon:flowers', file: derived('static-atlas'), label: 'Fleurs et herbes', category: 'Décor', source, width: 190, height: 64, sourceWidth: 2048, sourceHeight: 544, cropX: 1088, cropY: 8 },
  { id: 'dragon:grass-props', file: derived('static-atlas'), label: 'Végétation basse', category: 'Décor', source, width: 188, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1286, cropY: 8 },
  { id: 'dragon:logs', file: derived('static-atlas'), label: 'Troncs et souches', category: 'Décor', source, width: 64, height: 128, sourceWidth: 2048, sourceHeight: 544, cropX: 1482, cropY: 8 },
  { id: 'dragon:house-orange', file: derived('static-atlas'), label: 'Maison orange', category: 'Structure', source, width: 128, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1554, cropY: 8 },
  { id: 'dragon:house-orange-2', file: derived('static-atlas'), label: 'Maison orange II', category: 'Structure', source, width: 128, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1690, cropY: 8 },
  { id: 'dragon:dojo', file: derived('static-atlas'), label: 'Dojo', category: 'Structure', source, width: 96, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1826, cropY: 8 },
  { id: 'dragon:torii', file: derived('static-atlas'), label: 'Torii', category: 'Structure', source, width: 96, height: 64, sourceWidth: 2048, sourceHeight: 544, cropX: 1930, cropY: 8 },
  { id: 'dragon:fences', file: derived('static-atlas'), label: 'Clôtures', category: 'Structure', source, width: 212, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 8, cropY: 144 },
  { id: 'dragon:shrine-house', file: derived('static-atlas'), label: 'Maison sanctuaire', category: 'Structure', source, width: 128, height: 192, sourceWidth: 2048, sourceHeight: 544, cropX: 228, cropY: 144 },
  { id: 'dragon:barrels', file: derived('static-atlas'), label: 'Tonneaux et pots', category: 'Décor', source, width: 128, height: 128, sourceWidth: 2048, sourceHeight: 544, cropX: 364, cropY: 144 },
  { id: 'dragon:prop-barrel', file: derived('static-atlas'), label: 'Tonneau', category: 'Décor', source, width: 28, height: 30, sourceWidth: 2048, sourceHeight: 544, cropX: 500, cropY: 144 },
  { id: 'dragon:prop-pot', file: derived('static-atlas'), label: 'Pot', category: 'Décor', source, width: 28, height: 32, sourceWidth: 2048, sourceHeight: 544, cropX: 536, cropY: 144 },
  { id: 'dragon:prop-chest', file: derived('static-atlas'), label: 'Coffre', category: 'Décor', source, width: 60, height: 32, sourceWidth: 2048, sourceHeight: 544, cropX: 572, cropY: 144 },
  { id: 'dragon:prop-crate', file: derived('static-atlas'), label: 'Caisse', category: 'Décor', source, width: 58, height: 28, sourceWidth: 2048, sourceHeight: 544, cropX: 640, cropY: 144 },
  { id: 'dragon:prop-bench', file: derived('static-atlas'), label: 'Banc', category: 'Décor', source, width: 96, height: 32, sourceWidth: 2048, sourceHeight: 544, cropX: 706, cropY: 144 },
  { id: 'dragon:prop-cart', file: derived('static-atlas'), label: 'Chariot', category: 'Décor', source, width: 92, height: 54, sourceWidth: 2048, sourceHeight: 544, cropX: 810, cropY: 144 },
  { id: 'dragon:prop-cart-covered', file: derived('static-atlas'), label: 'Chariot couvert', category: 'Décor', source, width: 92, height: 60, sourceWidth: 2048, sourceHeight: 544, cropX: 910, cropY: 144 },
  { id: 'dragon:prop-haystack', file: derived('static-atlas'), label: 'Meule de foin', category: 'Décor', source, width: 126, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1010, cropY: 144 },
  { id: 'dragon:prop-bookshelf', file: derived('static-atlas'), label: 'Bibliothèque', category: 'Décor', source, width: 64, height: 58, sourceWidth: 2048, sourceHeight: 544, cropX: 1144, cropY: 144 },
  { id: 'dragon:prop-table', file: derived('static-atlas'), label: 'Table', category: 'Décor', source, width: 90, height: 26, sourceWidth: 2048, sourceHeight: 544, cropX: 1216, cropY: 144 },
  { id: 'dragon:desert-tower', file: derived('static-atlas'), label: 'Tour du désert', category: 'Structure', source, width: 92, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1314, cropY: 144 },
  { id: 'dragon:desert-house', file: derived('static-atlas'), label: 'Maison du désert', category: 'Structure', source, width: 128, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1414, cropY: 144 },
  { id: 'dragon:desert-house-wide', file: derived('static-atlas'), label: 'Maison longue du désert', category: 'Structure', source, width: 192, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 1550, cropY: 144 },
  { id: 'dragon:palm', file: derived('static-atlas'), label: 'Palmiers', category: 'Terrain', source, width: 96, height: 126, sourceWidth: 2048, sourceHeight: 544, cropX: 1750, cropY: 144 },
  { id: 'dragon:desert-fort', file: derived('static-atlas'), label: 'Fort du désert', category: 'Structure', source, width: 192, height: 160, sourceWidth: 2048, sourceHeight: 544, cropX: 8, cropY: 344 },
  { id: 'dragon:market', file: derived('static-atlas'), label: 'Étal de marché', category: 'Décor', source, width: 192, height: 96, sourceWidth: 2048, sourceHeight: 544, cropX: 208, cropY: 344 },
  { id: 'dragon:abandoned-ruins', file: derived('static-atlas'), label: 'Ruines envahies', category: 'Décor', source, width: 320, height: 192, sourceWidth: 2048, sourceHeight: 544, cropX: 408, cropY: 344 },
  { id: 'dragon:abandoned-house', file: derived('static-atlas'), label: 'Maison abandonnée', category: 'Structure', source, width: 288, height: 192, sourceWidth: 2048, sourceHeight: 544, cropX: 736, cropY: 344 },
  { id: 'dragon:abandoned-trees', file: derived('static-atlas'), label: 'Bosquet de ruines', category: 'Terrain', source, width: 256, height: 192, sourceWidth: 2048, sourceHeight: 544, cropX: 1032, cropY: 344 },
  { id: 'dragon:camp-tents', file: derived('static-atlas'), label: 'Campement', category: 'Structure', source, width: 288, height: 122, sourceWidth: 2048, sourceHeight: 544, cropX: 1296, cropY: 344 },
  { id: 'dragon:camp-props', file: derived('static-atlas'), label: 'Accessoires de camp', category: 'Décor', source, width: 288, height: 192, sourceWidth: 2048, sourceHeight: 544, cropX: 1592, cropY: 344 },
  { id: 'dragon:campfire', file: derived('static-atlas'), label: 'Feu de camp', category: 'Décor', source, width: 60, height: 64, sourceWidth: 2048, sourceHeight: 544, cropX: 1888, cropY: 344 },

  { id: 'dragon:villager-walk', file: derived('villager-walk'), label: 'Villageois animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:ninja-blue-walk', file: derived('ninja-blue-walk'), label: 'Ninja bleu animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:samurai-blue-walk', file: derived('samurai-blue-walk'), label: 'Samouraï animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:knight-walk', file: derived('knight-walk'), label: 'Chevalier animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:eskimo-walk', file: derived('eskimo-walk'), label: 'Aventurier des neiges', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:ninja-fire-walk', file: derived('ninja-fire-walk'), label: 'Ninja de feu animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:dog-walk', file: derived('dog-walk'), label: 'Chien animé', category: 'Personnages', source, width: 42, height: 42 },
  { id: 'dragon:chicken-walk', file: derived('chicken-walk'), label: 'Poule animée', category: 'Personnages', source, width: 38, height: 38 },
  { id: 'dragon:skeleton-walk', file: derived('skeleton-walk'), label: 'Squelette animé', category: 'Monstres', source, width: 48, height: 48 },
  { id: 'dragon:slime-idle', file: derived('slime-idle'), label: 'Slime animé', category: 'Monstres', source, width: 48, height: 48 },
  { id: 'dragon:lizard-idle', file: derived('lizard-idle'), label: 'Lézard animé', category: 'Monstres', source, width: 48, height: 48 },
  { id: 'dragon:bat-fly', file: derived('bat-fly'), label: 'Chauve-souris animée', category: 'Monstres', source, width: 48, height: 48 },

  { id: 'dragon:fx-water-ripple', file: derived('water-ripple'), label: 'Ondes d’eau animées', category: 'FX', source, width: 48, height: 48 },
  { id: 'dragon:fx-plant-sway', file: derived('plant-sway'), label: 'Plante animée', category: 'FX', source, width: 48, height: 48 },
  { id: 'dragon:fx-flag-red', file: derived('flag-red'), label: 'Drapeau rouge animé', category: 'FX', source, width: 48, height: 48 },
  { id: 'dragon:fx-waterfall', file: derived('waterfall'), label: 'Cascade animée', category: 'FX', source, width: 48, height: 48 },
  { id: 'dragon:fx-smoke', file: derived('smoke'), label: 'Fumée animée', category: 'FX', source, width: 72, height: 72 },
  { id: 'dragon:fx-snow', file: derived('snow-particle'), label: 'Neige animée', category: 'FX', source, width: 48, height: 48 },

  { id: 'ninja:dragon-green', file: ninja('Actor/Boss/DragonGreen/Preview.webp'), label: 'Dragon vert', category: 'Monstres', source, width: 318, height: 145 },
  { id: 'ninja:dragon-blue', file: ninja('Actor/Boss/DragonBlue/Preview.webp'), label: 'Dragon bleu', category: 'Monstres', source, width: 318, height: 145 },
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
