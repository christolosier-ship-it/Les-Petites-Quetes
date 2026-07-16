# Modèle de données fonctionnel

## 1. Principes

- Les modèles métier ne dépendent pas du format IndexedDB.
- Les dates métier utilisent `YYYY-MM-DD` lorsque l’heure n’a pas de sens.
- Les instants techniques utilisent ISO UTC.
- Les identifiants sont générés indépendamment du stockage.
- Les entités importantes possèdent une révision et peuvent porter un tombstone `deletedAt`.
- Les contenus intégrés sont versionnés séparément des données familiales.
- La progression enregistrée reste une projection entièrement reconstructible depuis les récompenses attribuées.
- Toute donnée chargée ou importée est validée à l’exécution, TypeScript seul n’étant pas une protection pour le JSON.

## 2. Agrégat familial V2

La V1 persiste un snapshot familial cohérent derrière `FamilyRepository`.

```ts
interface FamilyState {
  children: ChildProfile[]
  customQuestTemplates: QuestTemplate[]
  schedules: QuestSchedule[]
  occurrences: QuestOccurrence[]
  completions: Completion[]
  rewardGrants: RewardGrant[]
  worldProgress: WorldProgress[]
  acknowledgedRewardGrantIds: string[]
  settings: AppSettings
}
```

`acknowledgedRewardGrantIds` distingue les récompenses déjà présentées à l’enfant. Une validation effectuée par un adulte peut ainsi déclencher une célébration lors du prochain passage dans l’espace enfant, sans la rejouer ensuite.

## 3. Métadonnées partagées

Les entités familiales utilisent :

```ts
interface EntityMetadata {
  id: string
  createdAt: string
  updatedAt: string
  revision: number
  deletedAt?: string
}
```

Ces champs préparent une future synchronisation sans l’activer en V1.

## 4. Entités principales

### ChildProfile

```ts
interface ChildProfile extends EntityMetadata {
  displayName: string
  ageBand: '3-5' | '6-8' | '9-10'
  readingLevel: 'visual' | 'short-text' | 'independent'
  avatarId: string
  accentId: string
  activeWorldId: string
  isArchived: boolean
}
```

Aucune date de naissance complète n’est nécessaire.

### QuestTemplate

```ts
interface QuestTemplate extends EntityMetadata {
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
}
```

Les modèles intégrés ne sont jamais modifiés. Une personnalisation crée une copie `custom` avec un nouvel identifiant.

### QuestSchedule

```ts
interface QuestSchedule extends EntityMetadata {
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
}
```

Une planification peut viser plusieurs enfants. Sa modification fonctionnelle crée un remplacement et neutralise les occurrences encore ouvertes de l’ancienne configuration, sans toucher à l’historique terminé.

### QuestOccurrence

```ts
interface QuestOccurrence extends EntityMetadata {
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
  validationNote?: 'small-step-remains' | 'review-together'
  evidenceAssetId?: string
  completionId?: string
}
```

La clé métier d’idempotence est :

```text
scheduleId + childId + localDate
```

Une occurrence existante, même terminée ou supprimée logiquement, empêche une génération en double.

### Completion

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

### RewardDefinition

```ts
interface RewardDefinition {
  id: string
  worldId: string
  kind: 'resource' | 'decoration' | 'resident' | 'story-fragment' | 'badge'
  assetId: string
  label: string
  description: string
}
```

### RewardGrant

```ts
interface RewardGrant extends EntityMetadata {
  childId: string
  completionId: string
  rewardDefinitionId: string
  grantedAt: string
}
```

Une réalisation ne peut produire qu’un seul `RewardGrant` principal.

### WorldProgress

```ts
interface WorldProgress extends EntityMetadata {
  childId: string
  worldId: string
  worldVersion: string
  stage: 0 | 1 | 2 | 3
  completionCount: number
  unlockedRewardIds: string[]
  unlockedStoryChapterIds: string[]
  lastCelebrationAt?: string
}
```

La validation runtime recalcule les valeurs attendues depuis les `RewardGrant` et refuse toute projection incohérente.

### StoryChapter

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

## 5. Réglages V2

