# Plan directeur multi-univers

## 1. Nouveau cap

Les Petites Quêtes n’est pas l’application d’un monde unique. C’est un moteur familial dans lequel chaque type de routine ou de petit défi alimente un univers narratif distinct.

Une quête appartient obligatoirement à un univers. Lorsqu’elle est terminée et validée, elle fait évoluer uniquement cet univers pour l’enfant concerné.

```text
Quête réelle
→ univers associé
→ récompense de cet univers
→ progression de cet univers
→ évolution de sa scène parallaxe
```

Les catégories restent des filtres transversaux. Elles ne remplacent pas l’univers.

## 2. Carte des univers

| Identifiant stable | Nom public | Périmètre principal | Mascotte |
|---|---|---|---|
| `world.firefly-forest` | La Forêt des Lucioles | soirée, coucher, calme, rangement du soir | Luma la luciole |
| `world.dragon-mountain` | La Montagne du Dragon | réveil, toilette, habillage, préparation du matin | mascotte à concevoir |
| `world.space-station` | La Station Spatiale | préparation des sorties, trajet, journée extérieure | mascotte à concevoir |
| `world.elven-village` | Le Village des Lutins | école, cartable, lecture, devoirs, organisation scolaire | mascotte à concevoir |
| `world.nature-discovery` | nom public à définir | nature, observation, jardin, animaux, découverte | mascotte à concevoir |
| `world.creative-studio` | nom public à définir | dessin, musique, construction, imagination, création | mascotte à concevoir |

Les deux noms provisoires peuvent changer sans modifier les identifiants techniques.

## 3. Accueil familial

L’écran racine est divisé en deux zones clairement distinctes.

### Fenêtre enfant

- occupe la moitié gauche sur tablette et ordinateur ;
- ouvre directement l’unique profil enfant lorsqu’il n’en existe qu’un ;
- ouvre le sélecteur de profils lorsqu’il en existe plusieurs ;
- montre les avatars des enfants, sans progression comparative ;
- reste visuellement plus illustrative que la zone parent.

### Fenêtre parent

- occupe la moitié droite sur tablette et ordinateur ;
- ouvre le verrou parent puis le tableau de bord ;
- ne montre aucune donnée sensible avant déverrouillage.

Sur petit smartphone, les deux fenêtres peuvent être empilées, mais restent deux choix de même niveau.

## 4. Accueil enfant par univers

Après sélection du profil, l’enfant voit une grille de six pavés, un par univers.

Chaque pavé contient :

- le nom de l’univers ;
- son illustration de couverture ;
- sa mascotte ;
- un aperçu de son état actuel ;
- une pastille rouge contenant le nombre de quêtes disponibles maintenant.

La pastille :

- apparaît uniquement si le nombre est supérieur à zéro ;
- ne compte ni les quêtes futures, ni les quêtes ignorées, ni les quêtes en attente de validation ;
- n’est jamais utilisée comme signal de retard ou de faute ;
- possède un libellé accessible, par exemple « 2 quêtes disponibles dans La Station Spatiale ».

Le nombre est calculé par sélecteur depuis les occurrences. Il n’est pas persisté.

## 5. Intérieur d’un univers

Un pavé ouvre l’espace de l’univers choisi :

1. scène parallaxe évolutive ;
2. mascotte de l’univers ;
3. quêtes disponibles dans cet univers ;
4. trésor propre à cet univers ;
5. chapitres ou découvertes propres à cet univers.

La navigation enfant devient :

```text
Accueil familial
→ choix du profil
→ carrefour des univers
→ univers choisi
→ quête, trésor ou histoire de cet univers
```

## 6. Avatars enfants

Les compagnons et couleurs personnalisées sont supprimés du profil enfant.

La première collection comprend six avatars :

| Tranche d’âge | Avatar garçon | Avatar fille |
|---|---|---|
| 3 à 5 ans | `avatar.child.3-5.boy` | `avatar.child.3-5.girl` |
| 6 à 8 ans | `avatar.child.6-8.boy` | `avatar.child.6-8.girl` |
| 9 à 10 ans | `avatar.child.9-10.boy` | `avatar.child.9-10.girl` |

L’avatar est un personnage de représentation, distinct des mascottes des univers. Le modèle doit permettre d’ajouter plus tard d’autres avatars sans modifier les profils existants.

## 7. Quêtes adaptées par âge

Une même intention réelle peut être déclinée selon l’âge. Le contenu est donc séparé en deux niveaux.

### Famille de quête

Décrit le concept commun :

- univers ;
- catégories ;
- récompense ;
- besoin éventuel d’un adulte ;
- intention réelle.

### Variante d’âge

Décrit l’expérience adaptée :

- tranche d’âge ;
- titre ;
- consigne ;
- étapes ;
- durée ;
- niveau de lecture ;
- illustration ;
- texte alternatif.

Exemple : « préparer son cartable » possède une variante 3-5, une variante 6-8 et une variante 9-10.

Une planification peut viser plusieurs enfants. Lors de la génération, chaque occurrence reçoit la variante correspondant à la tranche d’âge de l’enfant.

## 8. Objectif de contenu

Pour le premier ensemble multi-univers complet :

- 6 univers ;
- au moins 5 familles de quêtes par univers ;
- 3 variantes d’âge par famille ;
- soit au moins 30 familles et 90 variantes affichables ;
- une répartition équilibrée entre les trois tranches d’âge.

Les 40 modèles existants seront audités, répartis, fusionnés ou réécrits. Ils ne seront pas simplement clonés dans six mondes.

## 9. Progression

Chaque enfant possède une progression indépendante pour chaque univers.

