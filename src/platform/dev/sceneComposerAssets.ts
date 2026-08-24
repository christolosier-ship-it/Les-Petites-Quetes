const ROOT = '/worlds/gnome-village';

interface ManifestEntry {
  readonly file: string;
  readonly source: string;
  readonly width: number;
  readonly height: number;
}

interface Manifest {
  readonly items: ManifestEntry[];
}

export interface SceneAssetDefinition {
  readonly id: string;
  readonly file: string;
  readonly label: string;
  readonly category: string;
  readonly source: string;
  readonly width: number;
  readonly height: number;
}

const MANIFESTS = [
  { url: `${ROOT}/structure/manifest.json`, prefix: 'structure/' },
  { url: `${ROOT}/manifest-habbo-only-school.json`, prefix: '' },
  { url: `${ROOT}/manifest-lots-2-4.json`, prefix: '' },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  actors: 'Personnages',
  cafeteria: 'Cantine',
  classroom: 'Classe',
  courtyard: 'Cour',
  structure: 'Structure',
};

function normalizeFile(file: string, prefix: string) {
  return file.includes('/') ? file : `${prefix}${file}`;
}

function humanize(file: string) {
  const base = file.split('/').at(-1)?.replace(/\.png$/i, '') ?? file;
  return base.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function categoryFor(file: string) {
  const key = file.split('/')[0] ?? 'structure';
  return CATEGORY_LABELS[key] ?? key;
}

async function fetchManifest(url: string): Promise<Manifest> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Manifest indisponible (${response.status})`);
  return await response.json() as Manifest;
}

export function assetSrc(file: string) {
  return `${ROOT}/${file}`;
}

export async function loadSceneAssetCatalog(): Promise<SceneAssetDefinition[]> {
  const manifests = await Promise.all(
    MANIFESTS.map(async ({ url, prefix }) => ({ manifest: await fetchManifest(url), prefix })),
  );
  const unique = new Map<string, SceneAssetDefinition>();

  for (const { manifest, prefix } of manifests) {
    for (const item of manifest.items) {
      const file = normalizeFile(item.file, prefix);
      if (unique.has(file)) continue;
      unique.set(file, {
        id: file,
        file,
        label: humanize(file),
        category: categoryFor(file),
        source: item.source,
        width: item.width,
        height: item.height,
      });
    }
  }

  return [...unique.values()].sort((a, b) =>
    a.category.localeCompare(b.category, 'fr') || a.label.localeCompare(b.label, 'fr'),
  );
}
