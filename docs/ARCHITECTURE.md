# Architecture cible multi-univers

## 1. Objectif

Faire évoluer la V1 locale existante vers un moteur multi-univers sans dupliquer les règles, les écrans ou le moteur d’animation pour chaque monde.

L’architecture reste un monolithe modulaire React + TypeScript, local-first et piloté par le domaine métier.

## 2. Principe directeur

```text
Une seule application
+ un seul moteur de quêtes
+ un seul moteur de progression
+ un seul moteur parallaxe
+ plusieurs définitions d’univers
```

Les différences entre univers proviennent des données et des manifestes, jamais de branches conditionnelles dispersées dans React.

## 3. Dépendances autorisées

```text
UI → application → domaine
                  ↑
        ports ← adaptateurs

contenus → domaine typé
assets → registre typé
scènes → moteur parallaxe
```

Le domaine ne dépend ni de React, ni du navigateur, ni du format des fichiers d’assets.

## 4. Concepts métier ajoutés

### `WorldDefinition`

Décrit un univers : identifiant, nom public, périmètre éditorial, mascotte, couvertures, progression et scène.

### `QuestFamily`

Décrit une intention de quête commune et son univers obligatoire.

### `QuestVariant`

Décrit le texte, les étapes, la durée et l’illustration adaptés à une tranche d’âge.

### `WorldProgress`

Projection de progression pour un couple enfant-univers.

### `WorldSceneDefinition`

Manifeste déclaratif de la scène parallaxe et de ses états.

## 5. Arborescence cible

```text
src/
├── app/
│   ├── controller/
│   ├── navigation/
│   └── state/
├── domain/
│   ├── child/
│   ├── world/
│   ├── quest/
│   ├── quest-variant/
│   ├── schedule/
│   ├── completion/
│   ├── progression/
│   ├── story/
│   └── shared/
├── application/
│   ├── services/
│   ├── selectors/
│   ├── ports/
│   └── model/
├── features/
│   ├── family-gateway/
│   ├── child-profile/
│   ├── world-hub/
│   ├── world-scene/
│   ├── daily-quests/
│   ├── quest-library/
│   ├── validation/
│   ├── storybook/
│   ├── settings/
│   └── backup/
├── pages/
│   ├── family/
│   ├── child/
│   └── parent/
├── content/
│   ├── worlds/
│   ├── quest-families/
│   ├── quest-variants/
│   ├── rewards/
│   ├── stories/
│   └── validation/
├── assets/
│   ├── registry/
│   ├── avatars/
│   ├── worlds/
│   ├── loaders/
│   └── fallbacks/
├── platform/
│   ├── parallax/
│   ├── audio/
│   ├── pwa/
│   ├── files/
│   ├── clock/
│   └── ids/
├── persistence/
│   ├── migrations/
│   ├── repositories/
│   ├── backup/
│   └── schemas/
└── tests/
```

## 6. Responsabilités

### Domaine

Le domaine garantit :

- qu’une quête possède un univers ;
- qu’une variante est compatible avec l’âge ;
- qu’une occurrence mémorise sa variante et son univers ;
- qu’une récompense appartient au même univers ;
- qu’une réalisation ne fait progresser qu’un univers ;
- qu’un avatar est compatible avec la tranche d’âge.

### Application

La couche application orchestre notamment :

- résolution de la variante d’âge ;
- calcul des pastilles par univers ;
- génération multi-enfants ;
- sélection de l’univers ;
- chargement différé d’une scène ;
- migration et revue des quêtes personnalisées.

### Contenus

Les six univers, familles de quêtes, variantes, récompenses et histoires sont des données validées au build.

### Assets

Le registre associe les identifiants stables aux fichiers. Aucun composant ne référence un chemin brut.

### Plateforme parallaxe

Le moteur parallaxe :

- interprète un manifeste ;
- place les calques selon la profondeur ;
- adapte le cadrage ;
- applique les animations autorisées ;
- respecte les mouvements réduits ;
- utilise un fallback statique ;
- ne connaît pas la logique de progression.

## 7. Navigation cible

```text
/
├── /child
│   ├── /select-profile
│   └── /:childId
│       ├── /worlds
│       └── /world/:worldId
│           ├── /quests
│           ├── /quest/:occurrenceId
│           ├── /treasure
│           └── /story
└── /parent
    ├── /unlock
    ├── /today
    ├── /children
    ├── /quests
    ├── /worlds
    └── /settings
```

L’écran `/` compose les deux fenêtres enfant et parent. Il ne choisit pas automatiquement un espace.

## 8. Sélecteurs essentiels

Les compteurs et vues dérivées ne sont pas persistés.

