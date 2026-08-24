export function makeSceneComposerShell() {
  const shell = document.createElement('aside');
  shell.className = 'scene-composer';
  shell.innerHTML = `
    <header><strong>🎛 Scene Composer</strong><button type="button" data-composer-close aria-label="Fermer">✕</button></header>
    <div class="scene-composer__selected"><span>Élément</span><b data-composer-title>Sélectionne un élément</b></div>
    <div class="scene-composer__grid">
      <label>X <input data-composer-field="x" type="number" step="1"></label>
      <label>Y <input data-composer-field="y" type="number" step="1"></label>
      <label>Rotation <input data-composer-field="rotation" type="number" step="1"></label>
      <label>Échelle <input data-composer-field="scale" type="number" min="0.1" max="4" step="0.05"></label>
      <label>Plan Z <input data-composer-field="zIndex" type="number" step="1" placeholder="auto"></label>
    </div>
    <div class="scene-composer__actions">
      <button type="button" data-composer-selection-action data-composer-duplicate>⧉ Dupliquer</button>
      <button type="button" data-composer-selection-action data-composer-reset-item>↺ Réinitialiser l’objet</button>
    </div>
    <div class="scene-composer__actions scene-composer__actions--scene">
      <button type="button" data-composer-save>💾 Enregistrer</button>
      <button type="button" data-composer-export>⇩ Exporter JSON</button>
      <button type="button" data-composer-reset>🧹 Réinitialiser la scène</button>
    </div>
    <small data-composer-status>Glisse directement les objets dans la scène.</small>`;
  document.body.append(shell);
  return shell;
}
