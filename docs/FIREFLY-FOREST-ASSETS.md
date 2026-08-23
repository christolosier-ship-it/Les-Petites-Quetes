# La Forêt des Lucioles — sources d’assets

## Règle du monde 1

La Forêt des Lucioles n’utilise que des ressources gratuites dont la licence autorise explicitement leur usage dans le projet. Aucun asset payant ne doit être ajouté au dépôt.

Le rendu est hybride : les grands plans illustrés 2D composent le panorama, tandis que Three.js reste responsable de Luma, de la lune, des étoiles et des lucioles.

## Règle local-first

Les assets graphiques nécessaires à la scène sont embarqués dans `public/worlds/firefly-forest/` et référencés par `src/assets/registry/firefly-assets.json`. L’application ne dépend d’aucun serveur d’images externe pour afficher la Forêt.

## Assets Glitch / Openclipart CC0 déjà utilisés

### Pleasant meadow scene
- Usage : prairie principale et matière du terrain.
- Origine : artworks Glitch / Tiny Speck, remix anarres.
- Licence : domaine public / CC0.
- Source : https://openclipart.org/detail/251204/pleasant-meadow-scene
- Local : `public/worlds/firefly-forest/meadow.webp`.

### Cottage from Glitch
- Usage : cottage principal.
- Origine : Glitch / Tiny Speck, remix anarres.
- Licence : domaine public / CC0.
- Source : https://openclipart.org/detail/311437/cottage-from-glitch
- Local : `public/worlds/firefly-forest/cottage.webp`.

### Rustic house from Glitch
- Usage : maison secondaire et mini-villages.
- Licence : domaine public / CC0.
- Source : https://openclipart.org/detail/299648/rustic-house-from-glitch
- Local : `public/worlds/firefly-forest/rustic-house.webp`.

### Tree House from Glitch
- Usage : habitation féerique du secteur Est.
- Licence : domaine public / CC0.
- Source : https://openclipart.org/detail/298682/tree-house-from-glitch
- Local : `public/worlds/firefly-forest/tree-house.webp`.

### Alpine Landscape Mountain Flora 01h Al1
- Usage : feuillage et canopées réutilisés pour composer les plans forestiers.
- Origine : Glitch / Tiny Speck, conversion SVG Bart.
- Licence : domaine public / CC0.
- Source : https://openclipart.org/detail/208754
- Local : `public/worlds/firefly-forest/foliage.webp`.

## Bestiaire nocturne local

Le bestiaire ajouté au panorama est une série de SVG légers dessinés pour Les Petites Quêtes. La famille graphique s’appuie sur les proportions rondes et lisibles observées dans les ressources libres suivantes :

### Noto Emoji
- Projet : https://github.com/googlefonts/noto-emoji
- Licence des ressources image : Apache 2.0.
- Licence SVG : https://github.com/googlefonts/noto-emoji/blob/main/svg/LICENSE
- Références consultées : renard U+1F98A, hibou U+1F989, blaireau U+1F9A1, lapin U+1F407, cerf U+1F98C, chauve-souris U+1F987, hérisson U+1F994.

### Openclipart / FreeSVG
- Hibou Lemmling : https://openclipart.org/detail/17566/cartoon-owl
- Petite fille en pyjama : https://openclipart.org/detail/263173/little-girl-in-pajamas
- Licence : domaine public / CC0 pour les références utilisées.

### Fichiers locaux
- `wildlife/fox.svg`
- `wildlife/owl.svg`
- `wildlife/badger.svg`
- `wildlife/rabbit.svg`
- `wildlife/deer.svg`
- `wildlife/bat.svg`
- `wildlife/hedgehog.svg`
- `wildlife/girl-pajamas.svg`

Ces SVG sont des adaptations simplifiées créées spécifiquement pour la palette et la lisibilité nocturnes du panorama. Ils sont volontairement petits, sans dépendance réseau et animés par CSS/React plutôt que par de lourds spritesheets.

## Bibliothèques validées pour les prochaines itérations

### Glitch — Groddle forest/meadow terrain
- Usage : arbres, herbes, buissons, sols, pierres et détails de végétation.
- Environ 550 SVG.
- Licence : CC0.
- Source : https://opengameart.org/content/glitch-groddle-forestmeadow-terrain-svg

### Glitch — Alpine Landscape
- Usage : montagnes, reliefs et rochers pour les plans lointains.
- Environ 187 SVG.
- Licence : CC0.
- Source : https://opengameart.org/content/glitch-alpine-landscape-svg

### Kenney — Foliage / Background Elements / Particle Pack
- Usage : compléments végétaux et VFX si leur style reste cohérent après recoloration.
- Licence : CC0.
- Sources :
  - https://kenney.nl/assets/foliage-pack
  - https://kenney.nl/assets/background-elements
  - https://kenney.nl/assets/particle-pack

## Règle d’intégration future

Pour toute ressource externe, conserver sa page source, son auteur/projet, sa licence, son rôle dans la scène, les transformations appliquées et son chemin local. Une ressource dont la licence est absente ou ambiguë n’entre pas dans le projet.
