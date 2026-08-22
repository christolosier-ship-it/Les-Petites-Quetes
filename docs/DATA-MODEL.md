# Modèle de données V3

## 1. Statut

Le schéma familial **courant et implémenté** est V3.

```ts
export const SCHEMA_VERSION = 3
export const CONTENT_VERSION = '3.0.0'
```

Ce document décrit les types réellement persistés et validés aujourd’hui. Il ne décrit pas un futur schéma V4.

## 2. Deux catégories de données

Le projet sépare strictement :

### Données familiales

Elles appartiennent à la famille et sont persistées dans IndexedDB : profils, quêtes personnalisées, planifications, historique, progression et réglages.

### Contenus intégrés

Ils sont versionnés dans le code et ne sont pas recopiés dans le snapshot familial :

- six univers ;
- avatars ;
- quêtes intégrées ;
- récompenses ;
- chapitres ;
- assets ;
- définitions et choix de renderers de scène.

## 3. `FamilyState`

Le contrat courant est :

```ts
interface FamilyState {
  children: readonly ChildProfile[]
  customQuestTemplates: readonly QuestTemplate[]
  schedules: readonly QuestSchedule[]
  occurrences: readonly QuestOccurrence[]
  completions: readonly Completion[]
  rewardGrants: readonly RewardGrant[]
  worldProgress: readonly WorldProgress[]
  acknowledgedRewardGrantIds: readonly string[]
  questTemplateIdsNeedingWorldReview: readonly string[]
  settings: AppSettings
}
```

`questTemplateIdsNeedingWorldReview` est une trace de migration. Elle permet de signaler les anciennes quêtes personnalisées V2 qui ont été rattachées provisoirement à La Forêt des Lucioles et méritent une revue parentale.

## 4. Métadonnées d’entité

Les entités métier persistées utilisent les métadonnées communes de `EntityMetadata` : identifiant stable, dates, révision et éventuelle suppression logique selon le type.

Les validations imposent aussi l’unicité globale des IDs entre les collections familiales principales.

## 5. `AppSettings`

```ts
interface AppSettings {
  schemaVersion: 3
  contentVersion: string
  activeChildId?: string
  parentPin: string
  onboardingCompleted: boolean
  soundEnabled: boolean
  narrationEnabled: boolean
  reducedMotion: 'system' | 'reduce' | 'allow'
  defaultValidationMode: ValidationMode
  celebrationDurationSeconds: 3 | 5 | 8
  lastBackupAt?: string
}
```

Points importants :

- `parentPin` est vide avant configuration ou contient exactement quatre chiffres ;
- un onboarding terminé exige un code parent et au moins un profil ;
- `activeChildId`, lorsqu’il existe, doit désigner un profil actif non archivé ;
- `contentVersion` est séparée de `schemaVersion`.

Le champ autrefois envisagé `lastVisitedWorldByChild` n’existe pas dans le schéma V3 actuel.

## 6. Profil enfant

```ts
interface ChildProfile extends EntityMetadata {
  displayName: string
  ageBand: '3-5' | '6-8' | '9-10'
  readingLevel: ReadingLevel
  avatarId: string
  isArchived: boolean
}
```

Les anciens champs `accentId` et `activeWorldId` ont été supprimés lors de la migration V2 vers V3.

Le registre d’avatars contient actuellement six entrées : une fille et un garçon pour chacune des trois tranches d’âge.

La validation runtime refuse un avatar incompatible avec la tranche d’âge du profil.

## 7. Univers

Les identifiants autorisés sont définis par `WORLD_IDS` :

```ts
type WorldId =
  | 'world.firefly-forest'
  | 'world.dragon-mountain'
  | 'world.space-station'
  | 'world.gnome-village'
  | 'world.nature-discovery'
  | 'world.creativity-workshop'
```

Une définition d’univers intégrée possède actuellement :

```ts
interface WorldDefinition {
  id: WorldId
  slug: string
  name: string
  shortName: string
  focus: string
  mascotId: string
  mascotName: string
  coverAssetId: string
  stageAssetIds: readonly [string, string, string, string]
  version: string
}
```

`WorldDefinition` est du contenu versionné, pas une donnée familiale.

## 8. Quêtes et familles

### 8.1 Modèle réellement utilisé

Le code V3 n’a pas un agrégat persistant `QuestFamily` contenant des objets `QuestVariant`.

Le modèle actuel utilise des `QuestTemplate` autonomes reliés par un `familyId` commun :

