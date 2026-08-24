import { assetSrc } from './sceneComposerAssets';
import type { SceneAssetDefinition } from './sceneComposerAssets';

export function makeSceneComposerShell() {
  const shell = document.createElement('aside');
  shell.className = 'scene-composer';
  shell.innerHTML = `
    <header>
      <strong>🎛 Scene Composer</strong>
      <div class="scene-composer__header-actions">
        <button type="button" data-composer-undo title="Annuler (Ctrl/Cmd+Z)">↶</button>
        <button type="button" data-composer-redo title="Rétablir (Ctrl/Cmd+Y)">↷</button>
        <button type="button" data-composer-close aria-label="Fermer">✕</button>
      </div>
    </header>
    <div class="scene-composer__selected"><span>Sélection</span><b data-composer-title>Sélectionne un élément</b><small data-composer-count>0 objet</small></div>
    <button type="button" class="scene-composer__multi" data-composer-multi aria-pressed="false">☑ Sélection multiple</button>
    <div class="scene-composer__grid">
      <label>X <input data-composer-field="x" type="number" step="1"></label><label>Y <input data-composer-field="y" type="number" step="1"></label>
      <label>Rotation <input data-composer-field="rotation" type="number" step="1"></label><label>Échelle <input data-composer-field="scale" type="number" min="0.1" max="4" step="0.05"></label>
      <label>Plan Z <input data-composer-field="zIndex" type="number" step="1" placeholder="auto"></label>
    </div>
    <div class="scene-composer__actions scene-composer__actions--three"><button type="button" data-composer-selection-action data-composer-duplicate>⧉ Dupliquer</button><button type="button" data-composer-selection-action data-composer-mirror>⇋ Miroir</button><button type="button" data-composer-selection-action data-composer-lock>🔒 Verrouiller</button></div>
    <div class="scene-composer__actions scene-composer__actions--three"><button type="button" data-composer-selection-action data-composer-front>⬆ Devant</button><button type="button" data-composer-selection-action data-composer-back>⬇ Derrière</button><button type="button" data-composer-selection-action data-composer-delete>🗑 Supprimer</button></div>
    <div class="scene-composer__actions"><button type="button" data-composer-selection-action data-composer-reset-item>↺ Réinitialiser la sélection</button></div>
    <details class="scene-composer__library" open>
      <summary>🧰 Bibliothèque Habbo</summary>
      <div class="scene-composer__library-tools"><input type="search" data-composer-library-search placeholder="Chercher un meuble…" aria-label="Chercher dans la bibliothèque"><select data-composer-library-category aria-label="Catégorie"><option value="">Toutes</option><option>Structure</option><option>Classe</option><option>Cantine</option><option>Cour</option><option>Personnages</option></select></div>
      <div class="scene-composer__asset-grid" data-composer-library><small>Chargement des assets…</small></div>
      <small>Glisse un asset dans la scène, ou touche-le pour l’ajouter au centre de la vue.</small>
    </details>
    <div class="scene-composer__actions scene-composer__actions--scene"><button type="button" data-composer-save>💾 Enregistrer</button><button type="button" data-composer-export>⇩ Exporter JSON</button><button type="button" data-composer-reset>🧹 Réinitialiser la scène</button></div>
    <small data-composer-status>Glisse directement les objets dans la scène.</small>`;
  document.body.append(shell);
  return shell;
}

function makeAssetPreview(asset: SceneAssetDefinition) {
  const image = document.createElement('img');
  image.src = assetSrc(asset.file); image.alt = ''; image.draggable = false;
  if (asset.sourceWidth === undefined || asset.cropX === undefined) return image;
  const scale = Math.min(54 / asset.width, 52 / asset.height, 1);
  const frame = document.createElement('div');
  frame.className = 'scene-composer__asset-preview-crop';
  frame.style.width = `${Math.round(asset.width * scale)}px`; frame.style.height = `${Math.round(asset.height * scale)}px`;
  frame.style.position = 'relative'; frame.style.overflow = 'hidden';
  image.style.position = 'absolute'; image.style.top = '0'; image.style.maxWidth = 'none'; image.style.maxHeight = 'none';
  image.style.width = `${asset.sourceWidth * scale}px`; image.style.left = `${-asset.cropX * scale}px`;
  frame.append(image); return frame;
}

export function renderAssetLibrary(shell: HTMLElement, assets: SceneAssetDefinition[]) {
  const grid = shell.querySelector<HTMLElement>('[data-composer-library]');
  if (!grid) return;
  const cards = assets.map((asset) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'scene-composer__asset-card'; button.dataset.composerAssetId = asset.id;
    button.dataset.composerAssetCategory = asset.category; button.dataset.composerAssetSearch = `${asset.label} ${asset.source}`.toLowerCase();
    button.draggable = true; button.title = `${asset.label} · ${asset.source}`;
    const label = document.createElement('span'); label.textContent = asset.label;
    button.append(makeAssetPreview(asset), label); return button;
  });
  grid.replaceChildren(...cards);
}

export function filterAssetLibrary(shell: HTMLElement) {
  const query = shell.querySelector<HTMLInputElement>('[data-composer-library-search]')?.value.trim().toLowerCase() ?? '';
  const category = shell.querySelector<HTMLSelectElement>('[data-composer-library-category]')?.value ?? '';
  shell.querySelectorAll<HTMLElement>('[data-composer-asset-id]').forEach((card) => {
    const matchesQuery = !query || card.dataset.composerAssetSearch?.includes(query) === true;
    const matchesCategory = !category || card.dataset.composerAssetCategory === category;
    card.hidden = !(matchesQuery && matchesCategory);
  });
}