Sélecteurs prévus :

- `selectAvailableOccurrencesByWorld(childId, date)` ;
- `selectAvailableCountByWorld(childId, date)` ;
- `selectCompatibleVariant(questFamilyId, ageBand)` ;
- `selectWorldProgress(childId, worldId)` ;
- `selectWorldTiles(childId, date)` ;
- `selectWorldRewards(childId, worldId)`.

Le badge rouge est calculé depuis `selectAvailableCountByWorld`.

## 9. Résolution des variantes

Lors de la génération :

```text
planification
→ enfant
→ tranche d’âge actuelle
→ variante compatible
→ occurrence avec snapshot de variante
```

Une modification future de la tranche d’âge n’altère pas les occurrences historiques.

Une planification est refusée si un enfant ciblé ne possède aucune variante compatible.

## 10. Progression

La progression commune reçoit :

- `childId` ;
- `worldId` ;
- récompense ;
- instant de validation.

Elle ne contient aucun traitement spécifique à La Forêt des Lucioles ou aux autres univers.

Les règles de seuil, les chapitres et les slots débloqués sont fournis par `WorldDefinition`.

## 11. Scènes parallaxes déclaratives

```ts
interface WorldSceneDefinition {
  id: string
  worldId: string
  aspectRatio: string
  safeAreas: ResponsiveSafeArea[]
  stages: SceneStageDefinition[]
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
  slotId?: string
  motionProfile: 'none' | 'drift' | 'float' | 'sparkle' | 'custom'
  reducedMotionAssetId?: string
}
```

Le manifeste décrit, le moteur rend. Aucun manifeste ne contient de code exécutable.

## 12. Chargement et PWA

### Précache global

- shell ;
- six avatars ;
- six couvertures ;
- miniatures de mascottes ;
- contenus textuels ;
- fallbacks statiques.

### Chargement différé

- calques haute définition ;
- animations ;
- sons narratifs ;
- illustrations de chapitres.

Un univers est mis en cache après sa première ouverture. Une quête reste accessible avec le fallback si les calques lourds ne sont pas présents.

## 13. Migration V2 vers V3

La migration est isolée dans `persistence/migrations` et testée depuis un état V2 réel.

Elle devra :

- convertir les profils ;
- supprimer `accentId` et `activeWorldId` ;
- remplacer les anciens avatars ;
- transformer les modèles en familles et variantes ;
- mémoriser l’univers sur les occurrences ;
- préserver les récompenses historiques ;
- reconstruire les progressions ;
- marquer les quêtes personnalisées à revoir.

## 14. Contrôles anti-spaghetti

Le build échoue si :

- une famille de quête n’a pas d’univers ;
- une variante d’âge est dupliquée ;
- une récompense appartient à un autre univers ;
- un composant contient un chemin d’asset brut ;
- un monde n’a pas de fallback ;
- une scène n’a pas de mode mouvements réduits ;
- une feature importe les internes d’une autre ;
- une logique métier teste directement un nom public d’univers ;
- un composant dupliqué est créé pour un monde alors qu’un manifeste suffit.

## 15. Budgets

- shell initial hors scènes : objectif inférieur à 1,5 Mo ;
- couverture d’univers : moins de 160 Ko ;
- avatar : moins de 180 Ko ;
- calque parallaxe : moins de 250 Ko ;
- scène complète chargée : budget propre par univers ;
- aucun chargement simultané des six scènes haute définition.

## 16. Tests

### Domaine

- compatibilité d’âge ;
- cohérence univers-récompense ;
- progression isolée ;
- historique figé ;
- avatars valides.

### Application

- compteurs par univers ;
- résolution multi-enfants ;
- filtrage parent ;
- revue de migration.

### Persistance

- migration V2 vers V3 ;
- import V2 et V3 ;
- restauration ;
- conservation de l’historique.

### Interface

- écran familial à deux fenêtres ;
- sélection de profils ;
- six pavés ;
- badge présent ou absent ;
- navigation par univers ;
- profils sans compagnon ni couleur.

### Parallaxe

- profondeur ;
- fallback ;
- responsive ;
- réduction des mouvements ;
- chargement différé ;
- mode hors ligne.

## 17. Découpage des PR de code

1. domaine multi-univers et schéma V3 ;
2. migration et validation runtime ;
3. catalogue de mondes et variantes de quêtes ;
4. accueil familial et carrefour enfant ;
5. espace parent simplifié et filtres ;
6. moteur parallaxe ;
7. intégration des assets univers par univers ;
8. stabilisation, accessibilité et pilote.

Chaque PR doit rester testable et ne pas mélanger production graphique massive et refonte du domaine.
