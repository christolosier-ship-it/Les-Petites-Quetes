# Architecture

## 1. Statut de ce document

Ce document décrit l’architecture **réellement présente sur `main`** après la consolidation du dépôt, de la PWA et des renderers de scènes.

Il ne décrit pas une architecture V4 à construire. Lorsqu’une évolution future est envisagée, elle appartient à `ROADMAP.md`.

## 2. Vue d’ensemble

Les Petites Quêtes est un monolithe modulaire React + TypeScript, local-first, sans backend applicatif.

```text
main.tsx
  ↓
App / pages / features / components
  ↓
contrôleur d’application
  ↓
services applicatifs
  ↓
domaine métier
  ↓
port FamilyRepository
  ↓
IndexedDB
```

En parallèle :

```text
content/ → catalogues intégrés et versionnés
assets/  → registre typé de ressources locales
platform/ → horloge, identifiants, PWA et adaptateurs navigateur
```

Les données familiales ne sont jamais mélangées aux catalogues intégrés.

## 3. Stack et exécution

- React 18.3 ;
- TypeScript 6 en mode strict ;
- Vite 8 ;
- Vitest ;
- Three.js 0.185 pour le renderer vivant de La Forêt des Lucioles ;
- IndexedDB pour la persistance ;
- Node.js 24 pour l’installation, la CI et le build ;
- Vercel pour previews et production.

L’installation reproductible repose sur `package-lock.json` et `npm ci`.

## 4. Arborescence actuelle

```text
src/
├── app/
│   ├── App.tsx
│   ├── controller/
│   └── state/
├── application/
│   ├── model/
│   ├── ports/
│   ├── selectors/
│   └── services/
├── assets/
│   └── registry/
├── components/
│   ├── layout/
│   └── world/
├── content/
│   ├── avatars/
│   ├── quests/
│   ├── validation/
│   └── world/
├── domain/
│   ├── child/
│   ├── completion/
│   ├── progression/
│   ├── quest/
│   ├── schedule/
│   ├── shared/
│   └── world/
├── features/
│   ├── child-profile/
│   ├── daily-quests/
│   ├── onboarding/
│   ├── parent-lock/
│   ├── quest-library/
│   ├── settings/
│   ├── storybook/
│   ├── validation/
│   ├── world-hub/
│   └── world-progression/
├── pages/
│   ├── child/
│   └── parent/
├── persistence/
│   ├── backup/
│   ├── migrations/
│   ├── repositories/
│   └── schemas/
├── platform/
│   ├── clock/
│   ├── ids/
│   └── pwa/
└── styles/
```

Cette arborescence est la référence. Les anciennes arborescences « cibles » ne doivent pas être utilisées pour créer artificiellement des dossiers ou couches inexistants.

## 5. Composition React

`src/main.tsx` :

- monte l’application en `StrictMode` ;
- charge les feuilles de styles ;
- demande l’enregistrement du service worker, qui est ignoré hors production.

`src/app/App.tsx` compose quatre états principaux :

1. chargement ;
2. onboarding ;
3. accueil familial ;
4. espace enfant ou espace parent.

La navigation principale n’utilise actuellement pas de routeur URL. Elle est pilotée par le reducer de session et par l’état des pages/features.

Ce choix est une réalité actuelle, pas une interdiction d’introduire un routeur plus tard si un besoin concret le justifie.

## 6. Contrôleur d’application

`useFamilyApp` est la façade React du cœur applicatif.

Il assemble :

- `IndexedDbFamilyRepository` ;
- `SystemClock` ;
- `CryptoIdGenerator` ;
- `StateCommitQueue` ;
- les services de création, planification, progression, sauvegarde et import.

Flux normal :

```text
interaction UI
→ commande du contrôleur
→ transformation pure ou service applicatif
→ StateCommitQueue
→ validation / sauvegarde repository
→ nouvel état React
```

Les composants ne doivent pas écrire directement dans IndexedDB.

## 7. Domaine métier

Le domaine porte les règles qui doivent survivre à un changement d’interface ou de stockage.

Concepts actifs :

