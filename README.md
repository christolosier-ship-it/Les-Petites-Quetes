# Les Petites Quêtes

Une application familiale qui transforme les petites actions du quotidien en aventures illustrées pour les enfants de 3 à 10 ans.

> Petit effort, morceau d’aventure, univers qui grandit.

## Statut

Le socle V1 local-first est fonctionnel et contrôlé. Il couvre profils, quêtes, routines, validation, récompenses, sauvegardes et PWA.

Le produit entre maintenant dans un recalage structurant : le code actuel, centré sur La Forêt des Lucioles, doit devenir un moteur de **six univers indépendants** avant l’intégration des assets définitifs.

Aucun code multi-univers n’est encore présenté comme terminé dans cette documentation. Le plan cible est défini avant le prochain chantier d’implémentation.

## Univers cibles

| Univers | Quêtes principales |
|---|---|
| La Forêt des Lucioles | routines et petits défis du soir ou du coucher |
| La Montagne du Dragon | routines et petits défis du matin |
| La Station Spatiale | préparation des sorties et défis de journée |
| Le Village des Lutins | routines et petits défis scolaires |
| Univers nature, nom à définir | nature, observation et découverte |
| Univers créativité, nom à définir | imagination, construction et expression |

Chaque univers possédera :

- une mascotte ;
- une scène parallaxe évolutive ;
- une progression propre à chaque enfant ;
- des récompenses ;
- une histoire ;
- un panel de quêtes adapté aux trois tranches d’âge.

Luma la luciole reste la mascotte de La Forêt des Lucioles.

## Expérience cible

### Accueil familial

L’écran principal se divise en deux fenêtres :

- à gauche, l’espace enfant ;
- à droite, l’espace parent protégé.

### Espace enfant

Après sélection du profil, six pavés donnent accès aux univers.

Une pastille rouge affiche le nombre de quêtes actuellement disponibles dans chaque univers. Elle disparaît lorsque ce nombre vaut zéro et ne représente jamais un retard ou un échec.

### Espace parent

Le parent pourra :

- gérer les profils sans compagnon ni couleur ;
- choisir un avatar compatible avec l’âge ;
- filtrer les quêtes par univers et tranche d’âge ;
- créer une quête avec un univers obligatoire ;
- planifier pour plusieurs enfants ;
- consulter les progressions par univers.

## Avatars initiaux

La première collection prévoit :

- garçon et fille 3 à 5 ans ;
- garçon et fille 6 à 8 ans ;
- garçon et fille 9 à 10 ans.

L’avatar représente l’enfant. La mascotte appartient à un univers.

## Contenus adaptés à l’âge

Une quête cible devient une famille contenant plusieurs variantes :

```text
Famille de quête
├── variante 3-5 ans
├── variante 6-8 ans
└── variante 9-10 ans
```

Le premier catalogue complet vise au minimum :

- 6 univers ;
- 30 familles de quêtes ;
- 90 variantes d’âge.

## Architecture cible

```text
Interface
→ cas d’usage
→ domaine multi-univers
→ contenus et manifestes
→ persistance locale
```

Le moteur commun gérera :

- familles et variantes de quêtes ;
- progression par enfant et univers ;
- compteurs de disponibilité ;
- scènes parallaxes déclaratives ;
- fallbacks statiques ;
- chargement différé par univers.

Les composants ne devront jamais coder un comportement particulier avec une succession de conditions sur les noms des mondes.

## Prochain schéma de données

Le schéma V3 ajoutera notamment :

- `worldId` obligatoire sur chaque famille de quête ;
- variantes par tranche d’âge ;
- univers et variante figés dans chaque occurrence ;
- progression par couple enfant-univers ;
- avatars contraints par âge ;
- suppression de `accentId` et `activeWorldId`.

La migration V2 vers V3 préservera l’historique et signalera les quêtes personnalisées dont l’univers doit être vérifié.

## PWA et assets

- couvertures, avatars, textes et fallbacks précachés ;
- scènes parallaxes chargées univers par univers ;
- cache après première ouverture ;
- fonctionnement des quêtes garanti sans animation ;
- mode mouvements réduits obligatoire.

## Principes fondateurs

- Le parent prépare, l’enfant joue.
- Chaque quête appartient à un univers.
- Chaque enfant possède une progression indépendante dans chaque univers.
- L’effort est valorisé, jamais la perfection.
- Aucun classement, aucune série cassable et aucun retrait de récompense.
- Le temps d’écran reste bref.
- La sécurité, l’accessibilité et la vie privée des enfants restent intégrées dès la conception.

## Démarrage local

Prérequis : Node.js 22.

```bash
npm install
npm run dev
```

## Contrôles actuels

```bash
npm run check
```

Le socle actuel vérifie TypeScript strict, architecture, cycles, contenus, assets, tests, couverture, build PWA et parcours Chrome.

Le prochain cycle ajoutera les contrôles multi-univers, variantes d’âge, migration V3, compteurs par monde et manifestes parallaxes.

## Documents

- [Vision produit](./docs/PRODUCT-VISION.md)
- [Cahier des charges cible](./docs/CAHIER-DES-CHARGES.md)
- [Plan directeur multi-univers](./docs/MULTI-UNIVERSE-PLAN.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Modèle de données V3](./docs/DATA-MODEL.md)
- [Parcours utilisateurs](./docs/USER-FLOWS.md)
- [Sécurité enfant](./docs/CHILD-SAFETY.md)
- [Règles éditoriales](./docs/CONTENT-GUIDELINES.md)
- [Bible des assets](./docs/ASSET-BIBLE.md)
- [Feuille de route](./docs/ROADMAP.md)
- [Décisions structurantes](./docs/00-INDEX.md)
