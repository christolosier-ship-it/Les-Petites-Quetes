import { assetSrc } from './sceneComposerAssets';
import { DEFAULT_SCENE_PLACEMENT } from './sceneComposerModel';
import type { SceneAssetInstance, SceneComposerSnapshot, SceneDuplicate, ScenePlacement } from './sceneComposerModel';

const ITEM_SELECTOR = [
  '.gnome-zone > .gnome-floor', '.gnome-zone > .gnome-wall-run', '.gnome-zone > .gnome-prop', '.gnome-zone > .gnome-actor',
  '.gnome-zone > .gnome-desk-cluster', '.gnome-zone > .gnome-teacher-station', '.gnome-zone > .gnome-canteen-table', '.gnome-zone > .gnome-floating-asset',
  '[data-dragon-scene-item]', '.dragon-mountain__actor',
].join(',');

const ID_PREFIXES = ['gnome-floor--', 'gnome-wall-run--', 'gnome-prop--', 'gnome-actor--', 'gnome-desk-cluster--', 'gnome-canteen-table--', 'gnome-floating-asset--'];

function itemId(element: HTMLElement, index: number) {
  const explicit = element.dataset.dragonSceneItem;
  if (explicit) return `dragon-${explicit}`;
  const semantic = [...element.classList].find((className) => ID_PREFIXES.some((prefix) => className.startsWith(prefix)));
  if (semantic) return semantic;
  if (element.classList.contains('gnome-teacher-station')) return 'gnome-teacher-station';
  if (element.classList.contains('dragon-mountain__actor')) return `dragon-actor-${index + 1}`;
  return `scene-item-${index + 1}`;
}

export function decorateSceneItems(track: HTMLElement) {
  const originals = new Map<string, HTMLElement>();
  const nodes = [...track.querySelectorAll<HTMLElement>(ITEM_SELECTOR)].filter((node) => node.dataset.sceneComposerClone !== 'true' && node.dataset.sceneComposerAsset !== 'true');
  nodes.forEach((node, index) => { const baseId = itemId(node, index); let id = baseId; let suffix = 2; while (originals.has(id)) { id = `${baseId}-${suffix}`; suffix += 1; } node.dataset.sceneComposerId = id; originals.set(id, node); });
  return originals;
}

export function applyScenePlacement(element: HTMLElement, placement: ScenePlacement = DEFAULT_SCENE_PLACEMENT) {
  element.style.setProperty('translate', `${placement.x}px ${placement.y}px`); element.style.setProperty('rotate', `${placement.rotation}deg`);
  const xScale = placement.mirrored ? -placement.scale : placement.scale; element.style.setProperty('scale', `${xScale} ${placement.scale}`);
  if (placement.zIndex === null) element.style.removeProperty('z-index'); else element.style.setProperty('z-index', String(placement.zIndex));
  element.dataset.sceneComposerLocked = placement.locked ? 'true' : 'false';
}

export function resetScenePlacement(element: HTMLElement) { element.style.removeProperty('translate'); element.style.removeProperty('rotate'); element.style.removeProperty('scale'); element.style.removeProperty('z-index'); element.style.removeProperty('display'); element.removeAttribute('data-scene-composer-selected'); element.removeAttribute('data-scene-composer-locked'); }
export function removeSceneDynamicItems(track: HTMLElement) { track.querySelectorAll<HTMLElement>('[data-scene-composer-clone="true"], [data-scene-composer-asset="true"]').forEach((element) => element.remove()); }
function cleanClone(clone: HTMLElement) { clone.style.removeProperty('display'); clone.removeAttribute('data-scene-composer-selected'); clone.querySelectorAll<HTMLElement>('[data-scene-composer-id]').forEach((child) => child.removeAttribute('data-scene-composer-id')); }
function createDuplicate(source: HTMLElement, duplicate: SceneDuplicate) { const clone = source.cloneNode(true) as HTMLElement; cleanClone(clone); clone.dataset.sceneComposerClone = 'true'; clone.dataset.sceneComposerId = duplicate.id; clone.classList.add('scene-composer__clone'); applyScenePlacement(clone, duplicate); return clone; }
function createCroppedAsset(instance: SceneAssetInstance) { const frame = document.createElement('div'); frame.className = 'scene-composer__asset-instance scene-composer__asset-instance--cropped'; frame.dataset.sceneComposerAsset = 'true'; frame.dataset.sceneComposerId = instance.id; frame.style.width = `${instance.width}px`; frame.style.height = `${instance.height}px`; frame.style.overflow = 'hidden'; const image = document.createElement('img'); image.src = assetSrc(instance.file); image.alt = instance.label; image.draggable = false; image.style.position = 'absolute'; image.style.top = `${-(instance.cropY ?? 0)}px`; image.style.left = `${-(instance.cropX ?? 0)}px`; image.style.maxWidth = 'none'; image.style.width = `${instance.sourceWidth ?? instance.width}px`; if (instance.sourceHeight !== undefined) image.style.height = `${instance.sourceHeight}px`; else image.style.height = 'auto'; frame.append(image); applyScenePlacement(frame, instance); return frame; }
function createAsset(instance: SceneAssetInstance) { if (instance.sourceWidth !== undefined && instance.cropX !== undefined) return createCroppedAsset(instance); const image = document.createElement('img'); image.src = assetSrc(instance.file); image.alt = instance.label; image.draggable = false; image.className = 'scene-composer__asset-instance'; image.dataset.sceneComposerAsset = 'true'; image.dataset.sceneComposerId = instance.id; image.style.width = `${instance.width}px`; image.style.height = 'auto'; applyScenePlacement(image, instance); return image; }
export function renderSceneSnapshot(track: HTMLElement, originals: Map<string, HTMLElement>, snapshot: SceneComposerSnapshot) { const removed = new Set(snapshot.removed); for (const [id, element] of originals) { element.style.display = removed.has(id) ? 'none' : ''; applyScenePlacement(element, snapshot.items[id] ?? DEFAULT_SCENE_PLACEMENT); } removeSceneDynamicItems(track); for (const duplicate of snapshot.duplicates) { const source = originals.get(duplicate.sourceId); if (source) source.after(createDuplicate(source, duplicate)); } for (const asset of snapshot.assets) track.append(createAsset(asset)); }
export function sceneElementById(track: HTMLElement, id: string) { return track.querySelector<HTMLElement>(`[data-scene-composer-id="${CSS.escape(id)}"]`); }
export function sceneElementIds(track: HTMLElement) { return [...track.querySelectorAll<HTMLElement>('[data-scene-composer-id]')].filter((element) => element.style.display !== 'none').map((element) => element.dataset.sceneComposerId).filter((id): id is string => typeof id === 'string'); }
export function effectiveZIndex(element: HTMLElement | null) { if (!element) return 0; const parsed = Number.parseInt(window.getComputedStyle(element).zIndex, 10); return Number.isFinite(parsed) ? parsed : 0; }
