import { addAsset, patchPlacement, placementFor } from './sceneComposerActions';
import type { SceneAssetDefinition } from './sceneComposerAssets';
import { effectiveZIndex, renderSceneSnapshot, sceneElementById, sceneElementIds } from './sceneComposerDom';
import type { SceneComposerHistory } from './sceneComposerHistory';
import { checkpointScene } from './sceneComposerHistory';
import { DEFAULT_SCENE_PLACEMENT } from './sceneComposerModel';
import type { SceneComposerSnapshot, ScenePlacement } from './sceneComposerModel';

export type DragState = Readonly<{
  ids: string[];
  startX: number;
  startY: number;
  origins: Map<string, { x: number; y: number }>;
}>;

export interface ComposerState {
  readonly track: HTMLElement;
  readonly panorama: HTMLElement;
  readonly originals: Map<string, HTMLElement>;
  readonly originalIds: Set<string>;
  readonly shell: HTMLElement;
  readonly history: SceneComposerHistory;
  readonly catalog: Map<string, SceneAssetDefinition>;
  snapshot: SceneComposerSnapshot;
  selectedIds: Set<string>;
  primaryId: string | null;
  drag: DragState | null;
  multiMode: boolean;
  editingField: string | null;
}

export function setStatus(state: ComposerState, text: string) {
  const status = state.shell.querySelector<HTMLElement>('[data-composer-status]');
  if (status) status.textContent = text;
}

export function renderComposer(state: ComposerState) {
  renderSceneSnapshot(state.track, state.originals, state.snapshot);
  const existing = new Set(sceneElementIds(state.track));
  state.selectedIds = new Set([...state.selectedIds].filter((id) => existing.has(id)));
  if (!state.primaryId || !state.selectedIds.has(state.primaryId)) state.primaryId = [...state.selectedIds].at(-1) ?? null;
}

export function syncPanel(state: ComposerState) {
  state.track.querySelectorAll<HTMLElement>('[data-scene-composer-selected]').forEach((item) =>
    item.removeAttribute('data-scene-composer-selected'),
  );
  for (const id of state.selectedIds) sceneElementById(state.track, id)?.setAttribute('data-scene-composer-selected', 'true');

  const count = state.selectedIds.size;
  const title = state.shell.querySelector<HTMLElement>('[data-composer-title]');
  const countLabel = state.shell.querySelector<HTMLElement>('[data-composer-count]');
  if (title) title.textContent = count > 1 ? `${count} objets sélectionnés` : state.primaryId ?? 'Sélectionne un élément';
  if (countLabel) countLabel.textContent = `${count} objet${count > 1 ? 's' : ''}`;

  const placement = state.primaryId ? placementFor(state.snapshot, state.primaryId) : DEFAULT_SCENE_PLACEMENT;
  const singleEditable = count === 1 && !placement.locked;
  for (const field of ['x', 'y', 'rotation', 'scale', 'zIndex'] as const) {
    const input = state.shell.querySelector<HTMLInputElement>(`[data-composer-field="${field}"]`);
    if (!input) continue;
    input.disabled = !singleEditable;
    input.value = count === 1 ? (field === 'zIndex' ? String(placement.zIndex ?? '') : String(placement[field])) : '';
  }
  state.shell.querySelectorAll<HTMLButtonElement>('[data-composer-selection-action]').forEach((button) => {
    button.disabled = count === 0;
  });
  const lock = state.shell.querySelector<HTMLButtonElement>('[data-composer-lock]');
  if (lock) lock.textContent = [...state.selectedIds].some((id) => !placementFor(state.snapshot, id).locked)
    ? '🔒 Verrouiller'
    : '🔓 Déverrouiller';
  const multi = state.shell.querySelector<HTMLButtonElement>('[data-composer-multi]');
  if (multi) multi.setAttribute('aria-pressed', String(state.multiMode));
  const undo = state.shell.querySelector<HTMLButtonElement>('[data-composer-undo]');
  const redo = state.shell.querySelector<HTMLButtonElement>('[data-composer-redo]');
  if (undo) undo.disabled = state.history.undo.length === 0;
  if (redo) redo.disabled = state.history.redo.length === 0;
}

export function commitAndRender(state: ComposerState, mutate: () => void, status: string) {
  checkpointScene(state.history, state.snapshot);
  mutate();
  renderComposer(state);
  syncPanel(state);
  setStatus(state, status);
}

export function updateSingleField(state: ComposerState, field: keyof ScenePlacement, value: number | null) {
  if (!state.primaryId || state.selectedIds.size !== 1) return;
  const current = placementFor(state.snapshot, state.primaryId);
  if (current.locked) return;
  const patch: Partial<ScenePlacement> = field === 'zIndex'
    ? { zIndex: value }
    : { [field]: value };
  state.snapshot = patchPlacement(state.snapshot, state.primaryId, patch);
  renderComposer(state);
  syncPanel(state);
  setStatus(state, 'Modifications non enregistrées');
}

export function shiftLayer(state: ComposerState, direction: 1 | -1) {
  const selected = [...state.selectedIds].filter((id) => !placementFor(state.snapshot, id).locked);
  const others = sceneElementIds(state.track).filter((id) => !state.selectedIds.has(id));
  if (selected.length === 0 || others.length === 0) return;
  const selectedZ = selected.map((id) => effectiveZIndex(sceneElementById(state.track, id)));
  const otherZ = others.map((id) => effectiveZIndex(sceneElementById(state.track, id)));
  const delta = direction > 0
    ? Math.max(1, Math.max(...otherZ) - Math.min(...selectedZ) + 1)
    : Math.min(-1, Math.min(...otherZ) - Math.max(...selectedZ) - 1);
  for (const id of selected) {
    const currentZ = effectiveZIndex(sceneElementById(state.track, id));
    state.snapshot = patchPlacement(state.snapshot, id, { zIndex: currentZ + delta });
  }
}

export function addLibraryAsset(state: ComposerState, assetId: string, clientX: number, clientY: number) {
  const asset = state.catalog.get(assetId);
  if (!asset) return;
  const trackRect = state.track.getBoundingClientRect();
  const maxZ = Math.max(20, ...sceneElementIds(state.track).map((id) => effectiveZIndex(sceneElementById(state.track, id))));
  commitAndRender(state, () => {
    const added = addAsset(state.snapshot, asset, clientX - trackRect.left, clientY - trackRect.top, maxZ + 1);
    state.snapshot = added.snapshot;
    state.selectedIds = new Set([added.id]);
    state.primaryId = added.id;
  }, `${asset.label} ajouté`);
}

export function exportSnapshot(state: ComposerState, sceneId: string) {
  const blob = new Blob([`${JSON.stringify(state.snapshot, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${sceneId}.scene.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus(state, 'JSON exporté');
}