- `ChildProfile` ;
- `QuestTemplate` ;
- `QuestSchedule` ;
- `QuestOccurrence` ;
- `Completion` ;
- `RewardGrant` ;
- `WorldProgress` ;
- `WorldDefinition`.

Le multi-univers est déjà un concept central : `worldId` existe dans les quêtes, planifications et occurrences, et la progression est séparée par enfant et univers.

Le catalogue intégré représente actuellement une « famille » par un `familyId` partagé entre trois `QuestTemplate` d’âge. Il n’existe pas encore d’agrégat persistant `QuestFamily` ou `QuestVariant` distinct. La documentation doit respecter ce modèle réel.

## 8. Contenus intégrés

`src/content` contient les données versionnées livrées avec l’application.

État actuel :

- 6 `WorldDefinition` ;
- 6 avatars ;
- 30 familles de quêtes ;
- 90 `QuestTemplate` intégrés, soit une variante par tranche d’âge dans chaque famille ;
- au moins 37 définitions de récompenses ;
- 48 chapitres d’histoire ;
- définitions de scènes génériques et catalogue de renderers.

Ces contenus ne sont pas copiés dans `FamilyState`.

## 9. Les six univers

Les identifiants courants sont :

```text
world.firefly-forest
world.dragon-mountain
world.space-station
world.gnome-village
world.nature-discovery
world.creativity-workshop
```

Les anciens identifiants documentaires `world.elven-village` et `world.creative-studio` ne sont pas valides dans le code actuel.

## 10. Architecture des scènes

### 10.1 Orchestrateur

`ParallaxScene` est un dispatcher minimal :

```text
world.id
→ sceneRendererForWorld(...)
→ renderer déclaré
```

Il ne contient aucune branche du type :

```ts
if (world.id === 'world.firefly-forest') { ... }
```

### 10.2 Catalogue de renderers

`sceneRendererCatalog.ts` connaît les associations monde-renderer.

Renderers disponibles :

- `generic-parallax` ;
- `firefly-diorama`.

Tous les mondes utilisent `generic-parallax` par défaut. La Forêt déclare l’override `firefly-diorama`.

Un futur monde spécialisé doit ajouter un renderer et une association dans ce catalogue, sans ajouter une exception à `ParallaxScene`.

### 10.3 Renderer générique

`GenericParallaxScene` :

- construit la définition de scène depuis le monde et ses assets de stade ;
- filtre les calques selon le stade 0 à 3 ;
- applique un léger déplacement au pointeur ;
- coupe ce déplacement lorsque les mouvements sont réduits ;
- résout les images via le registre d’assets.

### 10.4 Renderer de La Forêt

`FireflyForestDiorama` porte la composition spécifique de La Forêt :

- décor illustré 2.5D ;
- parallaxe illustré ;
- plein écran ;
- chargement lazy de la couche Three.js ;
- fallback visuel pendant le chargement.

`FireflyForestScene` ne porte plus le décor général. Sa responsabilité est limitée à la couche Three.js vivante :

- enfant ;
- Luma ;
- étoiles ;
- lune ;
- lucioles ;
- animation de ces éléments.

Les anciens constructeurs Three.js d’arbres, champignons, lanterne, banc et la logique `sparkleGroups` ont été supprimés.

### 10.5 CSS

- `world.css` contient les styles communs ;
- `firefly-world.css` contient les styles spécifiques au diorama de La Forêt.

Un nouveau renderer spécialisé ne doit pas déposer ses règles visuelles dans le CSS générique.

## 11. Assets

Tous les composants doivent utiliser des identifiants d’assets et `getAssetUrl` lorsque l’asset appartient au registre.

Le registre courant fusionne :

- `assets.json` ;
- `avatars.json` ;
- `firefly-assets.json`.

Les cinq ressources CC0 illustrées actuellement utilisées dans le diorama Firefly sont locales dans :

```text
public/worlds/firefly-forest/
```

Aucune image du décor Firefly n’est téléchargée depuis Openclipart à l’exécution.

## 12. Persistance et schéma

Le schéma familial courant est **V3**.

`IndexedDbFamilyRepository` encapsule le stockage. Les entrées chargées ou importées passent par migration puis validation runtime.

La migration supporte :

```text
V1 → V2 → V3
V2 → V3
V3 → validation directe
```

