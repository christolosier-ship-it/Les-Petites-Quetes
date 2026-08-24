import { applyScenePlacement, decorateSceneItems, removeSceneClones, resetScenePlacement } from './sceneComposerDom';
import { DEFAULT_SCENE_PLACEMENT, clearSceneSnapshot, emptySceneSnapshot, isSceneComposerEnabled, loadSceneSnapshot, saveSceneSnapshot } from './sceneComposerModel';
import { makeSceneComposerShell } from './sceneComposerPanel';
import type { SceneComposerSnapshot, SceneDuplicate, ScenePlacement } from './sceneComposerModel';

const SCENE_ID = 'gnome-village';
const PANORAMA_SELECTOR = '.gnome-village-scene:not(.parallax-scene--compact) [data-gnome-panorama="true"]';

type DragState = Readonly<{ id: string; startX: number; startY: number; originX: number; originY: number }>;

interface ComposerState {
  readonly track: HTMLElement;
  readonly panorama: HTMLElement;
  readonly originals: Map<string, HTMLElement>;
  snapshot: SceneComposerSnapshot;
  selectedId: string | null;
  drag: DragState | null;
  readonly shell: HTMLElement;
}

let started = false;
let activeCleanup: (() => void) | null = null;

function placementFor(state: ComposerState, id: string): ScenePlacement {
  const duplicate = state.snapshot.duplicates.find((item) => item.id === id);
  return duplicate ?? state.snapshot.items[id] ?? DEFAULT_SCENE_PLACEMENT;
}

function patchPlacement(state: ComposerState, id: string, patch: Partial<ScenePlacement>) {
  const duplicateIndex = state.snapshot.duplicates.findIndex((item) => item.id === id);
  if (duplicateIndex >= 0) {
    const duplicates = [...state.snapshot.duplicates];
    const current = duplicates[duplicateIndex];
    if (!current) return;
    duplicates[duplicateIndex] = { ...current, ...patch };
    state.snapshot = { ...state.snapshot, duplicates };
    return;
  }
  state.snapshot = {
    ...state.snapshot,
    items: { ...state.snapshot.items, [id]: { ...placementFor(state, id), ...patch } },
  };
}

function renderSnapshot(state: ComposerState) {
  for (const [id, element] of state.originals) {
    applyScenePlacement(element, state.snapshot.items[id] ?? DEFAULT_SCENE_PLACEMENT);
  }
  removeSceneClones(state.track);
  for (const duplicate of state.snapshot.duplicates) {
    const source = state.originals.get(duplicate.sourceId);
    if (!source) continue;
    const clone = source.cloneNode(true) as HTMLElement;
    clone.querySelectorAll<HTMLElement>('[data-scene-composer-id]').forEach((child) =>
      child.removeAttribute('data-scene-composer-id'),
    );
    clone.dataset.sceneComposerClone = 'true';
    clone.dataset.sceneComposerId = duplicate.id;
    clone.classList.add('scene-composer__clone');
    applyScenePlacement(clone, duplicate);
    source.after(clone);
  }
}

function selectedElement(state: ComposerState) {
  if (!state.selectedId) return null;
  return state.track.querySelector<HTMLElement>(`[data-scene-composer-id="${CSS.escape(state.selectedId)}"]`);
}

function setStatus(state: ComposerState, text: string) {
  const status = state.shell.querySelector<HTMLElement>('[data-composer-status]');
  if (status) status.textContent = text;
}

function syncPanel(state: ComposerState) {
  state.track.querySelectorAll<HTMLElement>('[data-scene-composer-selected]').forEach((item) =>
    item.removeAttribute('data-scene-composer-selected'),
  );
  const selected = selectedElement(state);
  if (selected) selected.dataset.sceneComposerSelected = 'true';
  const title = state.shell.querySelector<HTMLElement>('[data-composer-title]');
  if (title) title.textContent = state.selectedId ?? 'Sélectionne un élément';
  const placement = state.selectedId ? placementFor(state, state.selectedId) : DEFAULT_SCENE_PLACEMENT;
  for (const field of ['x', 'y', 'rotation', 'scale', 'zIndex'] as const) {
    const input = state.shell.querySelector<HTMLInputElement>(`[data-composer-field="${field}"]`);
    if (!input) continue;
    input.disabled = !state.selectedId;
    input.value = field === 'zIndex' ? String(placement.zIndex ?? '') : String(placement[field]);
  }
  state.shell.querySelectorAll<HTMLButtonElement>('[data-composer-selection-action]').forEach((button) => {
    button.disabled = !state.selectedId;
  });
}

function updateSelected(state: ComposerState, patch: Partial<ScenePlacement>) {
  if (!state.selectedId) return;
  patchPlacement(state, state.selectedId, patch);
  const element = selectedElement(state);
  if (element) applyScenePlacement(element, placementFor(state, state.selectedId));
  syncPanel(state);
  setStatus(state, 'Modifications non enregistrées');
}

