import { DEFAULT_SCENE_PLACEMENT } from './sceneComposerModel';
import type { ScenePlacement } from './sceneComposerModel';

const ITEM_SELECTOR = [
  '.gnome-zone > .gnome-prop',
  '.gnome-zone > .gnome-actor',
  '.gnome-zone > .gnome-desk-cluster',
  '.gnome-zone > .gnome-teacher-station',
  '.gnome-zone > .gnome-canteen-table',
  '.gnome-zone > .gnome-floating-asset',
].join(',');

const ID_PREFIXES = [
  'gnome-prop--',
  'gnome-actor--',
  'gnome-desk-cluster--',
  'gnome-canteen-table--',
  'gnome-floating-asset--',
];

function itemId(element: HTMLElement, index: number) {
  const semantic = [...element.classList].find((className) =>
    ID_PREFIXES.some((prefix) => className.startsWith(prefix)),
  );
  if (semantic) return semantic;
  if (element.classList.contains('gnome-teacher-station')) return 'gnome-teacher-station';
  return `gnome-item-${index + 1}`;
}

export function decorateSceneItems(track: HTMLElement) {
  const originals = new Map<string, HTMLElement>();
  const nodes = [...track.querySelectorAll<HTMLElement>(ITEM_SELECTOR)].filter(
    (node) => node.dataset.sceneComposerClone !== 'true',
  );

  nodes.forEach((node, index) => {
    const baseId = itemId(node, index);
    let id = baseId;
    let suffix = 2;
    while (originals.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    node.dataset.sceneComposerId = id;
    originals.set(id, node);
  });

  return originals;
}

export function applyScenePlacement(element: HTMLElement, placement: ScenePlacement = DEFAULT_SCENE_PLACEMENT) {
  element.style.setProperty('translate', `${placement.x}px ${placement.y}px`);
  element.style.setProperty('rotate', `${placement.rotation}deg`);
  element.style.setProperty('scale', String(placement.scale));
  if (placement.zIndex === null) element.style.removeProperty('z-index');
  else element.style.setProperty('z-index', String(placement.zIndex));
}

export function resetScenePlacement(element: HTMLElement) {
  element.style.removeProperty('translate');
  element.style.removeProperty('rotate');
  element.style.removeProperty('scale');
  element.style.removeProperty('z-index');
  element.removeAttribute('data-scene-composer-selected');
}

export function removeSceneClones(track: HTMLElement) {
  track.querySelectorAll<HTMLElement>('[data-scene-composer-clone="true"]').forEach((clone) => clone.remove());
}
