# Modèle de données cible V3

## 1. Statut

Le code actuel utilise le schéma familial V2. Ce document définit le schéma V3 à implémenter pour le passage au multi-univers.

La migration V2 vers V3 devra être sauvegardée, testée et réversible par restauration.

## 2. Principes

- chaque quête appartient à un univers ;
- chaque occurrence mémorise l’univers et la variante d’âge réellement utilisés ;
- chaque enfant possède une progression indépendante par univers ;
- avatar enfant et mascotte d’univers sont deux concepts séparés ;
- les noms publics peuvent changer sans modifier les identifiants ;
- la progression reste reconstructible depuis les récompenses attribuées ;
- les contenus intégrés restent séparés des données familiales ;
- toute donnée chargée ou importée est validée à l’exécution.

## 3. Agrégat familial V3

```ts
interface FamilyState {
  children: ChildProfile[]
  customQuestFamilies: CustomQuestFamily[]
  schedules: QuestSchedule[]
  occurrences: QuestOccurrence[]
  completions: Completion[]
  rewardGrants: RewardGrant[]
  worldProgress: WorldProgress[]
  acknowledgedRewardGrantIds: string[]
  settings: AppSettings
}
```

Les définitions d’univers, quêtes intégrées, variantes, récompenses, histoires et scènes sont du contenu versionné, pas des données familiales dupliquées.

## 4. Profil enfant

```ts
interface ChildProfile extends EntityMetadata {
  displayName: string
  ageBand: '3-5' | '6-8' | '9-10'
  readingLevel: 'visual' | 'short-text' | 'independent'
  avatarId: ChildAvatarId
  isArchived: boolean
}
```

Champs supprimés par rapport à V2 :

- `accentId` ;
- `activeWorldId`.

Le profil ne contient ni compagnon ni couleur personnalisée.

### Avatars initiaux

```ts
type ChildAvatarId =
  | 'avatar.child.3-5.boy'
  | 'avatar.child.3-5.girl'
  | 'avatar.child.6-8.boy'
  | 'avatar.child.6-8.girl'
  | 'avatar.child.9-10.boy'
  | 'avatar.child.9-10.girl'
```

Le registre d’avatars précise la tranche d’âge compatible. Le modèle permet d’ajouter de nouveaux avatars ultérieurement sans migration de profil.

## 5. Définition d’univers

```ts
interface WorldDefinition {
  id: WorldId
  slug: string
  publicName: string
  editorialPurpose: string
  order: number
  mascotId: string
  coverAssetId: string
  sceneDefinitionId: string
  staticFallbackAssetId: string
  rewardCatalogId: string
  storyId: string
  progressionStages: WorldProgressStage[]
  contentVersion: string
  status: 'active' | 'planned'
}
```

Identifiants initiaux :

```ts
type WorldId =
  | 'world.firefly-forest'
  | 'world.dragon-mountain'
  | 'world.space-station'
  | 'world.elven-village'
  | 'world.nature-discovery'
  | 'world.creative-studio'
```

Les noms publics des deux derniers univers restent modifiables.

## 6. Mascotte

```ts
interface MascotDefinition {
  id: string
  worldId: WorldId
  publicName: string
  neutralAssetId: string
  expressionAssetIds: Record<MascotExpression, string>
  animationDefinitionIds: string[]
  alt: string
}
```

Une mascotte appartient exactement à un univers. Luma est la mascotte de `world.firefly-forest`.

## 7. Famille de quête

```ts
interface QuestFamily extends EntityMetadata {
  source: 'builtin' | 'custom'
  contentVersion?: string
  worldId: WorldId
  realLifeIntent: string
  categoryIds: QuestCategoryId[]
  requiresAdultHelp: boolean
  defaultValidation: ValidationMode
  rewardDefinitionId: string
  variants: QuestVariant[]
  parentNote?: string
  isArchived: boolean
  migrationReviewRequired?: boolean
}
```

`worldId` est obligatoire.

