import { cloneSceneSnapshot } from './sceneComposerModel';
import type { SceneComposerSnapshot } from './sceneComposerModel';

export interface SceneComposerHistory {
  readonly undo: SceneComposerSnapshot[];
  readonly redo: SceneComposerSnapshot[];
}

const LIMIT = 80;

export function emptySceneHistory(): SceneComposerHistory {
  return { undo: [], redo: [] };
}

export function checkpointScene(history: SceneComposerHistory, snapshot: SceneComposerSnapshot) {
  history.undo.push(cloneSceneSnapshot(snapshot));
  if (history.undo.length > LIMIT) history.undo.shift();
  history.redo.splice(0);
}

export function undoScene(history: SceneComposerHistory, current: SceneComposerSnapshot) {
  const previous = history.undo.pop();
  if (!previous) return null;
  history.redo.push(cloneSceneSnapshot(current));
  return previous;
}

export function redoScene(history: SceneComposerHistory, current: SceneComposerSnapshot) {
  const next = history.redo.pop();
  if (!next) return null;
  history.undo.push(cloneSceneSnapshot(current));
  return next;
}
