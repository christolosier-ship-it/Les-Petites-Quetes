# La Forêt des Lucioles — sources d’assets

## Règle du monde 1

La Forêt des Lucioles n’utilise que des ressources gratuites dont la licence autorise explicitement leur usage dans le projet. Aucun asset payant ne doit être ajouté au dépôt.

Le rendu est hybride : Three.js reste responsable des acteurs, lumières et particules, tandis que plusieurs plans illustrés 2D enrichissent le diorama.

## Règle local-first

Les assets graphiques utilisés par la scène sont embarqués dans `public/worlds/firefly-forest/` et référencés par `src/assets/registry/firefly-assets.json`. L’application ne dépend d’aucun serveur d’images externe pour afficher la Forêt.

Les pages Openclipart ci-dessous restent uniquement les références de provenance et de licence. Les PNG source ont été téléchargés une fois lors de l’intégration puis convertis en WebP local avec conservation de la transparence lorsque nécessaire.

## Assets CC0 effectivement utilisés

### Pleasant meadow scene

- Usage : grand plan de prairie illustrée servant de matière de fond.
- Auteur du remix : anarres.
- Origine : artworks Glitch / Tiny Speck.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/251204/pleasant-meadow-scene
- Fichier local : `public/worlds/firefly-forest/meadow.webp`.
- Transformation : conversion WebP, assombrissement nocturne, désaturation partielle, teinte bleue, contraste et parallaxe à l’affichage.

### Cottage from Glitch

- Usage : cottage principal à partir du stade 1.
- Auteur du remix : anarres.
- Origine : Glitch.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/311437/cottage-from-glitch
- Fichier local : `public/worlds/firefly-forest/cottage.webp`.
- Transformation : conversion WebP, colorimétrie nocturne, halo chaud, ombre portée et parallaxe à l’affichage.

### Rustic house from Glitch

- Usage : maison secondaire lointaine à partir du stade 2.
- Auteur du remix : anarres.
- Origine : Glitch.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/299648/rustic-house-from-glitch
- Fichier local : `public/worlds/firefly-forest/rustic-house.webp`.
- Transformation : conversion WebP, réduction visuelle, traitement atmosphérique et halo chaud à l’affichage.

### Tree House from Glitch

- Usage : habitation féerique supplémentaire au stade 3.
- Auteur du remix : anarres.
- Origine : Glitch.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/298682/tree-house-from-glitch
- Fichier local : `public/worlds/firefly-forest/tree-house.webp`.
- Transformation : conversion WebP, traitement nocturne, réduction, parallaxe et lumière ambiante à l’affichage.

### Alpine Landscape Mountain Flora 01h Al1

- Usage : masse végétale de premier plan, utilisée en miroir pour encadrer le tableau.
- Auteur : Glitch / Tiny Speck, conversion SVG par Bart.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/208754
- Fichier local : `public/worlds/firefly-forest/foliage.webp`.
- Transformation : conversion WebP, assombrissement, saturation contrôlée, miroir, rotation et parallaxe proche à l’affichage.

Les cinq fichiers WebP pèsent ensemble environ 226 Ko, contre environ 1,13 Mo pour les PNG téléchargés à l’origine.

## Bibliothèques validées pour les prochaines itérations

### Glitch — Groddle forest/meadow terrain

- Usage prévu : arbres, herbes, buissons, sols, pierres et détails de végétation.
- Environ 550 SVG.
- Licence : CC0.
- Source : https://opengameart.org/content/glitch-groddle-forestmeadow-terrain-svg

### Glitch — Alpine Landscape

- Usage prévu : montagnes, reliefs et rochers pour les plans lointains.
- Environ 187 SVG.
- Licence : CC0.
- Source : https://opengameart.org/content/glitch-alpine-landscape-svg

### Glitch — House exteriors

- Usage prévu : autres variantes de cottages, Hobbit Hole, maison-arbre et bâtiment champignon.
- Licence : CC0.
- Source : https://opengameart.org/content/house-exteriors-from-glitch

### Kenney — Foliage / Background Elements / Particle Pack

- Usage prévu : compléments végétaux et VFX si leur style reste cohérent après recoloration.
- Licence : CC0.
- Sources :
  - https://kenney.nl/assets/foliage-pack
  - https://kenney.nl/assets/background-elements
  - https://kenney.nl/assets/particle-pack

### Quaternius — ressources 3D CC0

Les packs Quaternius restent autorisés pour quelques objets réellement 3D, mais ne constituent plus la direction artistique principale de la Forêt des Lucioles.

- Stylized Nature MegaKit : https://quaternius.com/packs/stylizednaturemegakit.html
- Ultimate Stylized Nature : https://quaternius.com/packs/ultimatestylizednature.html
- Universal Base Characters : https://quaternius.com/packs/universalbasecharacters.html
- Universal Animation Library : https://quaternius.com/packs/universalanimationlibrary.html

## Dépendance de rendu

Three.js est distribué sous licence MIT. Le projet utilise la version déclarée dans `package.json`.

## Règle d’intégration future

Pour toute ressource externe, conserver dans ce document :

1. sa page source ;
2. son auteur ;
3. sa licence ;
4. son rôle dans la scène ;
5. les transformations appliquées ;
6. son chemin local dans le dépôt.

Une ressource dont la licence est absente, ambiguë ou non commerciale n’entre pas dans le projet. Une ressource graphique nécessaire à l’expérience utilisateur doit être embarquée localement plutôt que chargée à l’exécution depuis un tiers.