La migration V2 vers V3 :

- retire `accentId` et `activeWorldId` des profils ;
- rétablit un avatar compatible si nécessaire ;
- rattache l’héritage V2 à La Forêt des Lucioles ;
- ajoute `familyId` et `worldId` aux objets concernés ;
- inscrit les anciennes quêtes personnalisées dans `questTemplateIdsNeedingWorldReview` ;
- fixe `schemaVersion` et `contentVersion` courants.

Le détail contractuel est dans `DATA-MODEL.md`.

## 13. Validation runtime

`validateFamilyState` hydrate puis contrôle notamment :

- version de schéma ;
- formats des réglages ;
- unicité des identifiants ;
- compatibilité avatar-âge ;
- références croisées ;
- cohérence `worldId` entre planification, occurrence et quête ;
- cohérence de la famille ;
- unicité métier d’une occurrence ;
- cohérence entre réalisations et récompenses ;
- reconstruction attendue de `WorldProgress` depuis l’historique des récompenses.

Une sauvegarde invalide ne doit pas devenir l’état courant.

## 14. PWA

Il existe une seule stratégie de service worker.

### Build

```text
vite build
→ scripts/generate-service-worker.mjs
→ dist/sw.js
```

Le fichier `public/sw.js` a été supprimé.

### Développement

`registerServiceWorker()` retourne immédiatement lorsque `import.meta.env.PROD` est faux. Un serveur Vite de développement ne doit donc pas être contaminé par un ancien cache applicatif.

### Production

Le service worker :

- précache le shell et les ressources locales non dynamiques retenues par le build ;
- supprime les anciennes versions du cache applicatif ;
- gère les navigations avec fallback vers `index.html` ;
- met en cache les ressources locales récupérées au runtime ;
- ne contient aucune liste d’hôtes graphiques externes.

Les chunks dynamiques, dont Three.js/Firefly, sont récupérés et cachés à la première ouverture.

## 15. Qualité et CI

La CI GitHub `Qualité légère` utilise Node 24 et `npm ci`.

Sur chaque PR vers `main` et chaque push sur `main`, elle exécute :

```text
architecture + cycles + assets
lint + typecheck
85 tests
build de production
```

`eslint` est exécuté avec `--max-warnings=0`.

Les contrôles plus lourds sont regroupés dans `npm run audit` et ne sont pas des bloqueurs systématiques de PR.

Cette séparation est volontaire : un feu vert quotidien doit rester lisible, rapide et significatif.

## 16. Déploiement

Vercel est la seule plateforme de déploiement actuelle.

```text
PR / branche → preview
main         → production
```

`vercel.json` impose :

- framework Vite ;
- `npm ci --no-audit --no-fund` ;
- `npm run build` ;
- sortie `dist` ;
- rewrite SPA vers `index.html`.

GitHub Pages et son ancien sous-chemin ne font plus partie de l’architecture.

## 17. Règles anti-spaghetti

Une évolution doit préserver les frontières suivantes :

- pas d’IndexedDB directement dans une page ou un composant ;
- pas de règle métier dans React ;
- pas de chemin d’asset brut lorsqu’un asset est enregistré ;
- pas de nouveau `world.id === ...` dans les orchestrateurs génériques de scène ;
- pas de CSS spécifique à un monde dans `world.css` ;
- pas de second service worker parallèle ;
- pas de dépendance graphique réseau requise au fonctionnement ;
- pas de nouveau schéma de données sans migration et validation runtime ;
- pas de contrôle CI désactivé pour obtenir artificiellement un vert.

`npm run check:architecture` et `npm run check:cycles` protègent une partie de ces frontières automatiquement.

## 18. Principe d’évolution

L’architecture n’a pas besoin d’un nouveau « grand plan cible » pour chaque cycle.

Une évolution structurante doit :

1. partir du code et du modèle courants décrits ici ;
2. identifier le besoin concret ;
3. modifier la plus petite frontière nécessaire ;
4. ajouter ou adapter les contrôles pertinents ;
5. mettre ce document à jour dans la même PR si la structure réelle change.

Les ADR servent à conserver la raison des décisions importantes, pas à maintenir une seconde architecture parallèle.