```ts
interface AppSettings {
  schemaVersion: 2
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

Le code parent sépare les usages sur l’appareil mais ne chiffre pas les données locales.

Les preuves photo restent hors de la V1 fonctionnelle actuelle. Leur ajout futur nécessitera une décision spécifique sur le stockage média, l’export et la suppression.

## 6. Contenus intégrés

Les contenus livrés avec l’application restent séparés du snapshot familial :

- modèles de quêtes intégrés ;
- définitions du monde ;
- catalogue de récompenses ;
- chapitres ;
- registre des assets ;
- catalogue de textes.

Les contenus intégrés possèdent une version dédiée. Une sauvegarde familiale ne duplique pas les 40 modèles intégrés, elle conserve seulement leurs références stables et les copies personnalisées.

## 7. Stores IndexedDB réels

```text
familyState
familyBackups
migrationJournal
```

### `familyState`

Contient le snapshot familial courant sous la clé `current`.

### `familyBackups`

Conserve les sauvegardes créées avant :

- migration ;
- import ;
- restauration d’une sauvegarde précédente.

Ces sauvegardes sont listables et restaurables depuis l’espace parent.

### `migrationJournal`

Conserve un journal minimal :

- version d’origine ;
- version cible ;
- instant ;
- statut terminé.

Le snapshot pourra être éclaté en stores spécialisés lors d’une future évolution sans modifier le domaine ou les écrans, car l’accès reste derrière `FamilyRepository`.

## 8. Invariants contrôlés à l’exécution

- chaque collection possède des identifiants uniques ;
- deux entités familiales ne partagent pas le même identifiant ;
- les références vers enfant, modèle, planification, occurrence, réalisation et récompense existent ;
- un profil archivé ne reçoit plus de nouvelles occurrences ;
- deux occurrences ne partagent pas la même clé métier ;
- une occurrence terminée possède une réalisation ;
- une occurrence ne possède qu’une réalisation ;
- une réalisation ne possède qu’une récompense principale ;
- une validation refusée ne crée aucune récompense ;
- une occurrence terminée ne redevient pas disponible ;
- une récompense déjà obtenue n’est jamais retirée ;
- une occurrence ignorée n’est pas un échec ;
- la progression ne dépend pas d’une série quotidienne ;
- la projection du monde correspond exactement aux récompenses attribuées ;
- une célébration reconnue référence une récompense existante ;
- le profil actif existe et n’est pas archivé ;
- un onboarding terminé possède au moins un profil et un code parent ;
- les données familiales ne contiennent que des modèles `custom` ;
- un import ne remplace les données qu’après validation complète.

## 9. Migration

La première migration réelle transforme le schéma V1 en V2 :

- ajout de `onboardingCompleted` ;
- ajout de `celebrationDurationSeconds` ;
- ajout de `acknowledgedRewardGrantIds` ;
- conservation de toutes les entités et de leurs identifiants ;
- marquage des anciennes récompenses comme déjà présentées.

Le chargement suit :

```text
Lire → détecter la version → sauvegarder l’ancien état → migrer en mémoire
→ valider → remplacer dans une transaction → journaliser
```

Une version inconnue est refusée sans modifier le snapshot courant.

## 10. Import, export et restauration

L’export contient :

- format de sauvegarde ;
- date d’export ;
- avertissement de confidentialité ;
- version du schéma et des contenus ;
- snapshot familial complet.

L’import suit :

```text
Lire → vérifier l’enveloppe → migrer en mémoire → hydrater chaque entité
→ valider les références et invariants → afficher un résumé
→ sauvegarder l’existant et remplacer dans une transaction
```

Aucune donnée partielle n’est injectée en cas d’échec.

La restauration d’une sauvegarde automatique crée d’abord une nouvelle sauvegarde de l’état courant. Un retour en arrière reste donc possible après chaque opération sensible.

## 11. Ordonnancement des écritures

Les mutations passent par une file applicative :

```text
Calculer depuis le dernier état persisté → écrire → publier dans React
```

Deux actions rapides ne peuvent pas enregistrer les snapshots dans le désordre. Une écriture refusée ne publie pas un état uniquement visuel qui disparaîtrait au prochain rechargement.

## 12. Préparation de la synchronisation future

La V1 ne communique avec aucun serveur. Les coutures déjà présentes sont :

- repositories définis par interfaces ;
- identifiants indépendants d’IndexedDB ;
- révisions ;
- tombstones ;
- dates techniques ISO ;
- dates métier locales ;
- validation centralisée des snapshots.

Un futur adaptateur de synchronisation pourra être ajouté derrière les ports sans réécrire les règles de quêtes, validation ou progression.