```text
ChildProfile × WorldDefinition → WorldProgress
```

Une réalisation dans La Montagne du Dragon ne peut débloquer ni objet ni chapitre dans La Forêt des Lucioles.

Chaque univers possède :

- ses propres paliers ;
- ses récompenses ;
- ses habitants ou objets ;
- sa mascotte ;
- son histoire ;
- sa scène parallaxe ;
- ses règles de mise en scène.

Le moteur de progression reste commun et piloté par les données.

## 10. Scènes parallaxes

Chaque univers fournit un manifeste de scène, et non un composant React sur mesure.

Une scène décrit :

- format de référence ;
- zones sûres responsive ;
- calques classés par profondeur ;
- éléments persistants ;
- emplacements débloquables ;
- états de progression ;
- ancres de mascotte ;
- animations légères ;
- variante avec mouvements réduits ;
- fallback statique.

Le moteur parallaxe interprète ces manifestes. L’ajout d’un univers ne doit pas créer une nouvelle architecture d’animation.

## 11. Impacts sur le modèle de données

Le prochain schéma cible est V3.

Principaux changements :

- ajout obligatoire de `worldId` aux familles de quêtes ;
- ajout de variantes d’âge structurées ;
- snapshot de `worldId` et `questVariantId` dans les occurrences ;
- progression par couple enfant-univers ;
- suppression de `accentId` et `activeWorldId` du profil ;
- validation de l’avatar par tranche d’âge ;
- registre de six `WorldDefinition` ;
- cohérence obligatoire entre quête, récompense et progression du même univers.

## 12. Migration V2 vers V3

La migration devra :

1. sauvegarder l’état V2 ;
2. convertir les profils vers les six avatars d’âge ;
3. supprimer les anciennes couleurs et compagnons ;
4. répartir les modèles intégrés avec une table de correspondance explicite ;
5. attribuer un univers aux quêtes personnalisées et signaler celles à vérifier ;
6. conserver les réalisations et récompenses existantes dans La Forêt des Lucioles lorsque leur historique ne permet pas une répartition sûre ;
7. créer les progressions manquantes à la demande ;
8. valider toutes les références avant remplacement.

Aucune heuristique silencieuse ne doit déplacer l’historique d’un enfant entre univers.

## 13. Impacts parent

L’espace parent devra :

- supprimer les champs compagnon et couleur ;
- filtrer la bibliothèque par univers puis par tranche d’âge ;
- exiger un univers lors de la création d’une quête ;
- afficher la compatibilité d’âge avant attribution ;
- empêcher une attribution sans variante compatible ;
- afficher les validations avec l’univers concerné ;
- consulter la progression de chaque enfant par univers ;
- proposer une revue des quêtes personnalisées migrées.

## 14. Impacts techniques

Nouveaux modules prévus :

```text
src/domain/world/
src/domain/quest-variant/
src/content/worlds/
src/content/quest-families/
src/features/world-hub/
src/features/world-scene/
src/assets/worlds/
src/platform/parallax/
```

Les mondes lourds seront chargés à la demande. Le carrefour, les couvertures, les avatars et les données de quête restent disponibles immédiatement.

## 15. Stratégie PWA

- shell, avatars, couvertures et contenus textuels précachés ;
- scènes parallaxes chargées par univers ;
- mise en cache d’un univers après sa première ouverture ;
- fallback statique utilisable si ses calques lourds ne sont pas encore disponibles hors ligne ;
- aucune quête bloquée par l’absence d’une animation.

## 16. Tests supplémentaires

- une quête sans univers est refusée ;
- une variante incompatible avec l’âge n’est pas proposée ;
- une planification multi-âge génère la bonne variante pour chaque enfant ;
- une récompense ne peut pas appartenir à un autre univers ;
- une réalisation ne fait progresser qu’un seul univers ;
- la pastille est absente à zéro et correcte au-delà ;
- le carrefour affiche les six univers ;
- le profil n’expose plus compagnon ni couleur ;
- les six avatars sont filtrés par tranche d’âge ;
- la migration V2 vers V3 conserve l’historique ;
- les scènes possèdent un fallback et un mode mouvements réduits.

## 17. Séquence de réalisation

### Lot 1, domaine et migration

- `WorldDefinition` ;
- familles et variantes de quêtes ;
- schéma V3 ;
- migration V2 vers V3 ;
- invariants et tests.

### Lot 2, contenus et registre

- six définitions d’univers ;
- répartition des 40 quêtes ;
- matrice d’âge ;
- catalogues de récompenses et mascottes provisoires.

### Lot 3, navigation

- accueil familial en deux fenêtres ;
- sélection de profil ;
- carrefour des six univers ;
- pastilles de quêtes disponibles.

### Lot 4, espace parent

- profils simplifiés ;
- filtres univers et âge ;
- éditeur avec univers obligatoire ;
- progression par univers.

### Lot 5, moteur parallaxe

- manifeste typé ;
- rendu responsive ;
- mouvements réduits ;
- fallback statique ;
- chargement différé.

### Lot 6, production graphique

- six avatars ;
- six couvertures ;
- six mascottes ;
- six scènes ;
- récompenses, quêtes et histoires par univers.

### Lot 7, validation

- contrôles automatiques ;
- tests Chrome et Safari ;
- pilote parent-enfant ;
- ajustements de compréhension et de performance.

## 18. Règle de gouvernance

Aucun code du prochain lot ne doit ajouter de condition du type `if world === firefly-forest` dans les composants. Les différences entre univers doivent provenir des définitions de contenu, des manifestes d’assets et des règles métier communes.
