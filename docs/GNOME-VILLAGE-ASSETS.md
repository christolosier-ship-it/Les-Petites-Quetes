# Village des Lutins - assets Habbo

Le Village des Lutins utilise des rendus extraits d'assets Habbo / Sulake afin de construire une scène isométrique horizontale cohérente. Les fichiers sont stockés dans `public/worlds/gnome-village/` et les identifiants sources sont conservés dans les manifests.

## Lot 1 : structure

| Fichier | Identifiant source Habbo |
| --- | --- |
| `structure/floor-classroom.png` | `uni_c23_floor` |
| `structure/floor-courtyard.png` | `bohogarden_c21_floor` |
| `structure/wall-classroom.png` | `modern_c17_wall` |
| `structure/wall-cabin.png` | `xmas11_wall` |
| `structure/corner-street.png` | `es_fnc_crnr` |
| `structure/corner-railing.png` | `vwave_c21_railcrnr` |
| `structure/door-classroom.png` | `xmas12_door` |
| `structure/window-square.png` | `window_square` |
| `structure/bench-cafeteria.png` | `school_bench` |
| `structure/fence-urban.png` | `urban_fence` |
| `structure/fence-garden.png` | `garden_rosefence` |

## Lot 2 : classe

La classe est la zone principale du panorama. Elle reçoit les éléments demandés `chair`, `desk`, `bookshelf`, `bookcase`, `projector`, `laptop` et `alarm`, complétés par des éléments scolaires afin d'éviter une pièce vide et répétitive.

| Fichier | Identifiant source Habbo |
| --- | --- |
| `classroom/chair-green.png` | `school_chair_g` |
| `classroom/chair-blue.png` | `school_chair_b` |
| `classroom/desk-green.png` | `school_console_g` |
| `classroom/desk-blue.png` | `school_console_b` |
| `classroom/teacher-desk.png` | `school_c22_teachertable` |
| `classroom/bookshelf.png` | `uni_bookshelf` |
| `classroom/bookcase.png` | `classic9_bookshelf` |
| `classroom/projector.png` | `uni_projector` |
| `classroom/laptop.png` | `computer_laptop` |
| `classroom/alarm.png` | `uni_alarm` |
| `classroom/chalkboard.png` | `school_chalkboard2` |
| `classroom/books.png` | `school_stuff_01` |
| `classroom/charts.png` | `school_charts` |
| `classroom/locker.png` | `school_locker_g_notele` |

## Lot 3 : cantine

| Fichier | Identifiant source Habbo |
| --- | --- |
| `cafeteria/table.png` | `table_armas` |
| `cafeteria/chair.png` | `ktchn_c15_chair_g` |
| `cafeteria/fridge.png` | `uni_fridge` |
| `cafeteria/snacks.png` | `uni_snacks` |
| `cafeteria/pizza.png` | `uni_pizza` |
| `cafeteria/counter.png` | `school_c22_cafe` |
| `cafeteria/lunch-cart.png` | `school_cafe` |

## Lot 4 : cour

La cour combine bancs, végétation, clôtures et jeux. `sb_ramp` apporte une vraie rampe de jeu de la gamme skatepark. `wf_slider` est conservé comme petit élément de glissade, tandis que la balançoire fournit le jeu vertical principal.

| Fichier | Identifiant source Habbo |
| --- | --- |
| `courtyard/bench.png` | `autumn_c20_bench` |
| `courtyard/tree.png` | `anc_comfy_tree` |
| `courtyard/garden-pot.png` | `garden_bigpot` |
| `courtyard/garden-pond.png` | `garden_pond` |
| `courtyard/park-bench.png` | `es_bench` |
| `courtyard/fence-wood.png` | `bohogarden_c21_woodenwall` |
| `courtyard/play-ramp.png` | `sb_ramp` |
| `courtyard/swing.png` | `pcnc_swing` |
| `courtyard/slide.png` | `wf_slider` |
| `courtyard/garden-frog.png` | `garden_c23_frog` |

## Lutins et vie de l'école

Les personnages sont des rendus du système d'avatars Habbo produits avec `xabbo nx`. Deux figures sont rendues dans plusieurs actions natives (`sit`, `wave`, `walk`, `drink`, `speak`, `stand`) afin de créer de vraies micro-scènes plutôt que des silhouettes locales dessinées pour le projet.

| Fichier | Pose utilisée |
| --- | --- |
| `actors/student-write.png` | assis |
| `actors/student-hand.png` | lève la main |
| `actors/student-chat.png` | parle |
| `actors/student-walk.png` | marche |
| `actors/teacher.png` | debout |
| `actors/canteen-drink.png` | boit |
| `actors/courtyard-run.png` | marche, animé en traversée de cour |
| `actors/courtyard-wave.png` | fait signe |

## Mise en scène

Le panorama est conçu comme un seul campus continu et non comme trois cartes juxtaposées : cour à gauche, classe dominante au centre, cantine à droite. Des passages couverts et un chemin commun relient les trois zones. La progression du monde révèle progressivement mobilier, personnages et micro-animations. Au dernier stage, la classe devient très active : élève qui écrit, main levée, discussions, circulation entre les rangées, livres qui bougent et projecteur allumé. La cour ajoute jeux et déplacements, tandis que la cantine anime repas, vapeur et circulation.

Le tableau conserve le bouton DEV de déblocage complet et utilise le même mécanisme de grand écran navigable que la Forêt des Lucioles. Le mode `prefers-reduced-motion` coupe les déplacements décoratifs.

## Extraction et droits

Extraction réalisée avec `xabbo nx 0.3.0` à partir du furnidata US. Les SWF et fichiers intermédiaires ne sont pas conservés dans le dépôt. `structure/manifest.json` décrit le lot 1 et `manifest-lots-2-4.json` décrit les lots suivants et les acteurs.

Ces ressources ne sont pas des assets libres. Leur présence dans le projet ne concède aucun droit de réutilisation. Leur usage dans Les Petites Quêtes relève de l'autorisation Sulake indiquée par le propriétaire du projet pour son cadre privé et non commercial.
