# La Forêt des Lucioles — sources d’assets

## Principe

La scène charge uniquement des fichiers locaux sous `public/worlds/firefly-forest/`, tous déclarés dans `src/assets/registry/firefly-assets.json`. Aucun asset graphique distant n’est requis à l’exécution.

La passe « Proposition n°1 — cohérence maximale » utilise les illustrations originales externes. Une transformation indiquée comme **conversion** est strictement technique : rasterisation fidèle, rognage de transparence, redimensionnement, compression ou optimisation SVG. Aucun animal, personnage, arbre, pont ou élément de berge n’a été retracé ou réinterprété pour cette passe.

Licences de référence :

- Tiny Speck / Glitch : CC0, tel qu’indiqué sur les fiches OpenGameArt et dans les dépôts officiels [`glitch-locations`](https://github.com/tinyspeck/glitch-locations) et [`glitch-items`](https://github.com/tinyspeck/glitch-items) ;
- Openclipart : [CC0 1.0 / domaine public pour chaque dépôt](https://openclipart.org/share) ;
- GDQuest : CC0 sur la fiche OpenGameArt du pack ;
- Wooden Bridge : CC0 / domaine public sur la fiche OpenGameArt.

## Socle Glitch conservé

| Asset original | Auteur / projet | Source et licence | Fichier local | Rôle | Transformations techniques |
|---|---|---|---|---|---|
| Pleasant meadow scene | Tiny Speck / Glitch | [Openclipart](https://openclipart.org/detail/251204/pleasant-meadow-scene), CC0 | `meadow.webp` | Prairie de la clairière | Conversion WebP, rognage transparent, filtre CSS nocturne |
| Cottage from Glitch | Tiny Speck / Glitch | [Openclipart](https://openclipart.org/detail/311437/cottage-from-glitch), CC0 | `cottage.webp` | Maison principale du secteur Ouest | Conversion WebP, rognage transparent, filtre CSS nocturne |
| Rustic house from Glitch | Tiny Speck / Glitch | [Openclipart](https://openclipart.org/detail/299648/rustic-house-from-glitch), CC0 | `rustic-house.webp` | Maison lointaine du secteur Est | Conversion WebP, rognage transparent, filtre CSS nocturne |
| Tree House from Glitch | Tiny Speck / Glitch | [Openclipart](https://openclipart.org/detail/298682/tree-house-from-glitch), CC0 | `tree-house.webp` | Maison-arbre du secteur Est | Conversion WebP, rognage transparent, filtre CSS nocturne |
| Alpine Landscape Mountain Flora | Tiny Speck / Glitch | [Openclipart](https://openclipart.org/detail/208754), CC0 | `foliage.webp` | Masse végétale de premier plan | Conversion WebP, rognage transparent, miroir et filtre CSS selon l’instance |

## Reliefs Alpine

Les trois fichiers proviennent du pack [Glitch Alpine Landscape SVG](https://opengameart.org/content/glitch-alpine-landscape-svg), Tiny Speck, CC0.

| Asset original | Auteur / projet | Source et licence | Fichier local | Rôle | Transformations techniques |
|---|---|---|---|---|---|
| `cone_top_rock_01a_al1.svg` | Tiny Speck / Glitch | Pack Alpine ci-dessus, CC0 | `scenery/relief-peak-a.webp` | Relief Ouest | Rasterisation WebP transparente 1100 px, rognage, compression, filtre CSS bleu nuit |
| `cone_top_rock_01b_al1.svg` | Tiny Speck / Glitch | Pack Alpine ci-dessus, CC0 | `scenery/relief-peak-b.webp` | Relief central lointain | Rasterisation WebP transparente 1100 px, rognage, compression, filtre CSS bleu nuit |
| `cliffside_1b_al1.svg` | Tiny Speck / Glitch | Pack Alpine ci-dessus, CC0 | `scenery/relief-cliff.webp` | Falaise Est | Rasterisation WebP transparente 1100 px, rognage, compression, filtre CSS bleu nuit |

## Arbres et forêt Groddle

Tous les fichiers de cette section proviennent du pack [Glitch Groddle forest/meadow terrain SVG](https://opengameart.org/content/glitch-groddle-forestmeadow-terrain-svg), Tiny Speck, CC0.

| Asset original | Auteur / projet | Source et licence | Fichier local | Rôle | Transformations techniques |
|---|---|---|---|---|---|
| `pinecluster_1.svg` | Tiny Speck / Glitch | Pack Groddle ci-dessus, CC0 | `scenery/distant-pines.webp` | Massifs forestiers lointains | Rasterisation WebP transparente 1000 px, rognage, compression, miroir CSS possible |
| `tree_deciduous1.svg` | Tiny Speck / Glitch | Pack Groddle ci-dessus, CC0 | `scenery/tree-deciduous-1.webp` | Arbre feuillu dense | Rasterisation WebP transparente 1200 px, rognage, compression, filtre CSS nocturne |
| `tree_deciduous2.svg` | Tiny Speck / Glitch | Pack Groddle ci-dessus, CC0 | `scenery/tree-deciduous-2.webp` | Grand arbre à couronne ronde | Rasterisation WebP transparente 1200 px, rognage, compression, miroir CSS possible |
| `tree_deciduous3.svg` | Tiny Speck / Glitch | Pack Groddle ci-dessus, CC0 | `scenery/tree-deciduous-3.webp` | Arbre élancé et arbre de la clairière | Rasterisation WebP transparente 1200 px, rognage, compression, miroir CSS possible |
| `tree_coniferous_1.svg` | Tiny Speck / Glitch | Pack Groddle ci-dessus, CC0 | `scenery/tree-coniferous-1.webp` | Sapin fin | Rasterisation WebP transparente 1200 px, rognage, compression, filtre CSS nocturne |
| `tree_coniferous_3.svg` | Tiny Speck / Glitch | Pack Groddle ci-dessus, CC0 | `scenery/tree-coniferous-3.webp` | Sapin fourni | Rasterisation WebP transparente 1200 px, rognage, compression, filtre CSS nocturne |

## Végétation, terrain et eau Groddle

Tous les fichiers de cette section proviennent également du [pack Groddle](https://opengameart.org/content/glitch-groddle-forestmeadow-terrain-svg), Tiny Speck, CC0.

| Asset original | Auteur / projet | Source et licence | Fichier local | Rôle | Transformations techniques |
|---|---|---|---|---|---|
| `bush_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/bush-round.webp` | Buissons Ouest et premier plan | Rasterisation WebP transparente 700 px, rognage, compression |
| `bush_2.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/bush-low.webp` | Buissons bas de clairière et de rive | Rasterisation WebP transparente 700 px, rognage, compression, miroir CSS possible |
| `groddle_fern_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/fern.webp` | Fougères de rive et premier plan | Rasterisation WebP transparente 700 px, rognage, compression, miroir CSS possible |
| `flower_bush_5.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/flower-bush.webp` | Buissons fleuris Ouest et Est | Rasterisation WebP transparente 700 px, rognage, compression |
| `wildflowers_bunch_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/wildflowers.webp` | Fleurs basses Ouest et clairière | Rasterisation WebP transparente 700 px, rognage, compression |
| `mushroom_amanita_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/mushroom-amanita.webp` | Champignon près du cottage | Rasterisation WebP transparente 600 px, rognage, compression |
| `mushroom_aqua_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/mushroom-aqua.webp` | Champignons Ouest et clairière | Rasterisation WebP transparente 600 px, rognage, compression |
| `pampas_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `vegetation/reeds.webp` | Roseaux et herbes de berge | Rasterisation WebP transparente 700 px, rognage, compression, miroir CSS possible |
| `alakol_water_rock_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/water-rock-a.webp` | Grand rocher dans le ruisseau | Rasterisation WebP transparente 700 px, rognage, compression |
| `alakol_water_rock_2.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/water-rock-b.webp` | Petit rocher dans le ruisseau | Rasterisation WebP transparente 700 px, rognage, compression |
| `evenground_patch_1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/ground-patch-a.webp` | Irrégularités du sol et masque de rive | Rasterisation WebP transparente 800 px, rognage, compression, miroir CSS possible |
| `evenground_patch_3.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/ground-patch-b.webp` | Irrégularités du sol et masque de rive | Rasterisation WebP transparente 800 px, rognage, compression, miroir CSS possible |
| `penaltybox_water_reflection.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/water-reflection.svg` | Ruban continu et bords ondulés du ruisseau | SVG original inchangé ; deux instances pivotées en CSS, filtre nocturne modéré |
| `wave1.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/wave-1.webp` | Reflet supérieur du ruisseau | Rasterisation WebP transparente 600 px, suppression d’espace vide, compression |
| `wave2.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/wave-2.webp` | Reflet médian du ruisseau | Rasterisation WebP transparente 600 px, suppression d’espace vide, compression |
| `wave3.svg` | Tiny Speck / Glitch | Pack Groddle, CC0 | `terrain/wave-3.webp` | Reflet inférieur du ruisseau | Rasterisation WebP transparente 600 px, suppression d’espace vide, compression |

Le lit du ruisseau est formé par deux instances jointives du véritable reflet d’eau Glitch, dont les bords ondulés encadrent un ruban continu. Les plaques de terrain, vaguelettes, rochers et roseaux Glitch masquent sa jonction avec le sol. Aucun champ d’eau dessiné localement ni aucune rivière SVG maison n’est conservé.

## Pont

| Asset original | Auteur / projet | Source et licence | Fichier local | Rôle | Transformations techniques |
|---|---|---|---|---|---|
| Wooden Bridge (`bridge_wood.svg`) | Nicu Buculei / nicubunu | [OpenGameArt — Wooden Bridge](https://opengameart.org/content/wooden-bridge), CC0 / domaine public | `scenery/bridge-wood-original.svg` | Franchissement du ruisseau Est | SVG original complet, optimisation SVGO multipasse uniquement ; rotation, taille et filtre nocturne en CSS |

## Faune et personnage

| Asset original | Auteur / projet | Source et licence | Fichier local | Rôle | Transformations techniques |
|---|---|---|---|---|---|
| `npc_fox_fox_orangeFox_x1_still_png_1354839586.png` | Tiny Speck / Glitch | [Glitch Sprite Assets (huge collection)](https://opengameart.org/content/glitch-sprite-assets-huge-collection), CC0 | `wildlife/fox-glitch.png` | Renard du sous-bois Ouest | Extraction de la frame statique officielle uniquement ; PNG original 153×139 inchangé |
| Cartoon owl | lemmling | [Openclipart — Cartoon owl](https://openclipart.org/detail/17566/cartoon-owl), CC0 / domaine public | `wildlife/owl-openclipart.svg` | Hibou perché dans l’arbre central | Optimisation SVGO multipasse ; taille et filtre nocturne en CSS |
| Badger | AreYouPrepared, style Lemmling | [Openclipart — Badger](https://openclipart.org/detail/353940/badger), CC0 / domaine public | `wildlife/badger-openclipart.svg` | Blaireau discret près du ruisseau | Optimisation SVGO multipasse ; taille et filtre nocturne en CSS |
| Dan | GDQuest | [Cute painterly characters and forest](https://opengameart.org/content/cute-painterly-characters-and-forest), CC0 | `wildlife/rabbit-gdquest.webp` | Lapin dans les herbes de la clairière | Rognage de transparence, réduction à 420 px et conversion WebP ; illustration inchangée |
| Fawn | freedo, d’après David Stanley avec autorisation | [Openclipart — Fawn](https://openclipart.org/detail/3412/fawn), CC0 / domaine public | `wildlife/fawn-openclipart.svg` | Faon lointain du secteur Est | Optimisation SVGO multipasse ; taille et filtre nocturne en CSS |
| bat | Orlando Karam | [Openclipart — bat](https://openclipart.org/detail/61165/bat), CC0 / domaine public | `wildlife/bat-openclipart.svg` | Trois petites chauves-souris dans le ciel Est | Optimisation SVGO multipasse ; répétition, tailles et rotations en CSS |
| Small Hedgehog | Magnesus | [Openclipart — Small Hedgehog](https://openclipart.org/detail/170650/small-hedgehog), CC0 / domaine public | `wildlife/hedgehog-openclipart.svg` | Hérisson près du cottage | Optimisation SVGO multipasse ; taille et filtre nocturne en CSS |
| Little Girl In Pajamas | GDJ, source Pixabay indiquée par l’auteur | [Openclipart — Little Girl In Pajamas](https://openclipart.org/detail/263173/little-girl-in-pajamas), CC0 / domaine public | `characters/girl-pajamas-openclipart.svg` | Enfant debout au sol dans la clairière de Luma | Optimisation SVGO multipasse ; taille, lumière et filtre nocturne en CSS |

Le pack GDQuest a été inspecté visuellement avant sélection : ses trois personnages sont Dan le lapin, Jaguar et Peggy le cochon. Il ne contient pas de fillette humaine. Dan a donc été retenu pour le lapin, tandis que la fillette provient réellement d’Openclipart ; aucun personnage local n’a été créé pour combler ce manque.

## Règles d’intégration

- les fichiers WebP sont dimensionnés pour leur taille d’affichage maximale avec marge pour les écrans Retina, sans embarquer les archives de 185 Mo ;
- les éléments hors écran et secondaires utilisent `loading="lazy"` ;
- les variations viennent exclusivement de la taille, du placement, du miroir, de l’opacité et de filtres nocturnes CSS modérés ;
- les animaux restent discrets au repos et se révèlent pendant une seule micro-scène à la fois ;
- Luma, la lune, les étoiles et les lucioles restent les seuls éléments construits par Three.js.
