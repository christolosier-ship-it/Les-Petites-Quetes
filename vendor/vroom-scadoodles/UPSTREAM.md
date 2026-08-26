# Vroom Scadoodles — build Web Godot

Le mini-jeu du Village des Lutins utilise le build HTML5 Godot de `pstupka/scribble-cars`.

- Dépôt amont : `pstupka/scribble-cars`
- Branche amont : `gh-pages`
- Commit figé : `85860cc6286f3c6ab55b7d448fb4e52ee11c4d09`
- Projet source correspondant observé sur `master` : `c03f5ed728ee14032d2e221d534795af08c80182`
- Vendor local optionnel : `vendor/vroom-scadoodles/web/`
- Runtime matérialisé au build : `public/games/vroom-scadoodles/`

Le runtime contient exactement huit fichiers de l’export Godot : HTML, JavaScript moteur, worklet audio, PCK, WASM et trois images/icônes. `scripts/materialize-vroom-scadoodles.mjs` vérifie l’empreinte Git blob de chacun des huit fichiers avant de l’écrire dans le runtime servi par l’application.

Lorsque les fichiers sont présents dans `vendor/vroom-scadoodles/web/`, le build les utilise directement. Tant que les deux gros binaires ne peuvent pas être injectés via le connecteur GitHub, le matérialiseur possède un fallback de build strictement figé sur le commit ci-dessus. Ce fallback ne crée aucune dépendance réseau côté joueur : le déploiement Vercel contient ensuite le runtime complet et le navigateur charge `/games/vroom-scadoodles/*` depuis Les Petites Quêtes.

Les gros binaires `index.pck` et `index.wasm` ne sont pas précachés lors de l’installation de la PWA. Ils sont chargés et mis en cache lors de la première ouverture du jeu, afin de ne pas imposer environ 43 Mo de téléchargement à tous les utilisateurs qui n’ouvrent jamais ce tableau.
