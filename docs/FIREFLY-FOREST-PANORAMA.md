# Forêt des Lucioles — modèle de panorama

## Référence de composition

Le panorama suit le principe des **HD multi-layer Parallax Background Samples of Glitch Game Assets** publiés sur OpenGameArt par Tiny Speck / jakegamer :

- source : https://opengameart.org/content/hd-multi-layer-parallex-background-samples-of-glitch-game-assets
- licence : CC0 / domaine public ;
- modèle : quelques grands plans cohérents plutôt qu’une collection d’objets isolés ;
- principe retenu : déplacer les plans à des vitesses différentes pour créer la profondeur.

Le projet ne redistribue pas le ZIP de référence. Il utilise ses assets Glitch CC0 déjà rapatriés localement et reprend la logique de composition multi-layer.

## Architecture du panorama Firefly

Le plein écran est une scène horizontale d’environ trois écrans de large, scrollable au doigt de gauche à droite.

Les couches sont, de l’arrière vers l’avant :

1. ciel nocturne bleu / violet / turquoise ;
2. reliefs lointains et villages ;
3. forêt lointaine ;
4. ligne de forêt et terrain ;
5. clairière centrale illustrée ;
6. arbres proches et landmarks : cottage, rivière, pont, maison-arbre ;
7. petite fille et faune ;
8. végétation de premier plan ;
9. Three.js au-dessus pour la lune, les étoiles, Luma et les lucioles.

Le scroll natif déplace le panorama. Les plans lointains reçoivent une légère compensation afin de défiler moins vite que les plans proches.

## Trois secteurs narratifs

- **Ouest — près de la maison** : cottage, végétation dense, hérisson et renard.
- **Centre — clairière de Luma** : zone plus ouverte, petite fille en pyjama, hibou, lapin et lucioles.
- **Est — forêt sauvage** : rivière, pont, blaireau, faon, chauves-souris, maison-arbre et village lointain.

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

Le ciel Three.js utilise quatre familles d’étoiles :

- petites étoiles ivoire très nombreuses ;
- étoiles menthe intermédiaires ;
- étoiles lavande plus visibles ;
- quelques grandes étoiles dorées très brillantes.

Au stade final, le ciel contient plus de 400 points étoilés répartis sur plusieurs profondeurs. Les quatre couches scintillent avec des rythmes distincts afin d’éviter un effet synchronisé.

## Direction artistique

La Forêt des Lucioles est une **nuit colorée, visible et féerique**, jamais un décor noir :

- ciel bleu nuit lumineux ;
- reliefs bleu-violet ;
- végétation vert émeraude / turquoise ;
- fenêtres et lanternes dorées ;
- accents lavande, rose et menthe ;
- contraste par profondeur atmosphérique plutôt que par grands voiles flous.

Les premiers plans restent nets. Les effets flous sont limités aux halos lumineux et à l’atmosphère du ciel.
