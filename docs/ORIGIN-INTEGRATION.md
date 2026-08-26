# Origin dans Les Petites Quêtes

Le tableau **La Montagne du Dragon** embarque le mini-jeu Origin 16-bit ARPG comme jeu web autonome.

## Source figée

- Projet amont : `DFarm6/origin-16bit-arpg`
- Commit : `1e11bd3faee664160faa6b2e6bd440fa7304b603`
- Blob `index.html` attendu : `3d4fa219a225b048136d47d9a977c96aaf15d4e1`
- Licence : MIT, copie conservée dans `public/games/origin/LICENSE`

## Matérialisation

`node scripts/materialize-origin-game.mjs` récupère exactement le commit amont figé, vérifie son Git blob SHA, applique la traduction française de `scripts/origin-fr-translations.mjs`, ajoute la persistance locale puis génère `public/games/origin/index.html`.

La commande est branchée sur `predev` et `prebuild`, afin que le jeu soit disponible en développement comme dans le build Vercel.

## Intégration UI

`DragonMountainGame.tsx` charge le jeu dans une iframe same-origin. Le mini-jeu conserve ses contrôles clavier et tactiles et propose un mode grand écran. Les sauvegardes Origin passent par un adaptateur `window.storage` vers `localStorage`, préfixé `lpq:origin:`.

## Traduction

La traduction couvre les textes visibles du jeu : menus, classes, compétences, objets, zones, boss, PNJ, tutoriels, paramètres, messages de combat et écrans de progression. Le matérialiseur refuse le build lorsqu'une chaîne d'interface chinoise reste détectée, afin d'éviter une régression de localisation lors d'une future mise à jour de la source.
