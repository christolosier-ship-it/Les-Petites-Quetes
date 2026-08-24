export interface ScenePlacement {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scale: number;
  readonly zIndex: number | null;
}

export interface SceneDuplicate extends ScenePlacement {
  readonly id: string;
  readonly sourceId: string;
}

export interface SceneComposerSnapshot {
  readonly version: 1;
  readonly sceneId: string;
  readonly updatedAt: string;
  readonly items: Record<string, ScenePlacement>;
  readonly duplicates: SceneDuplicate[];
}

export const DEFAULT_SCENE_PLACEMENT: ScenePlacement = {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  zIndex: null,
};

const STORAGE_PREFIX = 'les-petites-quetes.scene-composer';

function storageKey(sceneId: string) {
  return `${STORAGE_PREFIX}.${sceneId}.v1`;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parsePlacement(value: unknown): ScenePlacement | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<ScenePlacement>;
  if (!isFiniteNumber(candidate.x) || !isFiniteNumber(candidate.y)) return null;
  if (!isFiniteNumber(candidate.rotation) || !isFiniteNumber(candidate.scale)) return null;
  if (candidate.zIndex !== null && !isFiniteNumber(candidate.zIndex)) return null;

  return {
    x: candidate.x,
    y: candidate.y,
    rotation: candidate.rotation,
    scale: Math.max(0.1, candidate.scale),
    zIndex: candidate.zIndex ?? null,
  };
}

export function emptySceneSnapshot(sceneId: string): SceneComposerSnapshot {
  return {
    version: 1,
    sceneId,
    updatedAt: new Date().toISOString(),
    items: {},
    duplicates: [],
  };
}

export function loadSceneSnapshot(sceneId: string): SceneComposerSnapshot {
  try {
    const raw = window.localStorage.getItem(storageKey(sceneId));
    if (!raw) return emptySceneSnapshot(sceneId);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptySceneSnapshot(sceneId);

    const candidate = parsed as Partial<SceneComposerSnapshot>;
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

    return {
      version: 1,
      sceneId,
      updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString(),
      items,
      duplicates,
    };
  } catch {
    return emptySceneSnapshot(sceneId);
  }
}

export function saveSceneSnapshot(snapshot: SceneComposerSnapshot) {
  const dated = { ...snapshot, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(storageKey(snapshot.sceneId), JSON.stringify(dated));
  return dated;
}

export function clearSceneSnapshot(sceneId: string) {
  window.localStorage.removeItem(storageKey(sceneId));
}

export function isSceneComposerEnabled() {
  if (import.meta.env.DEV) return true;
  return new URLSearchParams(window.location.search).get('sceneComposer') === '1';
}
