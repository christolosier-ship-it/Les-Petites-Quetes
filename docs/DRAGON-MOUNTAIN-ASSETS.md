# La Montagne du Dragon — ressources Ninja Adventure

La scène utilise le pack **Ninja Adventure Asset Pack** de Pixel-Boy / AAA comme direction artistique de référence.

- Source officielle : https://pixel-boy.itch.io/ninja-adventure-asset-pack
- Projet GitHub officiel : https://github.com/pixel-boy/NinjaAdventure
- Licence : Creative Commons Zero 1.0 (CC0)
- Archive source utilisée : `Ninja Adventure - Asset Pack.zip` fournie par le propriétaire du projet via Google Drive le 24 août 2026.

## Import local

Les ressources nécessaires à la scène sont désormais servies localement depuis :

`public/worlds/dragon-mountain/ninja-adventure/`

Le lot intégré couvre les briques utiles à La Montagne du Dragon et au Scene Composer :

- tilesets nature, eau, relief, désert, maisons et village abandonné ;
- personnages et personnages animés ;
- monstres ;
- boss DragonGreen et DragonBlue ;
- animaux utiles ;
- effets visuels ;
- objets ;
- palette, README et licence du pack.

L'audio du ZIP complet n'est volontairement pas embarqué dans le bundle web de cette passe afin d'éviter près de 100 Mo de médias inutilisés dans le dépôt et le cache PWA. Il pourra être intégré séparément si une direction sonore est validée.

## Scène cible

Le panorama est un monde vertical scrollable du bas vers le haut :

1. village ;
2. forêt ;
3. rivière ;
4. plaine ;
5. neige ;
6. désert / canyon ;
7. montagne volcanique ;
8. sommet du dragon.

Des personnages et monstres animés jalonnent la route. Le tableau garde la progression en quatre stages, le bouton DEV de déblocage, le mode grand écran vertical et le Scene Composer.

## Dragon

Le sommet utilise maintenant le véritable kit `Actor/Boss/DragonGreen` du pack, assemblé à partir des ailes, du corps et de la tête pour conserver une animation procédurale légère. `DragonBlue` est également conservé dans la bibliothèque du Scene Composer comme variante disponible.
