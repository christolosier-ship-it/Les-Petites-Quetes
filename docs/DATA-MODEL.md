# Modèle de données fonctionnel

## 1. Principes

- Les modèles métier ne dépendent pas du format IndexedDB.
- Les dates métier utilisent `YYYY-MM-DD` lorsque l’heure n’a pas de sens.
- Les instants techniques utilisent ISO UTC.
- Les identifiants sont générés indépendamment du stockage.
- Les suppressions importantes peuvent être logiques afin de préparer une future synchronisation.
- Les contenus livrés avec l’application sont versionnés séparément des données familiales.

## 2. Entités principales

### ChildProfile

```ts
interface ChildProfile {
  id: string
  displayName: string
  ageBand: '3-5' | '6-8' | '9-10'
  readingLevel: 'visual' | 'short-text' | 'independent'
  avatarId: string
  accentId: string
  activeWorldId: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

Aucune date de naissance complète n’est nécessaire.

### QuestTemplate

```ts
interface QuestTemplate {
  id: string
  source: 'builtin' | 'custom'
  contentVersion?: string
  title: string
  instruction: string
  categoryId: QuestCategoryId
  illustrationId: string
  ageBands: AgeBand[]
  readingLevel: ReadingLevel
  estimatedMinutes?: number
  steps: QuestStep[]
  requiresAdultHelp: boolean
  defaultValidation: ValidationMode
  rewardDefinitionId: string
  parentNote?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

### QuestSchedule

```ts
interface QuestSchedule {
  id: string
  questTemplateId: string
  childIds: string[]
  kind: 'immediate' | 'one-off' | 'weekly'
  startDate: string
  endDate?: string
  weekdays?: Weekday[]
  dayMoment: DayMoment
  exactTime?: string
  priority: 'required' | 'optional'
  validationMode: ValidationMode
  isSuspended: boolean
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

### QuestOccurrence

```ts
interface QuestOccurrence {
  id: string
  scheduleId: string
  questTemplateId: string
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
  validationNote?: string
  evidenceAssetId?: string
  completionId?: string
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

Une contrainte métier empêche deux occurrences actives identiques pour le même planning, le même enfant et la même date.

### Completion

```ts
interface Completion {
  id: string
  occurrenceId: string
  childId: string
  validationMode: ValidationMode
  validatedBy: 'child' | 'parent' | 'together'
  completedAt: string
  rewardGrantId: string
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

### RewardDefinition

```ts
interface RewardDefinition {
  id: string
  worldId: string
  kind: 'resource' | 'decoration' | 'resident' | 'story-fragment' | 'badge'
  assetId: string
  label: string
  description: string
  quantity?: number
  unlockRule?: UnlockRule
}
```

### RewardGrant

```ts
interface RewardGrant {
  id: string
  childId: string
  completionId: string
  rewardDefinitionId: string
  grantedAt: string
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

Une occurrence terminée ne peut produire qu’un seul `RewardGrant` principal. L’opération d’attribution doit être idempotente.

### WorldProgress

```ts
interface WorldProgress {
  id: string
  childId: string
  worldId: string
  worldVersion: string
  stage: number
  unlockedRewardIds: string[]
  unlockedStoryChapterIds: string[]
  lastCelebrationAt?: string
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

Les champs dérivables pourront être recalculés à partir des `RewardGrant`. Le stockage d’une projection sert uniquement la performance et doit pouvoir être reconstruit.

### StoryChapter

```ts
interface StoryChapter {
  id: string
  worldId: string
  order: number
  title: string
  body: string
  narrationAssetId?: string
  illustrationId: string
  unlockRule: UnlockRule
}
```

### AppSettings

```ts
interface AppSettings {
  schemaVersion: number
  contentVersion: string
  activeChildId?: string
  parentLock: ParentLockSettings
  soundEnabled: boolean
  narrationEnabled: boolean
  reducedMotionOverride?: 'system' | 'reduce' | 'allow'
  defaultValidationMode: ValidationMode
  evidencePhotosEnabled: boolean
  lastBackupAt?: string
}
```

## 3. Types partagés

```ts
type AgeBand = '3-5' | '6-8' | '9-10'
type ReadingLevel = 'visual' | 'short-text' | 'independent'
type DayMoment = 'morning' | 'after-school' | 'before-meal' | 'after-meal' | 'evening' | 'bedtime' | 'anytime'
type ValidationMode = 'child' | 'parent' | 'together'
type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
```

## 4. Contenus intégrés

Les contenus livrés avec l’application sont séparés des données de l’utilisateur :

- `QuestContentPack` ;
- `WorldDefinition` ;
- `StoryDefinition` ;
- `RewardCatalog` ;
- `AssetManifest` ;
- `CopyCatalog`.

Chaque pack possède :

- un identifiant ;
- une version ;
- une langue ;
- une version minimale de l’application ;
- un checksum ou contrôle d’intégrité ;
- une liste de dépendances éventuelles.

## 5. Stores IndexedDB envisagés

```text
children
questTemplates
questSchedules
questOccurrences
completions
rewardGrants
worldProgress
settings
userMedia
migrationJournal
changeLog
```

`changeLog` est local en V1. Il pourra plus tard alimenter une synchronisation, sans être nécessaire au fonctionnement courant.

## 6. Invariants métier

- un profil archivé ne reçoit plus de nouvelles occurrences ;
- une occurrence terminée ne redevient pas disponible ;
- une validation refusée ne crée aucune récompense ;
- une récompense ne peut pas être retirée par l’absence d’une quête future ;
- la progression ne dépend pas d’une série quotidienne ;
- une occurrence ignorée n’est pas un échec ;
- les occurrences futures ne sont jamais comptées comme manquées ;
- la génération d’occurrences est idempotente ;
- un import ne remplace les données qu’après validation complète ;
- les contenus intégrés ne sont jamais modifiés directement par l’utilisateur : une personnalisation crée une copie `custom`.

## 7. Import et export

L’export contient :

- métadonnées de l’application ;
- version du schéma ;
- version des contenus ;
- toutes les entités familiales ;
- médias facultatifs selon l’option choisie ;
- date d’export ;
- contrôles de cohérence.

L’import suit :

```text
Lire → Vérifier format → Migrer en mémoire → Valider invariants → Sauvegarder l’existant → Remplacer en transaction
```

Aucune donnée partielle ne doit être injectée en cas d’échec.