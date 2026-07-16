# Contribuer au projet

## Avant de coder

Toute modification doit être rattachée à un besoin du cahier des charges ou à une décision documentée.

Une fonctionnalité hors périmètre V1 ne doit pas être introduite discrètement sous forme de « petite amélioration ».

## Branches

- `main` contient la version stable.
- Une branche traite un objectif cohérent.
- Les branches de version permanentes sont interdites.
- Les versions seront représentées par des tags.

Exemples :

```text
feat/quest-domain
feat/parent-dashboard
fix/occurrence-generation
assets/firefly-mascot-prototype
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
- éviter les refactorings sans rapport.

## Architecture

Interdictions :

- accéder à IndexedDB depuis une page ou un composant ;
- placer une règle métier dans un composant React ;
- importer les internes d’une autre feature ;
- utiliser un chemin d’asset brut hors registre ;
- disperser les contenus narratifs dans le JSX ;
- appeler directement l’horloge système dans le domaine ;
- contourner une migration ;
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

## Tests

Toute règle métier possède un test positif et au moins un cas limite.

Les corrections de bug doivent ajouter un test qui échoue avant la correction.

Les migrations sont testées depuis chaque schéma supporté.

## Enfant, éthique et accessibilité

Toute PR touchant l’espace enfant doit vérifier :

- compréhension sans lecture lorsque le mode 3 à 5 ans est concerné ;
- absence de culpabilisation ;
- absence de comparaison ;
- fonctionnement sans son ;
- fonctionnement avec animations réduites ;
- zones tactiles suffisantes ;
- texte alternatif des illustrations.

## Assets

Aucun asset n’est ajouté sans :

- identifiant de registre ;
- nom conforme ;
- format attendu ;
- texte alternatif ;
- budget de poids ;
- fallback si nécessaire ;
- validation visuelle sur smartphone.

## Fusion

Une PR n’est fusionnée que lorsque tous les contrôles sont verts et que la documentation reste cohérente avec le code.