```text
familyId
├── QuestTemplate 3-5 ans
├── QuestTemplate 6-8 ans
└── QuestTemplate 9-10 ans
```

Le catalogue intégré contient exactement :

- 30 `familyId` ;
- 90 `QuestTemplate` ;
- trois variantes par famille ;
- une variante pour chacune des tranches `3-5`, `6-8` et `9-10`.

### 8.2 `QuestTemplate`

```ts
interface QuestTemplate extends EntityMetadata {
  source: 'builtin' | 'custom'
  contentVersion?: string
  familyId: string
  worldId: WorldId
  title: string
  instruction: string
  categoryId: QuestCategoryId
  illustrationId: string
  ageBands: readonly AgeBand[]
  readingLevel: ReadingLevel
  estimatedMinutes?: number
  steps: readonly QuestStep[]
  requiresAdultHelp: boolean
  defaultValidation: ValidationMode
  rewardDefinitionId: string
  parentNote?: string
  isArchived: boolean
}
```

Les modèles intégrés sont en lecture seule. Une personnalisation crée un modèle `custom`.

`FamilyState` ne stocke que `customQuestTemplates`. Les modèles intégrés sont relus depuis le catalogue du code.

## 9. Planification

```ts
interface QuestSchedule extends EntityMetadata {
  questTemplateId: string
  questFamilyId: string
  worldId: WorldId
  childIds: readonly string[]
  kind: 'immediate' | 'one-off' | 'weekly'
  startDate: string
  endDate?: string
  weekdays?: readonly Weekday[]
  dayMoment: DayMoment
  exactTime?: string
  priority: 'required' | 'optional'
  validationMode: ValidationMode
  isSuspended: boolean
}
```

Le schéma conserve à la fois :

- le template concret sélectionné ;
- sa famille ;
- son univers.

Cette redondance volontaire est contrôlée par validation runtime.

Une planification doit cibler au moins un enfant et ne peut pas contenir deux fois le même enfant.

## 10. Occurrence

```ts
interface QuestOccurrence extends EntityMetadata {
  scheduleId: string
  questTemplateId: string
  questFamilyId: string
  worldId: WorldId
  childId: string
  localDate: string
  dayMoment: DayMoment
  status:
    | 'upcoming'
    | 'available'
    | 'started'
    | 'validation-requested'
    | 'completed'
    | 'postponed'
    | 'ignored'
  startedAt?: string
  validationRequestedAt?: string
  completedAt?: string
  postponedTo?: string
  validationNote?: ValidationFeedback
  evidenceAssetId?: string
  completionId?: string
}
```

Clé métier imposée :

```text
scheduleId + childId + localDate
```

Deux occurrences ne peuvent pas partager cette clé.

L’occurrence V3 actuelle ne contient pas de `childAgeBandSnapshot` séparé. L’historique retient le `questTemplateId`, sa famille et son univers.

## 11. Réalisation

```ts
interface Completion extends EntityMetadata {
  occurrenceId: string
  childId: string
  validationMode: ValidationMode
  validatedBy: 'child' | 'parent' | 'together'
  completedAt: string
  rewardGrantId: string
}
```

`Completion` ne duplique pas `worldId`. L’univers se retrouve par l’occurrence liée et par la définition de récompense.

Une occurrence ne peut posséder qu’une réalisation.

## 12. Récompenses

### Définition intégrée

```ts
interface RewardDefinition {
  id: string
  worldId: string
  kind:
    | 'resource'
    | 'decoration'
    | 'resident'
    | 'story-fragment'
    | 'badge'
  assetId: string
  label: string
  description: string
}
```

### Attribution familiale

```ts
interface RewardGrant extends EntityMetadata {
  childId: string
  completionId: string
  rewardDefinitionId: string
  grantedAt: string
}
```

`RewardGrant` ne duplique pas `worldId`. Le monde est obtenu depuis `RewardDefinition.worldId`.

Une réalisation possède une seule récompense principale.

## 13. Progression par univers

```ts
interface WorldProgress extends EntityMetadata {
  childId: string
  worldId: string
  worldVersion: string
  stage: 0 | 1 | 2 | 3
  completionCount: number
  unlockedRewardIds: readonly string[]
  unlockedStoryChapterIds: readonly string[]
  lastCelebrationAt?: string
}
```

Contrainte logique :

```text
childId + worldId unique
```

Les seuils courants sont :

| Nombre de récompenses du monde | Stade |
|---:|---:|
| 0 à 1 | 0 |
| 2 à 5 | 1 |
| 6 à 11 | 2 |
| 12 et plus | 3 |

