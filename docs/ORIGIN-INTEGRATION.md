# Origin dans Les Petites Quêtes

Le tableau **La Montagne du Dragon** embarque le mini-jeu Origin 16-bit ARPG comme jeu web autonome.

## Source locale figée

- Projet amont : `DFarm6/origin-16bit-arpg`
- Commit importé : `1e11bd3faee664160faa6b2e6bd440fa7304b603`
- Licence : MIT, conservée dans `vendor/origin/LICENSE` et `public/games/origin/LICENSE`
- Source : copie locale dans `vendor/origin/index.html`

Le build de Les Petites Quêtes ne contacte plus le dépôt amont. `materialize-origin-game.mjs` lit la copie locale, vérifie son Git blob SHA, applique la traduction française et génère `public/games/origin/index.html`.

## Intégration UI

`DragonMountainGame.tsx` charge le jeu dans une iframe same-origin. Le mini-jeu conserve ses contrôles clavier et tactiles et propose un mode grand écran. Les sauvegardes utilisent `localStorage` avec le préfixe `lpq:origin:`.
