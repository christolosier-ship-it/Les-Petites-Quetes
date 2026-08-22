# Contribuer au projet

## Avant de coder

Toute modification doit être rattachée à un besoin du cahier des charges, de la roadmap courante ou à une décision documentée.

Une fonctionnalité hors périmètre ne doit pas être introduite discrètement sous forme de « petite amélioration ». Si elle change une frontière d’architecture, le schéma, la PWA, un univers ou un parcours enfant, son impact doit être explicite dans la PR.

## Branches

- `main` contient la version stable.
- Une branche traite un objectif cohérent.
- Les branches de version permanentes sont interdites.
- Les versions sont représentées par des tags lorsque nécessaire.

Exemples :

```text
feat/dragon-mountain-scene
fix/occurrence-generation
assets/firefly-mascot-polish
docs/child-safety-review
```

## Pull requests

Une PR doit :

- rester limitée à un sujet ;
- expliquer le besoin ;
- indiquer les couches touchées ;
- mentionner les règles métier modifiées ;
- inclure les tests adaptés ;
- documenter l’impact sur les données ;
- documenter l’impact enfant et accessibilité ;
- éviter les refactorings sans rapport ;
- mettre à jour la documentation de référence lorsque la réalité du projet change.

## Architecture

Interdictions :

- accéder à IndexedDB depuis une page ou un composant ;
- placer une règle métier dans un composant React ;
- importer les internes d’une autre feature ;
- utiliser un chemin d’asset brut lorsqu’un asset appartient au registre ;
- disperser les contenus narratifs dans le JSX sans raison ;
- appeler directement l’horloge système dans le domaine ;
- contourner une migration ;
- ajouter une branche `world.id === ...` dans l’orchestrateur générique de scènes ;
- créer un deuxième service worker concurrent ;
- rendre un asset graphique distant indispensable au runtime ;
- désactiver un contrôle CI pour faire passer une PR.

## Code

- TypeScript strict ;
- fonctions courtes et nommées ;
- données immuables dans le domaine ;
- erreurs métier explicites ;
- pas de `any` sans justification ;
- pas d’effet React pour une donnée calculable ;
- commentaires réservés aux décisions non évidentes ;
- pas de duplication de règles.

## Tests et contrôles

Le parcours essentiel est :

```bash
npm run check
```

La CI GitHub ajoute le contrôle des assets.

Avant un jalon de diffusion ou lorsqu’un changement le justifie, utiliser aussi :

```bash
npm run audit
```

Toute règle métier nouvelle doit posséder un test adapté. Les corrections de bug doivent ajouter un cas qui aurait détecté le défaut. Les migrations sont testées depuis chaque schéma supporté.

## Enfant, éthique et accessibilité

Toute PR touchant l’espace enfant doit vérifier :

- compréhension avec un minimum de lecture lorsque les 3 à 5 ans sont concernés ;
- absence de culpabilisation ;
- absence de comparaison ;
- fonctionnement sans effets sonores ;
- fonctionnement avec mouvements réduits ;
- zones tactiles suffisantes ;
- texte alternatif des illustrations pertinentes.

## Assets

Aucun asset n’est ajouté sans :

- identifiant de registre ;
- fichier local lorsque l’asset est nécessaire au runtime ;
- licence et provenance documentées pour une source externe ;
- format attendu ;
- texte alternatif ;
- budget de poids ;
- validation visuelle sur smartphone/tablette selon son usage.

`npm run check:assets` doit rester vert.

## Scènes de monde

- `ParallaxScene` reste un dispatcher.
- Le renderer par défaut est générique.
- Un monde nécessitant un rendu spécifique déclare un renderer dans le catalogue.
- Le CSS spécifique à un monde reste séparé de `world.css`.
- Three.js est utilisé seulement lorsque la profondeur ou l’animation le justifie.

## Documentation

Pour connaître l’état actuel, suivre `docs/00-INDEX.md`.

Les ADR conservent l’historique des décisions, mais ne doivent pas servir de seconde architecture lorsque le code a évolué.

Ne pas créer de nouveau « plan cible Vx » si une mise à jour de `ARCHITECTURE.md`, `DATA-MODEL.md` ou `ROADMAP.md` suffit.

## Fusion

Une PR n’est fusionnée que lorsque les contrôles requis sont verts, que la preview Vercel est saine lorsqu’elle est pertinente et que la documentation reste cohérente avec le code.
