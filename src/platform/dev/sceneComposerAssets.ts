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
  { id: 'dragon:tree-round-green', file: derived('static-atlas'), label: 'Arbre rond vert', category: 'Terrain', source, width: 64, height: 58, sourceWidth: 768, sourceHeight: 426, cropX: 8, cropY: 8 },
  { id: 'dragon:tree-pine-green', file: derived('static-atlas'), label: 'Pin vert', category: 'Terrain', source, width: 64, height: 94, sourceWidth: 768, sourceHeight: 426, cropX: 84, cropY: 8 },
  { id: 'dragon:tree-snow', file: derived('static-atlas'), label: 'Arbre enneigé', category: 'Terrain', source, width: 64, height: 96, sourceWidth: 768, sourceHeight: 426, cropX: 160, cropY: 8 },
  { id: 'dragon:rocks-orange', file: derived('static-atlas'), label: 'Rochers ocre', category: 'Terrain', source, width: 160, height: 92, sourceWidth: 768, sourceHeight: 426, cropX: 236, cropY: 8 },
  { id: 'dragon:rocks-gray', file: derived('static-atlas'), label: 'Rochers gris', category: 'Terrain', source, width: 160, height: 92, sourceWidth: 768, sourceHeight: 426, cropX: 408, cropY: 8 },
  { id: 'dragon:house-orange', file: derived('static-atlas'), label: 'Maison orange', category: 'Structure', source, width: 128, height: 96, sourceWidth: 768, sourceHeight: 426, cropX: 580, cropY: 8 },
  { id: 'dragon:dojo', file: derived('static-atlas'), label: 'Dojo', category: 'Structure', source, width: 96, height: 96, sourceWidth: 768, sourceHeight: 426, cropX: 8, cropY: 116 },
  { id: 'dragon:torii', file: derived('static-atlas'), label: 'Torii', category: 'Structure', source, width: 96, height: 64, sourceWidth: 768, sourceHeight: 426, cropX: 116, cropY: 116 },
  { id: 'dragon:prop-barrel', file: derived('static-atlas'), label: 'Tonneau', category: 'Décor', source, width: 28, height: 30, sourceWidth: 768, sourceHeight: 426, cropX: 224, cropY: 116 },
  { id: 'dragon:prop-chest', file: derived('static-atlas'), label: 'Coffre', category: 'Décor', source, width: 60, height: 32, sourceWidth: 768, sourceHeight: 426, cropX: 264, cropY: 116 },
  { id: 'dragon:prop-cart', file: derived('static-atlas'), label: 'Chariot', category: 'Décor', source, width: 92, height: 54, sourceWidth: 768, sourceHeight: 426, cropX: 336, cropY: 116 },
  { id: 'dragon:desert-house', file: derived('static-atlas'), label: 'Maison du désert', category: 'Structure', source, width: 128, height: 96, sourceWidth: 768, sourceHeight: 426, cropX: 440, cropY: 116 },
  { id: 'dragon:palm', file: derived('static-atlas'), label: 'Palmier', category: 'Terrain', source, width: 96, height: 126, sourceWidth: 768, sourceHeight: 426, cropX: 580, cropY: 116 },
  { id: 'dragon:abandoned-ruins', file: derived('static-atlas'), label: 'Ruines envahies', category: 'Décor', source, width: 240, height: 144, sourceWidth: 768, sourceHeight: 426, cropX: 8, cropY: 254 },
  { id: 'dragon:camp-tents', file: derived('static-atlas'), label: 'Campement', category: 'Structure', source, width: 216, height: 92, sourceWidth: 768, sourceHeight: 426, cropX: 260, cropY: 254 },
  { id: 'dragon:campfire', file: derived('static-atlas'), label: 'Feu de camp', category: 'Décor', source, width: 60, height: 64, sourceWidth: 768, sourceHeight: 426, cropX: 488, cropY: 254 },

  { id: 'dragon:villager-walk', file: derived('villager-walk'), label: 'Villageois animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:dog-walk', file: derived('dog-walk'), label: 'Chien animé', category: 'Personnages', source, width: 42, height: 42 },
  { id: 'dragon:chicken-walk', file: derived('chicken-walk'), label: 'Poule animée', category: 'Personnages', source, width: 36, height: 36 },
  { id: 'dragon:ninja-blue-walk', file: derived('ninja-blue-walk'), label: 'Ninja bleu animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:samurai-blue-walk', file: derived('samurai-blue-walk'), label: 'Samouraï animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:knight-walk', file: derived('knight-walk'), label: 'Chevalier animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:eskimo-walk', file: derived('eskimo-walk'), label: 'Aventurier des neiges', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:ninja-fire-walk', file: derived('ninja-fire-walk'), label: 'Ninja de feu animé', category: 'Personnages', source, width: 48, height: 48 },
  { id: 'dragon:skeleton-walk', file: derived('skeleton-walk'), label: 'Squelette animé', category: 'Monstres', source, width: 48, height: 48 },
  { id: 'dragon:slime-idle', file: derived('slime-idle'), label: 'Slime animé', category: 'Monstres', source, width: 46, height: 46 },
  { id: 'dragon:lizard-idle', file: derived('lizard-idle'), label: 'Lézard animé', category: 'Monstres', source, width: 46, height: 46 },
  { id: 'dragon:bat-fly', file: derived('bat-fly'), label: 'Chauve-souris animée', category: 'Monstres', source, width: 44, height: 44 },
  { id: 'dragon:flag-red', file: derived('flag-red'), label: 'Drapeau rouge animé', category: 'FX', source, width: 40, height: 40 },
  { id: 'dragon:plant-sway', file: derived('plant-sway'), label: 'Plante animée', category: 'FX', source, width: 40, height: 40 },
  { id: 'dragon:water-ripple', file: derived('water-ripple'), label: 'Ondes d’eau animées', category: 'FX', source, width: 44, height: 44 },
  { id: 'dragon:snow-particle', file: derived('snow-particle'), label: 'Neige animée', category: 'FX', source, width: 36, height: 36 },
  { id: 'dragon:smoke', file: derived('smoke'), label: 'Fumée animée', category: 'FX', source, width: 74, height: 74 },

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
