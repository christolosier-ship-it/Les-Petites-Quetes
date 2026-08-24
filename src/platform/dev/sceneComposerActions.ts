import { DEFAULT_SCENE_PLACEMENT } from './sceneComposerModel';
import type { SceneAssetDefinition } from './sceneComposerAssets';
import type { SceneAssetInstance, SceneComposerSnapshot, SceneDuplicate, ScenePlacement } from './sceneComposerModel';

let idCounter = 0;

function makeId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

export function placementFor(snapshot: SceneComposerSnapshot, id: string): ScenePlacement {
  return snapshot.duplicates.find((item) => item.id === id)
    ?? snapshot.assets.find((item) => item.id === id)
    ?? snapshot.items[id]
    ?? DEFAULT_SCENE_PLACEMENT;
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

export function patchPlacements(snapshot: SceneComposerSnapshot, ids: Iterable<string>, patch: Partial<ScenePlacement>) {
  let next = snapshot;
  for (const id of ids) next = patchPlacement(next, id, patch);
  return next;
}

export function deleteSceneItems(snapshot: SceneComposerSnapshot, ids: Iterable<string>, originals: Set<string>) {
  const targets = new Set([...ids].filter((id) => !placementFor(snapshot, id).locked));
  if (targets.size === 0) return snapshot;
  const removed = new Set(snapshot.removed);
  for (const id of targets) if (originals.has(id)) removed.add(id);
  return {
    ...snapshot,
    removed: [...removed],
    duplicates: snapshot.duplicates.filter((item) => !targets.has(item.id)),
    assets: snapshot.assets.filter((item) => !targets.has(item.id)),
  };
}

export function resetSceneItems(snapshot: SceneComposerSnapshot, ids: Iterable<string>, originals: Set<string>) {
  const targets = new Set([...ids].filter((id) => !placementFor(snapshot, id).locked));
  if (targets.size === 0) return snapshot;
  const items = { ...snapshot.items };
  const removed = new Set(snapshot.removed);
  for (const id of targets) {
    if (originals.has(id)) {
      delete items[id];
      removed.delete(id);
    }
  }
  return {
    ...snapshot,
    items,
    removed: [...removed],
    duplicates: snapshot.duplicates.filter((item) => !targets.has(item.id)),
    assets: snapshot.assets.filter((item) => !targets.has(item.id)),
  };
}

export function duplicateSceneItems(snapshot: SceneComposerSnapshot, ids: Iterable<string>) {
  const duplicates = [...snapshot.duplicates];
  const assets = [...snapshot.assets];
  const created: string[] = [];

  for (const id of ids) {
    const placement = placementFor(snapshot, id);
    if (placement.locked) continue;
    const sourceDuplicate = snapshot.duplicates.find((item) => item.id === id);
    const sourceAsset = snapshot.assets.find((item) => item.id === id);
    if (sourceAsset) {
      const copy: SceneAssetInstance = {
        ...sourceAsset,
        x: sourceAsset.x + 24,
        y: sourceAsset.y - 16,
        id: makeId('asset-copy'),
        locked: false,
      };
      assets.push(copy);
      created.push(copy.id);
      continue;
    }
    const sourceId = sourceDuplicate?.sourceId ?? id;
    const copy: SceneDuplicate = {
      ...placement,
      x: placement.x + 24,
      y: placement.y - 16,
      id: makeId(`${sourceId}--copy`),
      sourceId,
      locked: false,
    };
    duplicates.push(copy);
    created.push(copy.id);
  }

  return { snapshot: { ...snapshot, duplicates, assets }, created };
}

export function toggleMirror(snapshot: SceneComposerSnapshot, ids: Iterable<string>) {
  let next = snapshot;
  for (const id of ids) {
    const current = placementFor(next, id);
    if (!current.locked) next = patchPlacement(next, id, { mirrored: !current.mirrored });
  }
  return next;
}

export function toggleLock(snapshot: SceneComposerSnapshot, ids: Iterable<string>) {
  const targets = [...ids];
  if (targets.length === 0) return snapshot;
  const shouldLock = targets.some((id) => !placementFor(snapshot, id).locked);
  return patchPlacements(snapshot, targets, { locked: shouldLock });
}

export function addAsset(
  snapshot: SceneComposerSnapshot,
  asset: SceneAssetDefinition,
  x: number,
  y: number,
  zIndex: number,
) {
  const instance: SceneAssetInstance = {
    id: makeId('asset'),
    file: asset.file,
    label: asset.label,
    width: asset.width,
    height: asset.height,
    x: Math.round(x - asset.width / 2),
    y: Math.round(y - asset.height / 2),
    rotation: 0,
    scale: 1.2,
    zIndex,
    mirrored: false,
    locked: false,
  };
  return { snapshot: { ...snapshot, assets: [...snapshot.assets, instance] }, id: instance.id };
}
