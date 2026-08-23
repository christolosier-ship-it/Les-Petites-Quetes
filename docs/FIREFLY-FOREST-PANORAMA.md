# Forêt des Lucioles — modèle de panorama

## Référence de composition

Le panorama suit le principe des **HD multi-layer Parallax Background Samples of Glitch Game Assets** publiés sur OpenGameArt par Tiny Speck / jakegamer :

- source : https://opengameart.org/content/hd-multi-layer-parallex-background-samples-of-glitch-game-assets
- licence : CC0 / domaine public ;
- modèle : quelques grands plans cohérents plutôt qu’une collection d’objets isolés ;
- principe retenu : déplacer les plans à des vitesses différentes pour créer la profondeur.

Le projet ne redistribue pas les archives complètes. Il extrait uniquement les illustrations effectivement rendues, les convertit si nécessaire et reprend la logique de composition multi-layer.

## Architecture du panorama Firefly

Le plein écran est une scène horizontale d’environ trois écrans de large, scrollable au doigt de gauche à droite.

Les couches sont, de l’arrière vers l’avant :

1. ciel nocturne bleu / violet / turquoise ;
2. reliefs Alpine Glitch et villages ;
3. massifs de pins et arbres Groddle lointains ;
4. ligne de forêt, plaques de terrain et arbres Groddle ;
5. clairière centrale illustrée ;
6. arbres proches et landmarks : cottage, rivière officielle `river_1`, pont original, maison-arbre ;
7. véritable personnage externe et faune libre ;
8. fougères, buissons, roseaux et feuillages Glitch de premier plan ;
9. Three.js au-dessus pour la lune, les étoiles, Luma et les lucioles.

Le scroll natif déplace le panorama. Les plans lointains reçoivent une légère compensation afin de défiler moins vite que les plans proches.

## Trois secteurs narratifs

- **Ouest — la maison qui veille** : cottage, chemin visuel dégagé, végétation dense, fleurs, champignons, hérisson et renard.
- **Centre — la clairière de Luma** : zone plus ouverte, fillette, grand arbre Groddle, hibou perché, lapin, fleurs basses et lucioles.
- **Est — le ruisseau des secrets** : cours d’eau étroit et sinueux, pont original, berges Glitch, rochers, roseaux, blaireau, faon, chauves-souris, maison-arbre et village lointain.

La clairière centrale reste volontairement plus respirante que les deux extrémités du panorama.

## Tableau vivant

La faune n’est pas animée en permanence. Lorsque le panorama est ouvert en grand écran, un ordonnanceur déclenche une micro-scène espacée, environ toutes les 8 à 26 secondes.

Moments possibles selon le stade :

- renard qui s’avance puis revient ;
- hibou qui observe ;
- blaireau qui renifle ;
- lapin qui bondit ;
- faon qui se met à l’écoute ;
- passage de chauves-souris ;
- petite fille qui regarde vers le ciel ;
- petite fille qui s’accroupit près du sol ;
- rare trait lumineux dans le ciel.

Une seule activité forte est jouée à la fois. En mode compact ou avec `prefers-reduced-motion`, la scène reste statique.

## Ciel

Le ciel Three.js utilise quatre familles d’étoiles volontairement hiérarchisées :

- petites étoiles ivoire majoritaires et discrètes ;
- étoiles menthe intermédiaires moins nombreuses ;
- rares étoiles lavande plus visibles ;
- six grandes étoiles dorées au maximum au stade final.

Au stade final, le ciel contient environ 262 points répartis sur plusieurs profondeurs au lieu d’un tapis uniforme de plus de 400 points. Les quatre couches scintillent avec des rythmes distincts. Les lucioles culminent à 58 individus, majoritairement petites grâce à leur taille réduite et à l’atténuation par profondeur ; seules les plus proches deviennent franchement lumineuses.

## Direction artistique

La Forêt des Lucioles est une **nuit colorée, visible et féerique**, jamais un décor noir :

- ciel bleu nuit lumineux ;
- reliefs bleu-violet ;
- végétation vert émeraude / turquoise ;
- fenêtres et lanternes dorées ;
- accents lavande, rose et menthe ;
- contraste par profondeur atmosphérique plutôt que par grands voiles flous.

Les premiers plans restent nets. Les effets flous sont limités aux halos lumineux et à l’atmosphère du ciel.

La hiérarchie lumineuse est : lune et Luma, puis fenêtres des maisons, puis quelques lucioles proches. Un halo DOM discret sous Luma relie visuellement la fillette, le sol et les végétations de la clairière sans modifier le personnage Three.js original.

## Performance

- les SVG Tiny Speck complexes sont rasterisés fidèlement en WebP transparents à 700–1200 px selon leur rôle ;
- les petits SVG externes restent vectoriels après optimisation multipasse ;
- une seule frame PNG officielle est extraite pour le renard Glitch, sans embarquer la spritesheet ou les archives sources ;
- les images secondaires et hors écran sont chargées paresseusement ;
- le pixel ratio Three.js reste plafonné et le composant lourd conserve son chargement différé existant.
