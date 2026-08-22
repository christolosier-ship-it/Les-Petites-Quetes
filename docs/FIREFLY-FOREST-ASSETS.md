# La Forêt des Lucioles — sources d’assets

## Règle du monde 1

La Forêt des Lucioles n’utilise que des ressources gratuites dont la licence autorise explicitement leur usage dans le projet. Aucun asset payant ne doit être ajouté au dépôt.

Le rendu est désormais hybride : Three.js reste responsable des acteurs, lumières, particules et éléments interactifs, tandis que plusieurs plans illustrés 2D enrichissent le diorama et lui donnent une direction plus proche d’un album jeunesse.

## Assets CC0 effectivement utilisés dans le diorama illustré

Les ressources ci-dessous proviennent de l’univers graphique de **Glitch**, dont les assets ont été donnés au domaine public. Les versions utilisées ici sont servies par Openclipart et chargées uniquement lorsque la Forêt des Lucioles est ouverte. Le service worker les met ensuite en cache au runtime pour les visites suivantes.

### Pleasant meadow scene

- Usage : grand plan de prairie illustrée servant de matière de fond.
- Auteur du remix : anarres.
- Origine : artworks Glitch / Tiny Speck.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/251204/pleasant-meadow-scene
- Ressource chargée : https://openclipart.org/image/800px/251204
- Transformation : assombrissement nocturne, désaturation partielle, teinte bleue, contraste et parallaxe.

### Cottage from Glitch

- Usage : cottage principal au premier plan à partir du stade 1.
- Auteur du remix : anarres.
- Origine : Glitch.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/311437/cottage-from-glitch
- Ressource chargée : https://openclipart.org/image/800px/311437
- Transformation : colorimétrie nocturne, halo chaud, ombre portée et parallaxe.

### Rustic house from Glitch

- Usage : maison secondaire lointaine à partir du stade 2.
- Auteur du remix : anarres.
- Origine : Glitch.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/299648/rustic-house-from-glitch
- Ressource chargée : https://openclipart.org/image/800px/299648
- Transformation : réduction, traitement atmosphérique et halo chaud.

### Tree House from Glitch

- Usage : habitation féerique supplémentaire au stade 3.
- Auteur du remix : anarres.
- Origine : Glitch.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/298682/tree-house-from-glitch
- Ressource chargée : https://openclipart.org/image/800px/298682
- Transformation : traitement nocturne, réduction, parallaxe et lumière ambiante.

### Alpine Landscape Mountain Flora 01h Al1

- Usage : masse végétale de premier plan, utilisée en miroir pour encadrer le tableau.
- Auteur : Glitch / Tiny Speck, conversion SVG par Bart.
- Licence : domaine public / CC0.
- Page source : https://openclipart.org/detail/208754
- Ressource chargée : https://openclipart.org/image/800px/208754
- Transformation : assombrissement, saturation contrôlée, miroir, rotation et parallaxe proche.

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
6. si elle est embarquée localement ou chargée à la demande.

Une ressource dont la licence est absente, ambiguë ou non commerciale n’entre pas dans le projet.
