# Architecture fondatrice

## 1. Objectif

Construire une application simple à faire évoluer sans transformer le code en empilement de composants, d’effets React et d’accès directs au stockage.

L’architecture retenue est un **monolithe modulaire côté client**, local-first, organisé autour du domaine métier. Elle permet de livrer une PWA sans backend en V1 tout en préparant une future synchronisation familiale derrière des interfaces stables.

## 2. Stack proposée

- React pour la composition de l’interface ;
- TypeScript en mode strict ;
- Vite pour le développement et le build ;
- Vitest pour les tests unitaires et d’intégration ;
- Testing Library pour les parcours de composants ;
- IndexedDB derrière un adaptateur de persistance ;
- Service Worker pour l’installation et le fonctionnement hors ligne ;
- SVG, WebP et audio optimisé pour les contenus ;
- aucune bibliothèque de gestion d’état globale tant que le contrôleur applicatif et les reducers suffisent.

Les versions exactes seront verrouillées au démarrage de la création, pas dans le cahier des charges.

## 3. Principes

1. Le domaine métier ne dépend ni de React, ni du navigateur, ni du stockage.
2. Les pages composent des fonctionnalités, elles ne portent pas les règles métier.
3. Les composants visuels ne lisent ni n’écrivent directement dans IndexedDB.
4. Toute mutation passe par une commande applicative explicite.
5. Les calculs de progression sont purs et testables.
6. Les contenus narratifs sont des données validées, pas des chaînes dispersées dans le JSX.
7. Les assets sont référencés par un registre typé.
8. Les migrations de données sont cumulatives, testées et irréversibles uniquement après sauvegarde.
9. Les dépendances entre modules sont contrôlées automatiquement.
10. Une future synchronisation remplace un adaptateur, pas le domaine.

## 4. Arborescence cible

```text
src/
├── app/
│   ├── bootstrap/
│   ├── controller/
│   ├── navigation/
│   ├── state/
│   └── providers/
├── domain/
│   ├── child/
│   ├── quest/
│   ├── schedule/
│   ├── completion/
│   ├── progression/
│   ├── story/
│   └── shared/
├── application/
│   ├── commands/
│   ├── queries/
│   ├── services/
│   ├── ports/
│   └── events/
├── features/
│   ├── child-profile/
│   ├── quest-library/
│   ├── quest-editor/
│   ├── daily-quests/
│   ├── validation/
│   ├── world-progression/
│   ├── storybook/
│   ├── parent-lock/
│   ├── settings/
│   └── backup/
├── pages/
│   ├── child/
│   └── parent/
├── components/
│   ├── primitives/
│   ├── feedback/
│   ├── layout/
│   └── illustration/
├── persistence/
│   ├── indexeddb/
│   ├── migrations/
│   ├── repositories/
│   ├── backup/
│   └── schemas/
├── content/
│   ├── quests/
│   ├── stories/
│   ├── rewards/
│   ├── copy/
│   └── validation/
├── assets/
│   ├── registry/
│   ├── loaders/
│   └── fallbacks/
├── platform/
│   ├── audio/
│   ├── pwa/
│   ├── files/
│   ├── clock/
│   └── ids/
├── themes/
├── tests/
└── main.tsx
```

## 5. Responsabilités des couches

### `domain`

Contient les règles métier pures :

- création et validation d’un profil enfant ;
- définition d’un modèle de quête ;
- génération d’occurrences ;
- transitions de statut ;
- validation ;
- attribution des récompenses ;
- progression du monde ;
- déblocage des chapitres.

Interdictions : React, DOM, IndexedDB, `localStorage`, réseau, dates système lues directement.

### `application`

Orchestre les cas d’usage :

- créer une quête ;
- planifier une occurrence ;
- demander une validation ;
- valider une occurrence ;
- attribuer une récompense ;
- importer une sauvegarde.

Cette couche utilise des ports comme `QuestRepository`, `ProgressRepository`, `Clock`, `IdGenerator` et `AssetCatalog`.

### `features`

Regroupe les fonctionnalités visibles. Une feature possède :

- composants spécifiques ;
- hooks de présentation ;
- view models ;
- API publique ;
- tests.

Une feature n’importe pas les fichiers internes d’une autre feature. Elle passe par son `index.ts` public ou par l’application.

### `pages`

Compose les fonctionnalités pour former un écran. Une page ne calcule pas les règles métier et ne contient pas de persistance.

### `components`

Fournit les briques d’interface réutilisables. Les primitives ne connaissent aucun concept de quête, d’enfant ou de récompense.

### `persistence`

Implémente les ports du domaine et de l’application. Elle gère :

- IndexedDB ;
- transactions ;
- migrations ;
- sérialisation ;
- validation des imports ;
- sauvegarde avant migration ;
- restauration.

### `content`

Contient les modèles de quêtes, textes, histoires et récompenses sous forme structurée. Chaque contenu est validé par schéma lors des tests et du build.

### `assets`

Associe des identifiants métier stables à des fichiers. L’application demande `quest.brush-teeth` ou `mascot.happy`, jamais un chemin brut dispersé.

### `platform`

Encapsule les API du navigateur et facilite les tests : horloge, identifiants, fichiers, audio, installation PWA.

## 6. Flux d’une action

Exemple : validation d’une quête.

```text
Bouton enfant
  → commande RequestQuestValidation
  → service applicatif
  → règle métier de transition
  → repository d’occurrences
  → événement QuestValidationRequested
  → contrôleur applicatif
  → nouveau view model
  → rendu
```

