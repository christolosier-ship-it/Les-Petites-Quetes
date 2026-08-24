export type SceneAssetCategory = 'Structure' | 'Classe' | 'Cantine' | 'Cour' | 'Personnages';

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

type ManifestItem = Readonly<{
  file: string;
  source: string;
  width: number;
  height: number;
}>;

type Manifest = Readonly<{ items?: ManifestItem[] }>;

type ManifestSource = Readonly<{ url: string; prefix: string }>;

const MANIFESTS: ManifestSource[] = [
  { url: '/worlds/gnome-village/structure/manifest.json', prefix: 'structure/' },
  { url: '/worlds/gnome-village/manifest-habbo-only-school.json', prefix: '' },
  { url: '/worlds/gnome-village/manifest-lots-2-4.json', prefix: '' },
];

const STRAIGHT_WALLS: SceneAssetDefinition[] = [
  {
    id: 'derived:wall-school-straight',
    file: 'structure/wall-school.png',
    label: 'Mur droit école',
    category: 'Structure',
    source: 'school_wall · section centrale droite',
    width: 84,
    height: 186,
    sourceWidth: 111,
    cropX: 14,
  },
  {
    id: 'derived:wall-academic-straight',
    file: 'structure/wall-academic.png',
    label: 'Mur droit académique',
    category: 'Structure',
    source: 'school_c22_wall · section centrale droite',
    width: 84,
    height: 187,
    sourceWidth: 111,
    cropX: 14,
  },
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

async function loadManifest(source: ManifestSource) {
  const response = await fetch(source.url);
  if (!response.ok) throw new Error(`Manifest indisponible: ${source.url}`);
  const manifest = await response.json() as Manifest;
  return (manifest.items ?? []).flatMap((item): SceneAssetDefinition[] => {
    if (!item.file || !item.source || !Number.isFinite(item.width) || !Number.isFinite(item.height)) return [];
    const file = `${source.prefix}${item.file}`;
    return [{
      id: `${source.url}:${file}`,
      file,
      label: humanize(file),
      category: categoryFor(file),
      source: item.source,
      width: item.width,
      height: item.height,
    }];
  });
}

export async function loadSceneAssetCatalog() {
  const groups = await Promise.all(MANIFESTS.map(loadManifest));
  const unique = new Map<string, SceneAssetDefinition>();
  for (const asset of [...groups.flat(), ...STRAIGHT_WALLS]) {
    const key = `${asset.id}:${asset.file}`;
    if (!unique.has(key)) unique.set(key, asset);
  }
  return [...unique.values()].sort((a, b) =>
    a.category.localeCompare(b.category, 'fr') || a.label.localeCompare(b.label, 'fr'),
  );
}

export function assetSrc(file: string) {
  return `/worlds/gnome-village/${file}`;
}
