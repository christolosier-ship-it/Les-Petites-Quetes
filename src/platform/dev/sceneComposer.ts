import { patchPlacement, placementFor } from './sceneComposerActions';
import { loadSceneAssetCatalog } from './sceneComposerAssets';
import { wireComposerControls } from './sceneComposerControls';
import { decorateSceneItems } from './sceneComposerDom';
import { checkpointScene, emptySceneHistory } from './sceneComposerHistory';
import { isSceneComposerEnabled, loadSceneSnapshot } from './sceneComposerModel';
import { makeSceneComposerShell, renderAssetLibrary } from './sceneComposerPanel';
import { renderComposer, setStatus, syncPanel } from './sceneComposerRuntime';
import type { ComposerState } from './sceneComposerRuntime';

const SCENE_ID = 'gnome-village-campus-v1';
const PANORAMA_SELECTOR = '.gnome-village-scene:not(.parallax-scene--compact) [data-gnome-panorama="true"]';

let started = false;
let activeCleanup: (() => void) | null = null;

function mountComposer(panorama: HTMLElement) {
  activeCleanup?.();
  const track = panorama.querySelector<HTMLElement>('.gnome-panorama__track');
  if (!track) return;
  const shell = makeSceneComposerShell();
  const originals = decorateSceneItems(track);
  const state: ComposerState = {
    track,
    panorama,
    originals,
    originalIds: new Set(originals.keys()),
    shell,
    history: emptySceneHistory(),
    catalog: new Map(),
    snapshot: loadSceneSnapshot(SCENE_ID),
    selectedIds: new Set(),
    primaryId: null,
    drag: null,
    multiMode: false,
    editingField: null,
  };
  panorama.classList.add('scene-composer-panorama-active');
  track.classList.add('scene-composer-track-active');
  renderComposer(state);
  syncPanel(state);

  const modifier = (event: PointerEvent) => event.shiftKey || event.ctrlKey || event.metaKey || state.multiMode;
  const onPointerDown = (event: PointerEvent) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-scene-composer-id]')
      : null;
    if (!target || !track.contains(target)) {
      if (!modifier(event)) {
        state.selectedIds.clear();
        state.primaryId = null;
        syncPanel(state);
      }
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const id = target.dataset.sceneComposerId;
    if (!id) return;
    if (modifier(event)) state.selectedIds.add(id);
    else if (!state.selectedIds.has(id) || state.selectedIds.size === 1) state.selectedIds = new Set([id]);
    state.primaryId = id;

    const movable = [...state.selectedIds].filter((itemId) => !placementFor(state.snapshot, itemId).locked);
    if (movable.length > 0) {
      checkpointScene(state.history, state.snapshot);
      state.drag = {
        ids: movable,
        startX: event.clientX,
        startY: event.clientY,
        origins: new Map(movable.map((itemId) => [
          itemId,
          { x: placementFor(state.snapshot, itemId).x, y: placementFor(state.snapshot, itemId).y },
        ])),
      };
    }
    syncPanel(state);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!state.drag) return;
    event.preventDefault();
    for (const id of state.drag.ids) {
      const origin = state.drag.origins.get(id);
      if (!origin) continue;
      state.snapshot = patchPlacement(state.snapshot, id, {
        x: Math.round(origin.x + event.clientX - state.drag.startX),
        y: Math.round(origin.y + event.clientY - state.drag.startY),
      });
    }
    renderComposer(state);
    syncPanel(state);
    setStatus(state, 'Modifications non enregistrées');
  };
  const onPointerUp = () => { state.drag = null; };
  const onClickCapture = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('[data-scene-composer-id]')) event.stopPropagation();
  };

  track.addEventListener('pointerdown', onPointerDown, true);
  track.addEventListener('click', onClickCapture, true);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  const cleanupControls = wireComposerControls(state, SCENE_ID);

  void loadSceneAssetCatalog().then((assets) => {
    assets.forEach((asset) => state.catalog.set(asset.id, asset));
    renderAssetLibrary(shell, assets);
  }).catch(() => setStatus(state, 'Bibliothèque Habbo indisponible'));

  const cleanup = () => {
    cleanupControls();
    track.removeEventListener('pointerdown', onPointerDown, true);
    track.removeEventListener('click', onClickCapture, true);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    panorama.classList.remove('scene-composer-panorama-active');
    track.classList.remove('scene-composer-track-active');
    track.querySelectorAll<HTMLElement>('[data-scene-composer-selected]').forEach((item) =>
      item.removeAttribute('data-scene-composer-selected'),
    );
    shell.remove();
    activeCleanup = null;
  };
  shell.querySelector('[data-composer-close]')?.addEventListener('click', cleanup);
  activeCleanup = cleanup;
}

function ensureLauncher() {
  const panorama = document.querySelector<HTMLElement>(PANORAMA_SELECTOR);
  const existing = document.querySelector<HTMLButtonElement>('[data-scene-composer-launcher]');
  if (!panorama) {
    existing?.remove();
    activeCleanup?.();
    return;
  }
  if (existing) return;
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'scene-composer-launcher';
  launcher.dataset.sceneComposerLauncher = 'true';
  launcher.textContent = '🎛 Composer';
  launcher.addEventListener('click', () => {
    const scene = panorama.closest<HTMLElement>('.gnome-village-scene');
    if (scene && !scene.classList.contains('parallax-scene--expanded')) {
      scene.querySelector<HTMLButtonElement>('.parallax-scene__expand')?.click();
      window.setTimeout(() => mountComposer(panorama), 80);
    } else {
      mountComposer(panorama);
    }
  });
  document.body.append(launcher);
}

export function startSceneComposer() {
  if (started || !isSceneComposerEnabled()) return;
  started = true;
  let frame = 0;
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(ensureLauncher);
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  ensureLauncher();
}
