# Village des Lutins - assets Habbo

Le Village des Lutins utilise exclusivement des rendus d'assets Habbo / Sulake pour les éléments visibles du tableau. Les fichiers sont stockés dans `public/worlds/gnome-village/` et les identifiants sources sont conservés dans les manifests.

## Règle graphique du tableau

La scène elle-même est **Habbo-only** : sols, murs, portes, fenêtres, mobilier, nourriture, végétation, jeux et personnages proviennent tous de sprites Habbo/Sulake rendus en PNG.

Le CSS du tableau ne sert qu'à positionner, superposer, révéler ou déplacer ces vrais sprites. Il ne doit pas dessiner de décor ou d'accessoire. Sont donc interdits dans la scène : chapeaux CSS/SVG, bulles dessinées localement, chemins en gradients, auvents, panneaux géométriques, marelles CSS, faisceaux de projecteur, vapeur artificielle, faux murs ou faux conteneurs décoratifs.

Les contrôles de navigation de l'application, situés au-dessus du tableau, restent des éléments d'interface et ne font pas partie du décor Habbo.

## Lot 1 : structure historique

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

## Passe Habbo-only école

Cette passe ajoute des pièces scolaires directement issues des gammes `school` et `school_c22`, afin de rapprocher la composition des véritables rooms Habbo consacrées à l'école.

| Fichier | Identifiant source Habbo |
| --- | --- |
| `structure/floor-school.png` | `school_floor` |
| `structure/wall-school.png` | `school_wall` |
| `structure/wall-academic.png` | `school_c22_wall` |
| `courtyard/school-bus.png` | `school_bus` |
| `classroom/desk-red.png` | `school_console` |
| `classroom/chair-red.png` | `school_chair` |
| `classroom/chem-set.png` | `school_stuff_02` |
| `classroom/science-equipment.png` | `school_c22_stuff_02` |
| `classroom/coatrack-green.png` | `school_coatrack_g` |
| `classroom/coatrack-blue.png` | `school_coatrack_b` |
| `classroom/coatrack-red.png` | `school_coatrack_r` |
| `classroom/locker-blue.png` | `school_locker_b_nosale` |
| `classroom/locker-red.png` | `school_locker_r_nosale` |
| `cafeteria/school-table.png` | `school_table` |
| `cafeteria/school-bench.png` | `school_bench` |
| `cafeteria/burger.png` | `school_stuff_03` |
| `cafeteria/meatballs.png` | `school_stuff_04` |
| `cafeteria/nuggets.png` | `school_stuff_05` |
| `cafeteria/vegetables.png` | `school_stuff_06` |
| `cafeteria/academic-table.png` | `school_c22_table` |
| `cafeteria/academic-bench.png` | `school_c22_bench` |
| `cafeteria/red-tray.png` | `school_c22_stuff_05` |
| `courtyard/sports-equipment.png` | `school_c22_equipment` |
| `courtyard/gym-bag.png` | `school_c22_duffelbag` |

Les dimensions et poids exacts de cette passe sont consignés dans `public/worlds/gnome-village/manifest-habbo-only-school.json`.

## Personnages et vie de l'école

Les personnages sont des rendus du système d'avatars Habbo produits avec `xabbo nx`. Les poses natives (`sit`, `wave`, `walk`, `drink`, `speak`, `stand`) servent à composer les micro-scènes. Aucun chapeau ou élément graphique n'est ajouté par-dessus les avatars.

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

La composition suit les codes observés dans des rooms Habbo d'école : grandes surfaces isométriques en dalles, murs constitués de vrais éléments Habbo, rangées de pupitres, bibliothèque et casiers dans la classe, longues tables et bancs devant un comptoir de service à la cantine, puis façade d'école, bus, clôtures, arbres, bancs et équipements de jeu dans la cour.

La classe reste la zone dominante au centre. Les animations ne créent aucun nouveau graphisme : elles déplacent ou font osciller les sprites Habbo existants. La progression révèle progressivement mobilier, personnages et accessoires.

Le tableau conserve le bouton DEV de déblocage complet et le mode grand écran navigable. `prefers-reduced-motion` coupe les déplacements décoratifs.

## Extraction et droits

Extraction réalisée avec `xabbo nx 0.3.0` à partir du furnidata US. Les SWF et fichiers intermédiaires ne sont pas conservés dans le dépôt. `structure/manifest.json`, `manifest-lots-2-4.json` et `manifest-habbo-only-school.json` conservent la traçabilité des rendus.

Ces ressources ne sont pas des assets libres. Leur présence dans le projet ne concède aucun droit de réutilisation. Leur usage dans Les Petites Quêtes relève de l'autorisation Sulake indiquée par le propriétaire du projet pour son cadre privé et non commercial.
