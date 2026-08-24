import { deleteSceneItems, duplicateSceneItems, resetSceneItems, toggleLock, toggleMirror } from './sceneComposerActions';
import { checkpointScene, redoScene, undoScene } from './sceneComposerHistory';
import { clearSceneSnapshot, emptySceneSnapshot, saveSceneSnapshot } from './sceneComposerModel';
import type { ScenePlacement } from './sceneComposerModel';
import { filterAssetLibrary } from './sceneComposerPanel';
import { addLibraryAsset, commitAndRender, exportSnapshot, renderComposer, setStatus, shiftLayer, syncPanel, updateSingleField } from './sceneComposerRuntime';
import type { ComposerState } from './sceneComposerRuntime';

const ASSET_DRAG_TYPE = 'application/x-lpq-scene-asset';

function restoreHistory(state: ComposerState, direction: 'undo' | 'redo') {
  const snapshot = direction === 'undo'
    ? undoScene(state.history, state.snapshot)
    : redoScene(state.history, state.snapshot);
  if (!snapshot) return;
  state.snapshot = snapshot;
  renderComposer(state);
  syncPanel(state);
  setStatus(state, direction === 'undo' ? 'Annulé' : 'Rétabli');
}

function duplicateSelection(state: ComposerState) {
  commitAndRender(state, () => {
    const result = duplicateSceneItems(state.snapshot, state.selectedIds);
    state.snapshot = result.snapshot;
    if (result.created.length > 0) {
      state.selectedIds = new Set(result.created);
      state.primaryId = result.created.at(-1) ?? null;
    }
  }, 'Sélection dupliquée');
}

function deleteSelection(state: ComposerState) {
  commitAndRender(state, () => {
    state.snapshot = deleteSceneItems(state.snapshot, state.selectedIds, state.originalIds);
  }, 'Sélection supprimée');
}

function resetSelection(state: ComposerState) {
  commitAndRender(state, () => {
    state.snapshot = resetSceneItems(state.snapshot, state.selectedIds, state.originalIds);
  }, 'Sélection réinitialisée');
}

function wireFieldControls(state: ComposerState) {
  state.shell.querySelectorAll<HTMLInputElement>('[data-composer-field]').forEach((input) => {
    const field = input.dataset.composerField as keyof ScenePlacement | undefined;
    if (!field) return;
    input.addEventListener('focus', () => {
      if (state.editingField === field) return;
      checkpointScene(state.history, state.snapshot);
      state.editingField = field;
      syncPanel(state);
    });
    input.addEventListener('blur', () => { state.editingField = null; });
    input.addEventListener('input', () => {
      if (field === 'zIndex') {
        updateSingleField(state, field, input.value === '' ? null : Number(input.value));
        return;
      }
      const value = Number(input.value);
      if (Number.isFinite(value)) updateSingleField(state, field, value);
    });
  });
}

function wireLibrary(state: ComposerState) {
  const search = state.shell.querySelector<HTMLInputElement>('[data-composer-library-search]');
  const category = state.shell.querySelector<HTMLSelectElement>('[data-composer-library-category]');
  search?.addEventListener('input', () => filterAssetLibrary(state.shell));
  category?.addEventListener('change', () => filterAssetLibrary(state.shell));

  state.shell.addEventListener('dragstart', (event) => {
    const card = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-composer-asset-id]') : null;
    const assetId = card?.dataset.composerAssetId;
    if (!assetId || !event.dataTransfer) return;
    event.dataTransfer.setData(ASSET_DRAG_TYPE, assetId);
    event.dataTransfer.effectAllowed = 'copy';
  });
  state.shell.addEventListener('click', (event) => {
    const card = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-composer-asset-id]') : null;
    const assetId = card?.dataset.composerAssetId;
    if (!assetId) return;
    const view = state.panorama.getBoundingClientRect();
    addLibraryAsset(state, assetId, view.left + view.width / 2, view.top + view.height / 2);
  });

  const onDragOver = (event: DragEvent) => {
    if (!event.dataTransfer?.types.includes(ASSET_DRAG_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };
  const onDrop = (event: DragEvent) => {
    const assetId = event.dataTransfer?.getData(ASSET_DRAG_TYPE);
    if (!assetId) return;
    event.preventDefault();
    addLibraryAsset(state, assetId, event.clientX, event.clientY);
  };
  state.panorama.addEventListener('dragover', onDragOver);
  state.panorama.addEventListener('drop', onDrop);
  return () => {
    state.panorama.removeEventListener('dragover', onDragOver);
    state.panorama.removeEventListener('drop', onDrop);
  };
}

export function wireComposerControls(state: ComposerState, sceneId: string) {
  wireFieldControls(state);
  const action = (selector: string, handler: () => void) =>
    state.shell.querySelector(selector)?.addEventListener('click', handler);

  action('[data-composer-undo]', () => restoreHistory(state, 'undo'));
  action('[data-composer-redo]', () => restoreHistory(state, 'redo'));
  action('[data-composer-duplicate]', () => duplicateSelection(state));
  action('[data-composer-mirror]', () => commitAndRender(state, () => {
    state.snapshot = toggleMirror(state.snapshot, state.selectedIds);
  }, 'Miroir appliqué'));
  action('[data-composer-lock]', () => commitAndRender(state, () => {
    state.snapshot = toggleLock(state.snapshot, state.selectedIds);
  }, 'Verrouillage mis à jour'));
  action('[data-composer-front]', () => commitAndRender(state, () => shiftLayer(state, 1), 'Sélection placée devant'));
  action('[data-composer-back]', () => commitAndRender(state, () => shiftLayer(state, -1), 'Sélection placée derrière'));
  action('[data-composer-delete]', () => deleteSelection(state));
  action('[data-composer-reset-item]', () => resetSelection(state));
  action('[data-composer-multi]', () => {
    state.multiMode = !state.multiMode;
    syncPanel(state);
    setStatus(state, state.multiMode ? 'Multi-sélection active' : 'Multi-sélection désactivée');
  });
  action('[data-composer-save]', () => {
    state.snapshot = saveSceneSnapshot(state.snapshot);
    setStatus(state, 'Sauvegardé dans ce navigateur ✓');
  });
  action('[data-composer-export]', () => exportSnapshot(state, sceneId));
  action('[data-composer-reset]', () => commitAndRender(state, () => {
    clearSceneSnapshot(sceneId);
    state.snapshot = emptySceneSnapshot(sceneId);
    state.selectedIds.clear();
    state.primaryId = null;
  }, 'Scène réinitialisée'));

  const cleanupLibrary = wireLibrary(state);
  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target?.matches('input, textarea, select') || target?.isContentEditable) return;
    const command = event.ctrlKey || event.metaKey;
    if (command && event.key.toLowerCase() === 'z') {
      event.preventDefault(); restoreHistory(state, event.shiftKey ? 'redo' : 'undo'); return;
    }
    if (command && event.key.toLowerCase() === 'y') {
      event.preventDefault(); restoreHistory(state, 'redo'); return;
    }
    if (command && event.key.toLowerCase() === 'd' && state.selectedIds.size > 0) {
      event.preventDefault(); duplicateSelection(state); return;
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && state.selectedIds.size > 0) {
      event.preventDefault(); deleteSelection(state);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => {
    cleanupLibrary();
    window.removeEventListener('keydown', onKeyDown);
  };
}
