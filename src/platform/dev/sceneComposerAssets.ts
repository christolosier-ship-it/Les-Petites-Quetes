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
const derived = (name: string) => `${NINJA_ROOT}/Derived/${name}.webp`;
const ninja = (path: string) => `${NINJA_ROOT}/${path}`;
const source = 'Pixel-Boy / Ninja Adventure CC0';

const DRAGON_ASSETS: SceneAssetDefinition[] = [
  { id: 'dragon:tree-round-green', file: derived('tree-round-green'), label: 'Arbre rond vert', category: 'Terrain', source, width: 72, height: 72 },
  { id: 'dragon:tree-pine-green', file: derived('tree-pine-green'), label: 'Pin vert', category: 'Terrain', source, width: 64, height: 96 },
  { id: 'dragon:tree-dead', file: derived('tree-dead'), label: 'Arbre mort', category: 'Terrain', source, width: 64, height: 96 },
  { id: 'dragon:tree-rooted-green', file: derived('tree-rooted-green'), label: 'Arbre racines', category: 'Terrain', source, width: 72, height: 96 },
  { id: 'dragon:tree-snow', file: derived('tree-snow'), label: 'Arbre enneigé', category: 'Terrain', source, width: 64, height: 96 },
  { id: 'dragon:tree-pink', file: derived('tree-pink'), label: 'Arbre rose', category: 'Terrain', source, width: 64, height: 96 },
  { id: 'dragon:tree-big-green', file: derived('tree-big-green'), label: 'Grand arbre vert', category: 'Terrain', source, width: 96, height: 96 },
  { id: 'dragon:tree-big-white', file: derived('tree-big-white'), label: 'Grand arbre blanc', category: 'Terrain', source, width: 96, height: 96 },
  { id: 'dragon:tree-big-autumn', file: derived('tree-big-autumn'), label: 'Grand arbre automne', category: 'Terrain', source, width: 96, height: 96 },
  { id: 'dragon:rocks-orange', file: derived('rocks-orange'), label: 'Rochers ocre', category: 'Terrain', source, width: 128, height: 76 },
  { id: 'dragon:rocks-gray', file: derived('rocks-gray'), label: 'Rochers gris', category: 'Terrain', source, width: 128, height: 76 },
  { id: 'dragon:flowers', file: derived('flowers'), label: 'Fleurs et herbes', category: 'Décor', source, width: 144, height: 48 },
  { id: 'dragon:grass-props', file: derived('grass-props'), label: 'Végétation basse', category: 'Décor', source, width: 144, height: 72 },
  { id: 'dragon:logs', file: derived('logs'), label: 'Troncs et souches', category: 'Décor', source, width: 64, height: 128 },

  { id: 'dragon:house-orange', file: derived('house-orange'), label: 'Maison orange', category: 'Structure', source, width: 128, height: 96 },
  { id: 'dragon:house-orange-2', file: derived('house-orange-2'), label: 'Maison orange II', category: 'Structure', source, width: 128, height: 96 },
  { id: 'dragon:dojo', file: derived('dojo'), label: 'Dojo', category: 'Structure', source, width: 96, height: 96 },
  { id: 'dragon:torii', file: derived('torii'), label: 'Torii', category: 'Structure', source, width: 96, height: 64 },
  { id: 'dragon:fences', file: derived('fences'), label: 'Clôtures', category: 'Structure', source, width: 192, height: 72 },
  { id: 'dragon:shrine-house', file: derived('shrine-house'), label: 'Maison sanctuaire', category: 'Structure', source, width: 128, height: 192 },
  { id: 'dragon:barrels', file: derived('barrels'), label: 'Tonneaux et pots', category: 'Décor', source, width: 96, height: 96 },
  { id: 'dragon:prop-barrel', file: derived('prop-barrel'), label: 'Tonneau', category: 'Décor', source, width: 48, height: 48 },
  { id: 'dragon:prop-pot', file: derived('prop-pot'), label: 'Pot', category: 'Décor', source, width: 48, height: 48 },
  { id: 'dragon:prop-chest', file: derived('prop-chest'), label: 'Coffre', category: 'Décor', source, width: 72, height: 40 },
  { id: 'dragon:prop-crate', file: derived('prop-crate'), label: 'Caisse', category: 'Décor', source, width: 72, height: 40 },
  { id: 'dragon:prop-bench', file: derived('prop-bench'), label: 'Banc', category: 'Décor', source, width: 128, height: 36 },
  { id: 'dragon:prop-cart', file: derived('prop-cart'), label: 'Chariot', category: 'Décor', source, width: 108, height: 72 },
  { id: 'dragon:prop-cart-covered', file: derived('prop-cart-covered'), label: 'Chariot couvert', category: 'Décor', source, width: 108, height: 72 },
  { id: 'dragon:prop-haystack', file: derived('prop-haystack'), label: 'Meule de foin', category: 'Décor', source, width: 112, height: 112 },
  { id: 'dragon:prop-bookshelf', file: derived('prop-bookshelf'), label: 'Bibliothèque', category: 'Décor', source, width: 72, height: 72 },
  { id: 'dragon:prop-table', file: derived('prop-table'), label: 'Table', category: 'Décor', source, width: 108, height: 36 },

  { id: 'dragon:desert-tower', file: derived('desert-tower'), label: 'Tour du désert', category: 'Structure', source, width: 96, height: 96 },
  { id: 'dragon:desert-house', file: derived('desert-house'), label: 'Maison du désert', category: 'Structure', source, width: 128, height: 96 },
  { id: 'dragon:desert-house-wide', file: derived('desert-house-wide'), label: 'Maison longue du désert', category: 'Structure', source, width: 176, height: 88 },
  { id: 'dragon:palm', file: derived('palm'), label: 'Palmiers', category: 'Terrain', source, width: 88, height: 118 },
  { id: 'dragon:desert-fort', file: derived('desert-fort'), label: 'Fort du désert', category: 'Structure', source, width: 176, height: 146 },
  { id: 'dragon:market', file: derived('market'), label: 'Étal de marché', category: 'Décor', source, width: 176, height: 88 },

  { id: 'dragon:abandoned-ruins', file: derived('abandoned-ruins'), label: 'Ruines envahies', category: 'Décor', source, width: 200, height: 120 },
  { id: 'dragon:abandoned-house', file: derived('abandoned-house'), label: 'Maison abandonnée', category: 'Structure', source, width: 180, height: 120 },
  { id: 'dragon:abandoned-trees', file: derived('abandoned-trees'), label: 'Bosquet de ruines', category: 'Terrain', source, width: 176, height: 132 },
  { id: 'dragon:camp-tents', file: derived('camp-tents'), label: 'Campement', category: 'Structure', source, width: 180, height: 80 },
  { id: 'dragon:camp-props', file: derived('camp-props'), label: 'Accessoires de camp', category: 'Décor', source, width: 180, height: 120 },
  { id: 'dragon:campfire', file: derived('campfire'), label: 'Feu de camp', category: 'Décor', source, width: 64, height: 64 },

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
