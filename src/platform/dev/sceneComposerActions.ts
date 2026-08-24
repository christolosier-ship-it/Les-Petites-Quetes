import { DEFAULT_SCENE_PLACEMENT } from './sceneComposerModel';
import type { SceneAssetDefinition } from './sceneComposerAssets';
import type { SceneAssetInstance, SceneComposerSnapshot, SceneDuplicate, ScenePlacement } from './sceneComposerModel';

let idCounter = 0;

function makeId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

export function placementFor(snapshot: SceneComposerSnapshot, id: string): ScenePlacement {
  const duplicate = snapshot.duplicates.find((item) => item.id === id);
  if (duplicate) return duplicate;
  const asset = snapshot.assets.find((item) => item.id === id);
  return asset ?? snapshot.items[id] ?? DEFAULT_SCENE_PLACEMENT;
}

export function patchPlacement(snapshot: SceneComposerSnapshot, id: string, patch: Partial<ScenePlacement>) {
  const duplicateIndex = snapshot.duplicates.findIndex((item) => item.id === id);
  if (duplicateIndex >= 0) {
    const duplicates = [...snapshot.duplicates];
    const current = duplicates[duplicateIndex];
    if (!current) return snapshot;
    duplicates[duplicateIndex] = { ...current, ...patch };
    return { ...snapshot, duplicates };
  }
  const assetIndex = snapshot.assets.findIndex((item) => item.id === id);
  if (assetIndex >= 0) {
    const assets = [...snapshot.assets];
    const current = assets[assetIndex];
    if (!current) return snapshot;
    assets[assetIndex] = { ...current, ...patch };
    return { ...snapshot, assets };
  }
  return {
    ...snapshot,
    items: { ...snapshot.items, [id]: { ...placementFor(snapshot, id), ...patch } },
  };
}

export function deleteSceneItems(snapshot: SceneComposerSnapshot, ids: ReadonlySet<string>, originalIds: ReadonlySet<string>) {
  const removed = new Set(snapshot.removed);
  const duplicates = snapshot.duplicates.filter((item) => !ids.has(item.id));
  const assets = snapshot.assets.filter((item) => !ids.has(item.id));
  for (const id of ids) if (originalIds.has(id)) removed.add(id);
  return { ...snapshot, duplicates, assets, removed: [...removed] };
}

export function resetSceneItems(snapshot: SceneComposerSnapshot, ids: ReadonlySet<string>, originalIds: ReadonlySet<string>) {
  const items = { ...snapshot.items };
  const removed = new Set(snapshot.removed);
  let duplicates = snapshot.duplicates;
  let assets = snapshot.assets;
  for (const id of ids) {
    if (originalIds.has(id)) {
      delete items[id];
      removed.delete(id);
    } else {
      duplicates = duplicates.filter((item) => item.id !== id);
      assets = assets.filter((item) => item.id !== id);
    }
  }
  return { ...snapshot, items, duplicates, assets, removed: [...removed] };
}

export function duplicateSceneItems(snapshot: SceneComposerSnapshot, ids: ReadonlySet<string>) {
  const duplicates: SceneDuplicate[] = [...snapshot.duplicates];
  const assets: SceneAssetInstance[] = [...snapshot.assets];
  const created: string[] = [];
  for (const id of ids) {
    const sourceDuplicate = snapshot.duplicates.find((item) => item.id === id);
    const sourceAsset = snapshot.assets.find((item) => item.id === id);
    if (sourceAsset) {
      const copy = { ...sourceAsset, id: makeId('asset'), x: sourceAsset.x + 24, y: sourceAsset.y - 16 };
      assets.push(copy);
      created.push(copy.id);
      continue;
    }
    const sourceId = sourceDuplicate?.sourceId ?? id;
    const current = placementFor(snapshot, id);
    const copy: SceneDuplicate = {
      ...current,
      x: current.x + 24,
      y: current.y - 16,
      id: makeId('copy'),
      sourceId,
    };
    duplicates.push(copy);
    created.push(copy.id);
  }
  return { snapshot: { ...snapshot, duplicates, assets }, created };
}

export function addAsset(
  snapshot: SceneComposerSnapshot,
  asset: SceneAssetDefinition,
  x: number,
  y: number,
  zIndex: number,
) {
  const crop = asset.sourceWidth !== undefined && asset.cropX !== undefined
    ? { sourceWidth: asset.sourceWidth, cropX: asset.cropX }
    : {};
  const instance: SceneAssetInstance = {
    id: makeId('asset'),
    file: asset.file,
    label: asset.label,
    width: asset.width,
    height: asset.height,
    x: Math.round(x - asset.width / 2),
    y: Math.round(y - asset.height / 2),
    rotation: 0,
    scale: 1,
    zIndex,
    mirrored: false,
    locked: false,
    ...crop,
  };
  return { snapshot: { ...snapshot, assets: [...snapshot.assets, instance] }, id: instance.id };
}

export function toggleMirror(snapshot: SceneComposerSnapshot, ids: ReadonlySet<string>) {
  let next = snapshot;
  for (const id of ids) {
    const placement = placementFor(next, id);
    if (!placement.locked) next = patchPlacement(next, id, { mirrored: !placement.mirrored });
  }
  return next;
}

export function toggleLock(snapshot: SceneComposerSnapshot, ids: ReadonlySet<string>) {
  const shouldLock = [...ids].some((id) => !placementFor(snapshot, id).locked);
  let next = snapshot;
  for (const id of ids) next = patchPlacement(next, id, { locked: shouldLock });
  return next;
}
