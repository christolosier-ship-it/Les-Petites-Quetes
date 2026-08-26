# Beyond Fable dans Les Petites Quêtes

Le tableau **Forêt des Lucioles** embarque Beyond Fable comme mini-jeu web autonome.

## Source locale figée

- Projet amont : `xikhar/beyond-fable`
- Commit importé : `6e33885a2327e28dceaf70940e1563d6e75e1219`
- Licence : MIT, conservée dans `vendor/beyond-fable/LICENSE`
- Source : copie locale complète dans `vendor/beyond-fable/`

Il ne s'agit plus d'un sous-module. Le clone de Les Petites Quêtes contient réellement le code du jeu. `materialize-beyond-fable.mjs` copie cette source dans un workspace temporaire, applique uniquement les adaptations LPQ puis compile le mini-jeu vers `public/games/beyond-fable/`.

Les références au dépôt amont restent uniquement documentaires dans `UPSTREAM.md`; elles ne participent ni au build ni au runtime.
