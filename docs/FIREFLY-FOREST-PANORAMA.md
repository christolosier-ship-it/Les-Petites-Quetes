# Forêt des Lucioles — modèle de panorama

## Référence de composition

Le panorama suit le principe des **HD multi-layer Parallax Background Samples of Glitch Game Assets** publiés sur OpenGameArt par Tiny Speck / jakegamer :

- source : https://opengameart.org/content/hd-multi-layer-parallex-background-samples-of-glitch-game-assets
- licence : CC0 / domaine public ;
- modèle observé : 4 à 8 grands plans PNG par scène, certains décors originaux atteignant environ 6000 × 1000 px ;
- principe retenu : déplacer des plans complets à des vitesses différentes plutôt que positionner chaque objet comme une vignette indépendante.

Le projet ne redistribue pas le ZIP de référence. Il utilise ses assets Glitch CC0 déjà rapatriés localement et reprend la logique de composition multi-layer.

## Architecture du panorama Firefly

Le plein écran devient une scène horizontale d’environ trois écrans de large, scrollable au doigt de gauche à droite.

Les couches sont, de l’arrière vers l’avant :

1. ciel nocturne bleu / violet / turquoise ;
2. reliefs lointains et villages ;
3. ligne de forêt et terrain ;
4. clairière centrale illustrée ;
5. landmarks proches : cottage, rivière, pont, maison-arbre ;
6. végétation de premier plan ;
7. Three.js au-dessus pour la lune, les étoiles, Luma et les lucioles.

Le scroll natif déplace le panorama. Les plans lointains reçoivent une légère compensation afin de défiler moins vite que les plans proches et créer un parallaxe lisible sans suranimation.

## Direction artistique

La Forêt des Lucioles est une **nuit colorée, visible et féerique**, jamais un décor noir :

- ciel bleu nuit lumineux ;
- reliefs bleu-violet ;
- végétation vert émeraude / turquoise ;
- fenêtres et lanternes dorées ;
- accents lavande, rose et menthe dans les fleurs et les étoiles ;
- contraste par profondeur atmosphérique plutôt que par grands voiles flous.

Les effets flous restent cantonnés aux halos et au ciel. Le premier plan doit rester net.
