# Les Petites Quêtes

Les Petites Quêtes est une PWA familiale, privée et local-first qui transforme de petites actions du quotidien en aventures illustrées pour les enfants de 3 à 10 ans.

> Petit effort, morceau d’aventure, univers qui grandit.

## État actuel

Le projet possède aujourd’hui un socle multi-univers réellement implémenté, et non plus seulement planifié.

Sont en place :

- six univers typés avec une mascotte et une progression propres ;
- six avatars enfants, deux par tranche d’âge ;
- 30 familles de quêtes intégrées et 90 variantes d’âge ;
- profils enfants, planifications, occurrences, validation et récompenses ;
- progression indépendante par couple enfant-univers ;
- onboarding, espace enfant, carrefour des univers et espace parent protégé par code local ;
- sauvegarde, restauration et import ;
- persistance IndexedDB avec migration automatique des schémas V1 et V2 vers le schéma V3 courant ;
- PWA installable et utilisable hors ligne après mise en cache ;
- déploiement Vercel depuis `main` et previews automatiques sur les branches/PR ;
- CI GitHub volontairement courte et bloquante sur les contrôles essentiels.

Production : https://les-petites-quetes.vercel.app

## Les six univers

| ID stable | Univers | Mascotte | Périmètre |
|---|---|---|---|
| `world.firefly-forest` | La Forêt des Lucioles | Luma | soirée, calme et coucher |
| `world.dragon-mountain` | La Montagne du Dragon | Flammèche | réveil et routines du matin |
| `world.space-station` | La Station Spatiale | Nova | sorties et défis de journée |
| `world.gnome-village` | Le Village des Lutins | Pico | école, lecture et organisation |
| `world.nature-discovery` | Nature et découvertes | Brindille | jardin, animaux et observation |
| `world.creativity-workshop` | L’Atelier créatif | Mimo | dessin, musique et imagination |

Les identifiants techniques sont stables. Les libellés et contenus narratifs peuvent évoluer sans migration de données.

## Boucle d’usage

```text
Le parent prépare ou planifie une quête
→ l’enfant choisit son profil
→ il ouvre un univers
→ il réalise une quête adaptée
→ la quête est validée
→ une récompense est attribuée
→ seul l’univers concerné progresse
```

L’application n’est pas conçue pour retenir l’enfant longtemps à l’écran. L’action importante se déroule dans le monde réel.

## Architecture actuelle

Le projet est un monolithe modulaire React + TypeScript :

```text
React / pages / features
        ↓
contrôleur d’application
        ↓
services applicatifs
        ↓
domaine métier
        ↓
ports de persistance
        ↓
IndexedDB
```

Les contenus et assets restent séparés des données familiales :

```text
content/  → catalogues versionnés
assets/   → registres typés
FamilyState V3 → données privées de la famille
```

### Scènes de monde

`ParallaxScene` ne contient plus d’exception codée en dur pour un univers. Il choisit un renderer depuis `sceneRendererCatalog` :

- `generic-parallax` est le renderer par défaut ;
- `firefly-diorama` est le renderer spécialisé de La Forêt des Lucioles.

La Forêt combine :

- un décor illustré 2.5D local ;
- des acteurs, étoiles, lune et lucioles rendus avec Three.js ;
- un chargement différé de la couche Three.js ;
- un comportement adapté aux mouvements réduits.

Cette séparation permet de créer un second renderer spécialisé sans polluer l’orchestrateur générique.

## Données

Le schéma courant est **V3** (`SCHEMA_VERSION = 3`, contenu `3.0.0`).

Le snapshot familial contient notamment :

- les enfants ;
- les quêtes personnalisées ;
- les planifications ;
- les occurrences ;
- les réalisations ;
- les récompenses attribuées ;
- la progression par univers ;
- les réglages ;
- la liste des anciennes quêtes personnalisées dont l’univers reste à vérifier après migration.

Les catalogues intégrés de mondes, quêtes, récompenses, histoires et assets ne sont pas dupliqués dans les données familiales.

## PWA et assets

La stratégie PWA est unique : le service worker est généré pendant le build par `scripts/generate-service-worker.mjs`.

- aucun service worker n’est enregistré en développement ;
- l’ancien `public/sw.js` n’existe plus ;
- le precache ne contient que des ressources locales ;
- les chunks dynamiques sont mis en cache à leur première utilisation ;
- les assets graphiques utilisés par La Forêt sont embarqués dans le dépôt ;
- Openclipart reste uniquement une provenance documentaire des ressources CC0, jamais une dépendance réseau d’exécution.

Les assets applicatifs passent par le registre typé de `src/assets/registry` et par les contrôles de budget.

## Stack

- React 18.3 ;
- TypeScript 6 ;
- Vite 8 ;
- Three.js 0.185 pour la couche vivante de la Forêt ;
- Vitest ;
- IndexedDB ;
- Vercel ;
- Node.js 24.

## Démarrage local

Prérequis : Node.js 24.

```bash
npm ci
npm run dev
```

Build local :

```bash
npm run build
npm run preview
```

## Qualité

Le contrôle quotidien est volontairement compact :

```bash
npm run check
```

Il vérifie :

- architecture ;
- cycles de dépendances ;
- lint sans warning ;
- typage ;
- tests ;
- build de production et budget du bundle.

La CI GitHub ajoute la validation des assets au même parcours essentiel.

Les contrôles plus lourds restent disponibles à la demande :

```bash
npm run audit
```

Ils couvrent les budgets de fichiers, les assets, les contenus, la couverture et le smoke test navigateur. Ils ne bloquent pas chaque PR par défaut.

## Déploiement

Le dépôt GitHub est la source de code. Vercel est la plateforme de déploiement :

```text
branche / PR → Preview Vercel
main         → Production Vercel
```

`vercel.json` utilise `npm ci`, `npm run build` et publie `dist` avec une réécriture SPA vers `index.html`.

GitHub Pages n’est plus utilisé.

## Principes fondateurs

- Le parent prépare, l’enfant joue.
- Chaque quête appartient à un univers.
- Chaque enfant possède une progression indépendante dans chaque univers.
- L’effort est valorisé, jamais la perfection.
- Aucun classement, aucune série cassable et aucun retrait de récompense.
- Le temps d’écran reste bref.
- La sécurité, l’accessibilité et la vie privée des enfants restent intégrées dès la conception.
- Les données familiales restent locales à l’appareil dans l’architecture actuelle.

## Documentation

La documentation de référence est organisée depuis [`docs/00-INDEX.md`](./docs/00-INDEX.md).

Documents principaux :

- [Architecture réelle](./docs/ARCHITECTURE.md)
- [Modèle de données V3 réel](./docs/DATA-MODEL.md)
- [Bible des assets](./docs/ASSET-BIBLE.md)
- [Feuille de route](./docs/ROADMAP.md)
- [Vision produit](./docs/PRODUCT-VISION.md)
- [Cahier des charges](./docs/CAHIER-DES-CHARGES.md)
- [Parcours utilisateurs](./docs/USER-FLOWS.md)
- [Sécurité enfant](./docs/CHILD-SAFETY.md)
- [Règles éditoriales](./docs/CONTENT-GUIDELINES.md)
- [Sources des assets de La Forêt](./docs/FIREFLY-FOREST-ASSETS.md)

Les ADR conservent l’historique des décisions. Ils ne remplacent pas la documentation courante lorsqu’une architecture a depuis été implémentée ou consolidée.