function duplicateSelected(state: ComposerState) {
  if (!state.selectedId) return;
  const sourceDuplicate = state.snapshot.duplicates.find((item) => item.id === state.selectedId);
  const sourceId = sourceDuplicate?.sourceId ?? state.selectedId;
  const current = placementFor(state, state.selectedId);
  const duplicate: SceneDuplicate = {
    ...current,
    x: current.x + 24,
    y: current.y - 16,
    id: `${sourceId}--copy-${Date.now().toString(36)}`,
    sourceId,
  };
  state.snapshot = { ...state.snapshot, duplicates: [...state.snapshot.duplicates, duplicate] };
  renderSnapshot(state);
  state.selectedId = duplicate.id;
  syncPanel(state);
  setStatus(state, 'Copie créée');
}

function exportSnapshot(state: ComposerState) {
  const blob = new Blob([`${JSON.stringify(state.snapshot, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${SCENE_ID}.scene.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus(state, 'JSON exporté');
}

function mountComposer(panorama: HTMLElement) {
  activeCleanup?.();
  const track = panorama.querySelector<HTMLElement>('.gnome-panorama__track');
  if (!track) return;
  const shell = makeSceneComposerShell();
  const state: ComposerState = {
    track,
    panorama,
    originals: decorateSceneItems(track),
    snapshot: loadSceneSnapshot(SCENE_ID),
    selectedId: null,
    drag: null,
    shell,
  };
  panorama.classList.add('scene-composer-panorama-active');
  track.classList.add('scene-composer-track-active');
  renderSnapshot(state);
  syncPanel(state);

  const onPointerDown = (event: PointerEvent) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-scene-composer-id]')
      : null;
    if (!target || !track.contains(target)) return;
    event.preventDefault();
    event.stopPropagation();
    const id = target.dataset.sceneComposerId;
    if (!id) return;
    state.selectedId = id;
    const placement = placementFor(state, id);
    state.drag = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: placement.x,
      originY: placement.y,
    };
    syncPanel(state);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!state.drag) return;
    event.preventDefault();
    const x = Math.round(state.drag.originX + event.clientX - state.drag.startX);
    const y = Math.round(state.drag.originY + event.clientY - state.drag.startY);
    patchPlacement(state, state.drag.id, { x, y });
    const element = selectedElement(state);
    if (element) applyScenePlacement(element, placementFor(state, state.drag.id));
    syncPanel(state);
    setStatus(state, 'Modifications non enregistrées');
  };
  const onPointerUp = () => {
    state.drag = null;
  };
  const onClickCapture = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('[data-scene-composer-id]')) {
      event.stopPropagation();
    }
  };
  track.addEventListener('pointerdown', onPointerDown, true);
  track.addEventListener('click', onClickCapture, true);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);

  shell.querySelectorAll<HTMLInputElement>('[data-composer-field]').forEach((input) => {
    input.addEventListener('input', () => {
      const field = input.dataset.composerField as keyof ScenePlacement | undefined;
      if (!field) return;
      if (field === 'zIndex') {
        updateSelected(state, { zIndex: input.value === '' ? null : Number(input.value) });
      } else {
        updateSelected(state, { [field]: Number(input.value) });
      }
    });
  });
  shell.querySelector('[data-composer-duplicate]')?.addEventListener('click', () => duplicateSelected(state));
  shell.querySelector('[data-composer-reset-item]')?.addEventListener('click', () => {
    if (!state.selectedId) return;
    const duplicateIndex = state.snapshot.duplicates.findIndex((item) => item.id === state.selectedId);
    if (duplicateIndex >= 0) {
      state.snapshot = {
        ...state.snapshot,
        duplicates: state.snapshot.duplicates.filter((_, index) => index !== duplicateIndex),
      };
    } else {
      const items = { ...state.snapshot.items };
      delete items[state.selectedId];
      state.snapshot = { ...state.snapshot, items };
    }
    state.selectedId = null;
    renderSnapshot(state);
    syncPanel(state);
    setStatus(state, 'Objet réinitialisé');
  });
  shell.querySelector('[data-composer-save]')?.addEventListener('click', () => {
    state.snapshot = saveSceneSnapshot(state.snapshot);
    setStatus(state, 'Sauvegardé dans ce navigateur ✓');
  });
  shell.querySelector('[data-composer-export]')?.addEventListener('click', () => exportSnapshot(state));
  shell.querySelector('[data-composer-reset]')?.addEventListener('click', () => {
    clearSceneSnapshot(SCENE_ID);
    state.snapshot = emptySceneSnapshot(SCENE_ID);
    state.selectedId = null;
    state.originals.forEach(resetScenePlacement);
    removeSceneClones(track);
    syncPanel(state);
    setStatus(state, 'Scène réinitialisée');
  });

  const cleanup = () => {
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
