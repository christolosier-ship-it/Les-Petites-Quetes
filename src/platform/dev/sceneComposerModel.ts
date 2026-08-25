export interface ScenePlacement {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scale: number;
  readonly zIndex: number | null;
  readonly mirrored: boolean;
  readonly locked: boolean;
}

export interface SceneDuplicate extends ScenePlacement {
  readonly id: string;
  readonly sourceId: string;
}

export interface SceneAssetInstance extends ScenePlacement {
  readonly id: string;
  readonly file: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly sourceWidth?: number;
  readonly sourceHeight?: number | undefined;
  readonly cropX?: number;
  readonly cropY?: number;
}

export interface SceneComposerSnapshot {
  readonly version: 3;
  readonly sceneId: string;
  readonly updatedAt: string;
  readonly items: Record<string, ScenePlacement>;
  readonly duplicates: SceneDuplicate[];
  readonly assets: SceneAssetInstance[];
  readonly removed: string[];
}

export const DEFAULT_SCENE_PLACEMENT: ScenePlacement = {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  zIndex: null,
  mirrored: false,
  locked: false,
};

const STORAGE_PREFIX = 'les-petites-quetes.scene-composer';

function storageKey(sceneId: string, version: 1 | 2 | 3) {
  return `${STORAGE_PREFIX}.${sceneId}.v${version}`;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parsePlacement(value: unknown): ScenePlacement | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<ScenePlacement>;
  if (!isFiniteNumber(candidate.x) || !isFiniteNumber(candidate.y)) return null;
  if (!isFiniteNumber(candidate.rotation) || !isFiniteNumber(candidate.scale)) return null;
  if (candidate.zIndex !== null && candidate.zIndex !== undefined && !isFiniteNumber(candidate.zIndex)) return null;

  return {
    x: candidate.x,
    y: candidate.y,
    rotation: candidate.rotation,
    scale: Math.max(0.1, candidate.scale),
    zIndex: candidate.zIndex ?? null,
    mirrored: candidate.mirrored === true,
    locked: candidate.locked === true,
  };
}

export function emptySceneSnapshot(sceneId: string): SceneComposerSnapshot {
  return {
    version: 3,
    sceneId,
    updatedAt: new Date().toISOString(),
    items: {},
    duplicates: [],
    assets: [],
    removed: [],
  };
}

function parseSnapshot(raw: string, sceneId: string, normalizeLegacyAssetScale = false): SceneComposerSnapshot | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const candidate = parsed as Partial<SceneComposerSnapshot> & { removed?: unknown; assets?: unknown };
    const items: Record<string, ScenePlacement> = {};
    if (candidate.items && typeof candidate.items === 'object') {
      for (const [id, placement] of Object.entries(candidate.items)) {
        const valid = parsePlacement(placement);
        if (valid) items[id] = valid;
      }
    }

    const duplicates = Array.isArray(candidate.duplicates)
      ? candidate.duplicates.flatMap((duplicate) => {
          if (!duplicate || typeof duplicate !== 'object') return [];
          const source = duplicate as Partial<SceneDuplicate>;
          const placement = parsePlacement(duplicate);
          if (!placement || typeof source.id !== 'string' || typeof source.sourceId !== 'string') return [];
          return [{ ...placement, id: source.id, sourceId: source.sourceId }];
        })
      : [];

    const assets = Array.isArray(candidate.assets)
      ? candidate.assets.flatMap((asset) => {
          if (!asset || typeof asset !== 'object') return [];
          const source = asset as Partial<SceneAssetInstance>;
          const placement = parsePlacement(asset);
          if (!placement || typeof source.id !== 'string' || typeof source.file !== 'string') return [];
          if (typeof source.label !== 'string' || !isFiniteNumber(source.width) || !isFiniteNumber(source.height)) return [];
          const scale = normalizeLegacyAssetScale && Math.abs(placement.scale - 1.2) < 0.0001 ? 1 : placement.scale;
          const crop = isFiniteNumber(source.sourceWidth) && isFiniteNumber(source.cropX)
            ? {
                sourceWidth: source.sourceWidth,
                sourceHeight: isFiniteNumber(source.sourceHeight) ? source.sourceHeight : undefined,
                cropX: source.cropX,
                cropY: isFiniteNumber(source.cropY) ? source.cropY : 0,
              }
            : {};
          return [{ ...placement, scale, id: source.id, file: source.file, label: source.label, width: source.width, height: source.height, ...crop }];
        })
      : [];

    const removed = Array.isArray(candidate.removed)
      ? candidate.removed.filter((id): id is string => typeof id === 'string')
      : [];

    return {
      version: 3,
      sceneId,
      updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString(),
      items,
      duplicates,
      assets,
      removed,
    };
  } catch {
    return null;
  }
}

export function loadSceneSnapshot(sceneId: string): SceneComposerSnapshot {
  const current = window.localStorage.getItem(storageKey(sceneId, 3));
  if (current) return parseSnapshot(current, sceneId) ?? emptySceneSnapshot(sceneId);
  const previous = window.localStorage.getItem(storageKey(sceneId, 2));
  if (previous) return parseSnapshot(previous, sceneId, true) ?? emptySceneSnapshot(sceneId);
  const legacy = window.localStorage.getItem(storageKey(sceneId, 1));
  return legacy ? parseSnapshot(legacy, sceneId) ?? emptySceneSnapshot(sceneId) : emptySceneSnapshot(sceneId);
}

export function cloneSceneSnapshot(snapshot: SceneComposerSnapshot): SceneComposerSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as SceneComposerSnapshot;
}

export function saveSceneSnapshot(snapshot: SceneComposerSnapshot) {
  const dated = { ...snapshot, version: 3 as const, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(storageKey(snapshot.sceneId, 3), JSON.stringify(dated));
  return dated;
}

export function clearSceneSnapshot(sceneId: string) {
  window.localStorage.removeItem(storageKey(sceneId, 3));
  window.localStorage.removeItem(storageKey(sceneId, 2));
  window.localStorage.removeItem(storageKey(sceneId, 1));
}

export function isSceneComposerEnabled() {
  return true;
}