Le composant ne change jamais directement le statut de la quête.

## 7. État applicatif

L’état global doit rester limité aux éléments nécessaires au rendu et à la navigation :

- profil actif ;
- espace enfant ou parent ;
- route ;
- préférences d’interface ;
- données chargées ou view models ;
- notifications transitoires.

Les données persistantes restent la responsabilité des repositories.

Le contrôleur applicatif expose :

- des commandes ;
- des sélecteurs ;
- des événements ;
- un état de session.

Les calculs lourds sont mémorisés dans des sélecteurs dédiés, jamais répétés dans plusieurs pages.

## 8. Domaine temporel

Les dates sont une source classique de spaghetti. Règles :

- aucune fonction métier n’appelle directement `new Date()` ;
- une interface `Clock` fournit la date courante ;
- les jours sont représentés par une date locale stable `YYYY-MM-DD` ;
- les instants techniques sont stockés en ISO UTC ;
- le moment de la journée est un concept métier distinct d’une heure ;
- la génération des occurrences est idempotente ;
- les changements d’heure ne doivent pas dupliquer ni supprimer une occurrence.

## 9. Persistance et migrations

Chaque enregistrement synchronisable contient dès la V1 :

- `id` ;
- `createdAt` ;
- `updatedAt` ;
- `revision` ;
- `deletedAt` facultatif.

Ces champs préparent une future synchronisation sans l’activer.

Chaque migration :

1. lit l’ancien schéma ;
2. crée une sauvegarde locale ;
3. transforme les données dans une transaction ;
4. valide le résultat ;
5. met à jour le numéro de schéma ;
6. conserve un journal minimal de migration.

## 10. Préparation de la synchronisation future

La V1 ne communique pas avec un serveur. Toutefois :

- les repositories sont définis par interfaces ;
- les identifiants ne dépendent pas d’IndexedDB ;
- les entités possèdent une révision ;
- les suppressions peuvent être représentées par tombstone ;
- les commandes importantes peuvent produire des événements métier ;
- un futur `SyncAdapter` pourra lire un journal de changements.

Aucun code réseau factice ne sera ajouté en V1. On prépare les coutures, pas un backend fantôme.

## 11. Registre de contenus et d’assets

Chaque ressource possède :

- un identifiant stable ;
- un type ;
- un chemin ;
- des dimensions ;
- un texte alternatif ;
- un poids maximal ;
- un fallback ;
- les tranches d’âge compatibles ;
- les états d’animation disponibles.

Le build échoue si :

- un asset obligatoire manque ;
- un identifiant est dupliqué ;
- une quête référence une illustration inconnue ;
- un texte alternatif obligatoire manque ;
- le poids dépasse le budget autorisé.

## 12. Règles anti-spaghetti

Contrôles automatiques prévus :

- aucun import de `persistence` depuis `domain` ;
- aucun import direct entre internes de features ;
- aucun cycle de dépendances ;
- aucun composant de page dépassant le budget défini sans justification ;
- aucun fichier métier géant ;
- aucune chaîne narrative importante dans le JSX ;
- aucun chemin d’asset brut hors registre ;
- aucun accès IndexedDB hors persistance ;
- aucune mutation d’objet métier depuis l’UI ;
- aucun `any` non justifié ;
- aucun effet React utilisé pour recalculer une donnée dérivable.

Budgets initiaux recommandés :

- fichier applicatif : 300 lignes maximum, avertissement à 220 ;
- composant React : 180 lignes maximum ;
- fonction : 60 lignes maximum ;
- complexité cyclomatique surveillée ;
- bundle initial limité, les univers et histoires étant chargés à la demande.

Ces budgets peuvent être ajustés par décision documentée, jamais contournés silencieusement.

## 13. Tests

### Domaine

- transitions de statut ;
- récurrence ;
- report ;
- validation ;
- récompenses ;
- progression ;
- chapitres ;
- absence de punition.

### Application

- cas d’usage ;
- transactions ;
- erreurs ;
- commandes idempotentes.

### Persistance

- repositories ;
- migrations ;
- export/import ;
- restauration après erreur.

### Interface

- parcours enfant ;
- verrou parent ;
- navigation ;
- accessibilité ;
- mode sans animation ;
- mode sans son.

### End-to-end

- premier lancement ;
- création d’un profil ;
- création d’une quête ;
- réalisation ;
- validation ;
- récompense ;
- mise à jour PWA ;
- fonctionnement hors ligne.

## 14. CI et critères de fusion

Chaque PR devra exécuter :

1. format et lint ;
2. typecheck ;
3. contrôle d’architecture ;
4. contrôle des cycles ;
5. validation des contenus ;
6. validation des assets ;
7. tests unitaires ;
8. couverture ;
9. tests de migrations ;
10. build ;
11. budget du bundle ;
12. smoke test navigateur.

Aucune fusion si un contrôle est rouge.

## 15. Découpage des futurs lots

1. Fondation et garde-fous
2. Domaine enfants et quêtes
3. Planification et occurrences
4. Persistance et migrations
5. Espace parent minimal
6. Espace enfant minimal
7. Validation et progression
8. Contenu initial
9. Assets et animations
10. PWA, accessibilité et finition

Chaque lot doit livrer un incrément testable sans ouvrir plusieurs chantiers métier à la fois.