`migrationReviewRequired` est réservé aux quêtes personnalisées migrées dont l’univers n’a pas pu être déterminé avec certitude.

## 8. Variante de quête

```ts
interface QuestVariant {
  id: string
  ageBand: AgeBand
  readingLevel: ReadingLevel
  title: string
  actionLabel: string
  instruction: string
  estimatedMinutes?: number
  steps: QuestStep[]
  illustrationId: string
  alt: string
  gentleAlternative?: string
}
```

Règles :

- une famille ne possède pas deux variantes pour la même tranche d’âge ;
- une variante appartient à une seule famille ;
- l’illustration est adaptée à la tranche d’âge ;
- les contenus intégrés cibles proposent les trois variantes ;
- une quête personnalisée peut commencer avec une seule variante.

## 9. Planification

```ts
interface QuestSchedule extends EntityMetadata {
  questFamilyId: string
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

La planification référence la famille, pas une variante précise.

Lors de la génération, chaque enfant reçoit la variante compatible avec sa tranche d’âge.

## 10. Occurrence

```ts
interface QuestOccurrence extends EntityMetadata {
  scheduleId: string
  questFamilyId: string
  questVariantId: string
  worldId: WorldId
  childId: string
  childAgeBandSnapshot: AgeBand
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
  completionId?: string
}
```

La variante, l’univers et la tranche d’âge sont figés dans l’occurrence afin de préserver l’historique.

Clé métier :

```text
scheduleId + childId + localDate
```

## 11. Réalisation

```ts
interface Completion extends EntityMetadata {
  occurrenceId: string
  childId: string
  worldId: WorldId
  validationMode: ValidationMode
  validatedBy: 'child' | 'parent' | 'together'
  completedAt: string
  rewardGrantId: string
}
```

Le snapshot `worldId` simplifie les audits de cohérence et les futures migrations.

## 12. Récompense

```ts
interface RewardDefinition {
  id: string
  worldId: WorldId
  kind: 'resource' | 'decoration' | 'resident' | 'story-fragment' | 'badge'
  assetId: string
  label: string
  description: string
  unlockSlotId?: string
}
```

```ts
interface RewardGrant extends EntityMetadata {
  childId: string
  completionId: string
  worldId: WorldId
  rewardDefinitionId: string
  grantedAt: string
}
```

Une récompense doit appartenir au même univers que l’occurrence et la réalisation.

## 13. Progression par univers

```ts
interface WorldProgress extends EntityMetadata {
  childId: string
  worldId: WorldId
  worldVersion: string
  stage: number
  completionCount: number
  unlockedRewardIds: string[]
  unlockedStoryChapterIds: string[]
  unlockedSceneSlotIds: string[]
  lastCelebrationAt?: string
}
```

Contrainte unique :

```text
childId + worldId
```

La projection est recalculable depuis les `RewardGrant` du même enfant et du même univers.

## 14. Histoire

```ts
interface StoryChapter {
  id: string
  worldId: WorldId
  order: number
  title: string
  body: string
  illustrationId: string
  requiredCompletions?: number
  requiredRewardIds?: string[]
}
```

Aucun chapitre ne peut dépendre d’une récompense d’un autre univers.

## 15. Scène parallaxe

```ts
interface WorldSceneDefinition {
  id: string
  worldId: WorldId
  aspectRatio: string
  safeAreas: ResponsiveSafeArea[]
  stageDefinitions: SceneStageDefinition[]
  layers: ParallaxLayerDefinition[]
  mascotAnchors: MascotAnchor[]
  staticFallbackAssetId: string
}
```

```ts
interface ParallaxLayerDefinition {
  id: string
  assetId: string
  depth: number
  stageFrom: number
  stageTo?: number
  slotId?: string
  motionProfile: 'none' | 'drift' | 'float' | 'sparkle' | 'custom'
  reducedMotionAssetId?: string
  preload: boolean
}
```

Les manifestes ne contiennent pas de code exécutable.

## 16. Réglages V3

```ts
interface AppSettings {
  schemaVersion: 3
  contentVersion: string
  activeChildId?: string
  lastVisitedWorldByChild: Record<string, WorldId | undefined>
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

`lastVisitedWorldByChild` est une préférence de navigation, pas une propriété identitaire du profil.

## 17. Compteur de quêtes par univers

Le nombre affiché dans la pastille n’est pas persisté.

```ts
interface WorldAvailability {
  worldId: WorldId
  availableCount: number
}
```

Il est dérivé des occurrences :

- enfant correspondant ;
- date courante ;
- statut `available` ou `started` selon le choix UX final ;
- univers correspondant ;
- absence de suppression logique.

Les occurrences futures, ignorées, terminées ou en validation ne sont pas comptées.

## 18. Invariants V3

- chaque famille possède un univers ;
- chaque famille possède au moins une variante ;
- une tranche d’âge n’apparaît qu’une fois par famille ;
- chaque avatar est compatible avec la tranche d’âge du profil ;
- une planification ne cible que des enfants disposant d’une variante compatible ;
- une occurrence référence une variante de sa famille ;
- l’univers de l’occurrence correspond à celui de la famille ;
- l’univers de la réalisation correspond à celui de l’occurrence ;
- l’univers de la récompense correspond à celui de la réalisation ;
- une récompense ne fait progresser qu’un seul univers ;
- une progression possède une clé enfant-univers unique ;
- les chapitres et slots débloqués appartiennent au même univers ;
- un monde actif possède une mascotte, une couverture et un fallback ;
- une scène active possède un mode mouvements réduits ;
- un badge de disponibilité n’est jamais persisté.

## 19. Contenus intégrés

```text
WorldCatalog
MascotCatalog
QuestFamilyCatalog
QuestVariantCatalog
RewardCatalog
StoryCatalog
WorldSceneCatalog
AssetManifest
CopyCatalog
```

Le pack cible minimum contient :

- 6 univers ;
- 30 familles de quêtes ;
- 90 variantes d’âge ;
- 6 mascottes ;
- 6 scènes avec fallback.

## 20. Migration V2 vers V3

### Profils

- convertir l’ancien avatar vers un avatar compatible ;
- supprimer `accentId` ;
- supprimer `activeWorldId` ;
- conserver le prénom, l’âge, le niveau de lecture et l’archivage.

### Modèles intégrés

Une table de correspondance versionnée attribue à chaque identifiant V2 :

- une famille V3 ;
- un univers ;
- une ou plusieurs variantes.

### Quêtes personnalisées

- créer une famille personnalisée ;
- utiliser la tranche d’âge des enfants ou l’ancien `ageBands` pour créer les variantes ;
- attribuer un univers lorsque le contexte est certain ;
- sinon conserver une attribution sûre et activer `migrationReviewRequired`.

### Historique

- ne jamais déplacer silencieusement une réalisation historique ;
- préserver les identifiants lorsque possible ;
- conserver les récompenses existantes dans La Forêt des Lucioles si leur provenance ne peut pas être prouvée ;
- reconstruire les progressions par univers après validation.

## 21. Import, export et validation

L’import V3 suit :

```text
Lire
→ détecter V2 ou V3
→ sauvegarder
→ migrer en mémoire si nécessaire
→ hydrater
→ valider les références
→ valider les univers et variantes
→ afficher un résumé
→ remplacer en transaction
```

Le résumé indique notamment :

- nombre d’enfants ;
- nombre de familles personnalisées ;
- nombre de quêtes à reclasser ;
- progression par univers ;
- version des contenus.

## 22. Stores IndexedDB

Le snapshot peut rester dans les trois stores actuels pendant le passage V3 :

```text
familyState
familyBackups
migrationJournal
```

Le nouveau domaine ne nécessite pas d’éclatement immédiat du stockage. L’accès reste derrière `FamilyRepository`.
