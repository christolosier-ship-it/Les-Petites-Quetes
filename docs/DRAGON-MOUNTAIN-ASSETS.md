# La Montagne du Dragon — ressources Ninja Adventure

La scène utilise le pack **Ninja Adventure Asset Pack** de Pixel-Boy / AAA comme direction artistique de référence.

- Source officielle : https://pixel-boy.itch.io/ninja-adventure-asset-pack
- Projet GitHub officiel : https://github.com/pixel-boy/NinjaAdventure
- Licence : Creative Commons Zero 1.0 (CC0)
- Archive source : `Ninja Adventure - Asset Pack.zip`, fournie via Google Drive le 24 août 2026.

## Import local utilisé par l'application

Le ZIP complet reste la source de vérité. Pour cette première mise en scène, le dépôt versionne un sous-ensemble ciblé et réellement consommé : héros, monstres et DragonGreen / DragonBlue.

Les images sont conservées en WebP lossless dans deux bundles texte sous `assets/dragon-mountain/bundles/`. Le script `scripts/materialize-dragon-assets.mjs`, exécuté automatiquement par `predev` et `prebuild`, les matérialise sous :

`public/worlds/dragon-mountain/ninja-adventure/`

Cela rend la scène et la preview Vercel autonomes sans appels vers GitHub, itch.io ou Google Drive au runtime.

Le terrain de cette première version reste composé par le renderer et ses styles. Les nombreux tilesets, animaux, FX, objets et médias du ZIP complet restent disponibles comme réserve pour les prochaines passes du Scene Composer, mais ne sont pas déclarés comme importés tant qu'ils ne sont pas réellement versionnés.

L'audio du pack n'est pas embarqué dans cette passe.

## Scène

Le panorama est un monde vertical scrollable du bas vers le haut :

1. village ;
2. forêt ;
3. rivière ;
4. plaine ;
5. neige ;
6. désert / canyon ;
7. montagne volcanique ;
8. sommet du dragon.

Des personnages et monstres animés jalonnent la route. Le tableau conserve la progression en quatre stages, le bouton DEV de déblocage, le mode grand écran vertical et le Scene Composer.

## Dragon

Le sommet utilise le véritable kit `Actor/Boss/DragonGreen` du pack, assemblé à partir de l'aile, du corps et de la tête pour conserver une animation procédurale légère. Les previews de DragonGreen et DragonBlue sont également proposées dans la bibliothèque du Scene Composer.