`WorldProgress` est vérifié contre l’historique des `RewardGrant` :

- `completionCount` doit correspondre au nombre d’attributions du monde ;
- le stade doit correspondre au seuil ;
- les récompenses débloquées doivent correspondre aux définitions réellement attribuées ;
- les chapitres débloqués doivent correspondre au nombre de réalisations.

La progression est donc une projection contrôlée, pas une source autonome de vérité.

Le champ anciennement projeté `unlockedSceneSlotIds` n’existe pas actuellement.

## 14. Histoires

Les chapitres sont intégrés au catalogue :

```ts
interface StoryChapter {
  id: string
  worldId: string
  order: number
  title: string
  body: string
  illustrationId: string
  requiredCompletions: number
}
```

Le catalogue contient actuellement 48 chapitres, soit huit par univers.

## 15. Références et invariants

La validation runtime contrôle notamment :

### IDs

- IDs uniques dans chaque collection ;
- absence d’ID partagé entre les grandes collections familiales.

### Profils

- avatar compatible avec l’âge ;
- profil actif existant et non archivé.

### Planifications

- template existant ;
- enfants existants ;
- `worldId` identique à celui du template.

### Occurrences

- planification existante ;
- template existant ;
- enfant existant ;
- `worldId` cohérent entre occurrence, planification et template ;
- `questFamilyId` cohérent entre occurrence, planification et template ;
- clé métier unique ;
- une occurrence `completed` référence une réalisation.

### Réalisations et récompenses

- réalisation liée à une occurrence et un enfant existants ;
- attribution liée à une réalisation et un enfant existants ;
- définition de récompense connue ;
- une réalisation ne possède pas deux récompenses principales ;
- une célébration reconnue référence une attribution existante.

### Progression

- enfant et univers existants ;
- une seule progression enfant-univers ;
- projection cohérente avec les récompenses attribuées.

## 16. Migration

Le chargeur supporte les schémas V1, V2 et V3 :

```text
V1 → V2 → V3
V2 → V3
V3 → validation
```

### V1 vers V2

La migration ajoute notamment l’état d’onboarding, la durée de célébration et la liste des récompenses déjà reconnues.

### V2 vers V3

La migration actuelle :

- supprime `accentId` et `activeWorldId` des profils ;
- garde ou remplace l’avatar selon sa compatibilité d’âge ;
- transforme les anciennes quêtes personnalisées en leur ajoutant `familyId` et `worldId` ;
- ajoute `questFamilyId` et `worldId` aux planifications ;
- ajoute `questFamilyId` et `worldId` aux occurrences ;
- rattache les données historiques V2 à `world.firefly-forest` lorsque le V2 ne permettait pas de connaître un autre monde ;
- ajoute les IDs des anciennes quêtes personnalisées à `questTemplateIdsNeedingWorldReview` ;
- fixe les versions de schéma et de contenu courantes.

Avant une migration automatique IndexedDB, le repository crée une sauvegarde `before-migration-vX` et journalise la migration.

## 17. IndexedDB

Base :

```text
les-petites-quetes
```

Version IndexedDB courante :

```text
DATABASE_VERSION = 2
```

Elle ne doit pas être confondue avec `SCHEMA_VERSION = 3`, qui versionne le format du snapshot familial.

Stores :

```text
familyState
familyBackups
migrationJournal
```

`familyState` conserve le snapshot courant sous la clé `current`.

## 18. Import et sauvegardes

Toute donnée sauvegardée, restaurée ou importée passe par `migrateFamilyState`, puis par la validation V3.

Lors d’un remplacement par import ou restauration :

- le nouvel état est validé avant écriture ;
- l’état courant peut être sauvegardé avant remplacement ;
- les écritures liées utilisent une transaction IndexedDB lorsque plusieurs stores sont concernés.

## 19. Ce que V3 ne fait pas

Pour éviter de transformer la documentation en wishlist, les éléments suivants ne font **pas** partie du contrat courant :

- agrégat persistant `QuestFamily` distinct ;
- entité persistante `QuestVariant` distincte ;
- snapshot explicite `childAgeBandSnapshot` sur l’occurrence ;
- `worldId` dupliqué dans `Completion` et `RewardGrant` ;
- `lastVisitedWorldByChild` dans les réglages ;
- `unlockedSceneSlotIds` dans `WorldProgress` ;
- manifeste de scène stocké dans `FamilyState`.

Si l’un de ces besoins devient réel, il devra être introduit par une évolution de modèle explicitement testée et documentée, pas être considéré comme déjà présent.
