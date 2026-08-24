# La Montagne du Dragon — ressources Ninja Adventure

La scène utilise le pack **Ninja Adventure Asset Pack** de Pixel-Boy / AAA comme direction artistique de référence.

- Source officielle : https://pixel-boy.itch.io/ninja-adventure-asset-pack
- Projet GitHub officiel : https://github.com/pixel-boy/NinjaAdventure
- Licence : Creative Commons Zero 1.0 (CC0)

## État de l'import

Le pack itch.io complet pèse environ 89 Mo et contient davantage de ressources que le projet GitHub officiel, notamment les mises à jour les plus récentes et le kit procédural du Dragon Boss.

Le connecteur GitHub utilisé pour cette passe ne permet pas d'importer les fichiers binaires du pack itch.io directement. La première implémentation consomme donc les sprites officiels disponibles publiquement dans le dépôt `pixel-boy/NinjaAdventure` via leurs URLs raw, notamment :

- `content/character/ninja_blue/sprite.png`
- `content/character/samurai_blue/sprite.png`
- `content/character/samurai_green/samurai_green.png`
- les tilesets officiels présents dans `content/map/` restent la réserve graphique prévue pour la prochaine passe locale.

Aucun sprite RPG local n'a été redessiné pour remplacer Ninja Adventure.

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

Des personnages animés jalonnent la route. Le tableau garde la progression en quatre stages, le bouton DEV de déblocage, le mode grand écran vertical et une extension du Scene Composer.

## Suite recommandée

Dès qu'une copie locale du ZIP Ninja Adventure complet est disponible, importer les fichiers réellement nécessaires sous `public/worlds/dragon-mountain/ninja-adventure/`, mettre à jour le registre d'assets et remplacer les URLs raw par des chemins locaux. Le kit `Actor/Boss/Dragon Green & Blue` doit alors remplacer le dragon temporaire de la première composition.
