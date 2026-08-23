# La Forêt des Lucioles — sources d’assets

## Principe

La Forêt utilise uniquement des ressources gratuites dont la licence autorise leur réutilisation. Les fichiers nécessaires au rendu sont embarqués sous `public/worlds/firefly-forest/` et référencés par `src/assets/registry/firefly-assets.json`. Aucun asset graphique distant n’est requis à l’exécution.

Le panorama privilégie une famille graphique inspirée des assets **Glitch / Tiny Speck**, libérés dans le domaine public / CC0. Three.js reste limité à Luma, la lune, les étoiles et les lucioles.

## Assets Glitch déjà présents

- Pleasant meadow scene : https://openclipart.org/detail/251204/pleasant-meadow-scene — CC0 — `meadow.webp`.
- Cottage from Glitch : https://openclipart.org/detail/311437/cottage-from-glitch — CC0 — `cottage.webp`.
- Rustic house from Glitch : https://openclipart.org/detail/299648/rustic-house-from-glitch — CC0 — `rustic-house.webp`.
- Tree House from Glitch : https://openclipart.org/detail/298682/tree-house-from-glitch — CC0 — `tree-house.webp`.
- Alpine Landscape Mountain Flora : https://openclipart.org/detail/208754 — CC0 — `foliage.webp`.

## Passe d’illustration 2026-08-23

Les captures iPad ont montré que les arbres construits avec un tronc CSS et un même feuillage répété, les animaux très « emoji » et la rivière en `clip-path` nuisaient à la cohérence. La passe suivante remplace ces constructions par des illustrations vectorielles complètes et locales.

### Références de végétation

- Glitch Groddle forest/meadow terrain : https://opengameart.org/content/glitch-groddle-forestmeadow-terrain-svg — Tiny Speck — CC0.
- Glitch Alpine Landscape : https://opengameart.org/content/glitch-alpine-landscape-svg — Tiny Speck — CC0.
- Glitch Locations : https://github.com/tinyspeck/glitch-locations — Tiny Speck — domaine public.

Les arbres locaux `scenery/tree-*.svg` sont des compositions optimisées pour le panorama, redessinées dans la palette nocturne de la Forêt à partir de ce langage graphique. Cinq silhouettes complètes sont disponibles : chêne, sapin, bouleau, saule et arbre feuillu étalé.

### Eau et pont

- Wooden Bridge, Nicu Buculei : https://opengameart.org/content/wooden-bridge — domaine public / CC0.
- Miroir SVG consulté : `cavefish01/GlitchGarden/Downloaded Glitch Content/a/bridge_wood.svg`.
- Glitch Background / Locations sert de référence pour le principe de rive et de terrain continu.

`scenery/bridge-wood.svg` est une adaptation simplifiée du principe du pont PD, recolorée pour la nuit. `scenery/river-bank.svg` est une composition locale avec vraie rive, eau courbe, pierres, roseaux et reflets. Les anciens pont et rivière polygonaux CSS ne doivent plus être réintroduits.

### Faune

Références publiques consultées dans Openclipart :

- Red Fox : miroir `cyanidecupcake/openclipart-svg/svg/unsorted/red-fox.svg` — domaine public.
- Cartoon Owl, Lemmling : `svg/unsorted/lemmling_Cartoon_owl.svg` — domaine public.
- Badger : `svg/unsorted/Badger.svg` — domaine public.
- autres silhouettes de lapins / animaux du catalogue Openclipart — domaine public.

Les fichiers locaux `wildlife/fox.svg`, `owl.svg`, `badger.svg`, `rabbit.svg` et `deer.svg` sont des réinterprétations simplifiées en 3/4 ou profil. Leur saturation et leur contraste sont volontairement réduits pour appartenir au décor nocturne.

### Petite fille

Références de direction artistique et de pose :

- Cute painterly characters and forest, GDQuest : https://opengameart.org/content/cute-painterly-characters-and-forest — CC0.
- Cute Girl — Free Sprites : https://opengameart.org/content/cute-girl-free-sprites — CC0.
- Little Girl In Pajamas : https://openclipart.org/detail/263173/little-girl-in-pajamas — domaine public.

`wildlife/girl-pajamas.svg` est un personnage local dédié au projet : pyjama violet, doudou, proportions d’album jeunesse et palette nocturne.

## Règles de composition

- pas de stickers ou emoji bruts dans le panorama ;
- pas de rivière, pont, montagne ou gros relief dessiné au `clip-path` CSS ;
- les animaux secondaires restent discrets au repos et se révèlent surtout pendant les micro-scènes ;
- le hibou doit être perché, le blaireau sur une rive, le lapin dans les herbes et le faon en plan lointain ;
- la clairière centrale reste plus ouverte que les secteurs Ouest et Est ;
- toute nouvelle source externe doit conserver auteur/projet, URL, licence, rôle et chemin local.
