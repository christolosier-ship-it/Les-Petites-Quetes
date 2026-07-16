# Bible des assets multi-univers

## 1. Finalité

Créer six univers visuellement cohérents entre eux, mais immédiatement reconnaissables, avec des scènes parallaxes évolutives, six mascottes et six avatars enfants initiaux.

Aucun lot massif ne doit être produit avant validation :

- du style global ;
- de la silhouette de chaque mascotte ;
- des avatars par tranche d’âge ;
- du format des scènes ;
- des budgets ;
- des calques animables ;
- des conventions de nommage.

## 2. Cohérence globale

Tous les univers partagent :

- une direction album jeunesse contemporain ;
- des formes lisibles ;
- des textures légères ;
- des expressions franches ;
- un niveau de détail compatible tablette et smartphone ;
- des proportions de personnages communes ;
- des contours et ombres cohérents ;
- une même logique d’animation douce ;
- aucune esthétique inquiétante pour les plus jeunes.

Chaque univers possède ensuite sa palette, ses formes dominantes, sa lumière et sa matière.

## 3. Carte graphique des univers

| ID | Nom | Intention visuelle | Mascotte |
|---|---|---|---|
| `world.firefly-forest` | La Forêt des Lucioles | nuit douce, bois, lumière chaude, calme | Luma la luciole |
| `world.dragon-mountain` | La Montagne du Dragon | aube, roche ronde, vapeur, énergie du matin | à concevoir |
| `world.space-station` | La Station Spatiale | journée lumineuse, modules, étoiles, départ | à concevoir |
| `world.elven-village` | Le Village des Lutins | bois, papier, école miniature, curiosité | à concevoir |
| `world.nature-discovery` | nom à définir | végétal, observation, saisons, petites bêtes | à concevoir |
| `world.creative-studio` | nom à définir | couleurs, matières, formes, imagination | à concevoir |

Les deux noms publics provisoires ne doivent pas apparaître dans les noms de fichiers. Les identifiants techniques restent stables.

## 4. Avatars enfants

La première collection comprend six avatars :

```text
avatar.child.3-5.boy
avatar.child.3-5.girl
avatar.child.6-8.boy
avatar.child.6-8.girl
avatar.child.9-10.boy
avatar.child.9-10.girl
```

Exigences :

- silhouette claire en 96 px ;
- proportions différentes selon l’âge ;
- style commun aux six personnages ;
- vêtements non liés à un univers ;
- activités et couleurs non genrées ;
- expressions neutres et accueillantes ;
- lisibilité sur fond clair et sombre ;
- version buste pour les sélecteurs ;
- version corps entier pour les futurs écrans narratifs.

Les options compagnon et couleur de profil ne nécessitent plus aucun asset.

## 5. Mascottes

Chaque univers possède exactement une mascotte principale.

Une mascotte doit rester reconnaissable :

- en silhouette ;
- en taille 96 px ;
- sans texte ;
- dans toutes ses expressions ;
- sur fonds clairs et sombres ;
- sans se confondre avec les avatars enfants.

### Expressions communes

- neutre ;
- heureuse ;
- encourageante ;
- curieuse ;
- surprise ;
- fière ;
- calme ;
- repos.

Aucune expression destinée à culpabiliser l’enfant.

### Poses communes

- accueil ;
- montre une quête ;
- écoute ;
- découvre un objet ;
- célèbre ;
- lit une histoire ;
- se repose.

Chaque mascotte peut ajouter deux poses spécifiques à son univers.

## 6. Construction animable des mascottes

Éléments séparables :

- corps ;
- tête ;
- yeux ;
- paupières ;
- bouche ;
- bras ou ailes ;
- accessoire ;
- ombre ;
- particules propres à l’univers.

Le prototype décide entre :

- SVG articulé ;
- sprites WebP ;
- calques WebP transparents ;
- animation vectorielle dédiée.

La même technique doit être réutilisable sur les six mascottes, sauf décision documentée.

## 7. Couverture des univers

Chaque pavé du carrefour possède :

- couverture principale ;
- miniature de mascotte ;
- version avec zone libre pour la pastille ;
- fallback statique ;
- texte alternatif ;
- cadrage carré et horizontal.

La pastille rouge appartient à l’interface. Elle ne doit jamais être intégrée dans l’image.

## 8. Scènes parallaxes

Chaque univers possède une scène principale déclarative.

### Calques de base

- ciel ou fond ;
- arrière-plan très lointain ;
- relief ou architecture lointaine ;
- plan intermédiaire ;
- sol ;
- bâtiment ou élément central ;
- emplacements débloquables ;
- habitants ;
- mascotte ;
- particules ;
- premier plan ;
- couche d’interaction éventuelle.

### Exigences

- chaque calque possède de la marge hors cadre ;
- aucune couture visible lors d’un léger déplacement ;
- les zones importantes restent dans les zones sûres ;
- chaque scène possède un fallback aplati ;
- le mode mouvements réduits conserve les changements de progression sans parallaxe ;
- les éléments débloqués utilisent des slots stables ;
- un calque peut être remplacé sans changer le code React.

## 9. États de progression

Chaque univers vise au minimum quatre états :

1. découverte ;
2. premiers changements ;
3. univers vivant ;
4. univers enrichi.

Les noms narratifs sont propres à chaque monde.

Une progression peut :

- révéler un calque ;
- ajouter un objet ;
- réveiller un habitant ;
- modifier la lumière ;
- déclencher une réaction de mascotte ;
- ouvrir un chapitre.

Aucun état ne représente une dégradation liée à l’absence de quête.

## 10. Illustrations de quêtes

Une illustration appartient à :

- une famille de quête ;
- une tranche d’âge ;
- un univers.

Elle doit :

- montrer l’action principale ;
- être comprise sans texte ;
- éviter les détails parasites ;
- représenter l’âge de la variante ;
- respecter le contexte de l’univers sans masquer l’action réelle ;
- ne montrer aucun geste dangereux ;
- fonctionner en carte carrée ou verticale ;
- posséder un texte alternatif.

Une même action peut utiliser trois compositions différentes selon l’âge.

## 11. Récompenses

Chaque récompense appartient à un seul univers.

Par univers, prévoir progressivement :

- objets décoratifs ;
- habitants ;
- fragments narratifs ;
- badges non compétitifs ;
- particules de célébration ;
- éléments de scène débloquables.

Une récompense doit indiquer son `worldId` et son `unlockSlotId` éventuel.

## 12. Histoires

Chaque univers possède ses propres chapitres ou découvertes illustrées.

Exigences :

- format commun ;
- texte hors image ;
- illustration lisible en tablette ;
- narration indépendante d’une cadence quotidienne ;
- continuité après une longue pause ;
- aucune menace provoquée par l’enfant.

## 13. Icônes fonctionnelles

Les icônes fonctionnelles restent indépendantes des univers.

Actions principales :

- enfant ;
- parent ;
- univers ;
- écouter ;
- commencer ;
- terminer ;
- demander de l’aide ;
- valider ;
- reporter ;
- modifier ;
- archiver ;
- son ;
- animation ;
- sauvegarde.

Les catégories restent des icônes transversales.

## 14. Formats

### SVG

- icônes ;
- interface ;
- formes simples ;
- mascottes si le prototype articulé est concluant.

### WebP transparent

- avatars ;
- mascottes complexes ;
- illustrations de quêtes ;
- récompenses ;
- habitants ;
- calques parallaxes.

### PNG

- icônes PWA ;
- sources de travail ;
- besoins de compatibilité.

### Audio

- sons très courts ;
- ambiances facultatives ;
- alternative silencieuse systématique.

## 15. Dimensions de référence

- avatar source : 1024 × 1024 px ;
- couverture d’univers : 1200 × 900 px ;
- illustration de quête : 768 × 768 px ;
- récompense : 512 × 512 px ;
- mascotte : 1024 × 1024 px ou vectoriel ;
- scène source : 2048 × 1536 px avec marges parallaxe ;
- chapitre : 1280 × 960 px ;
- icône PWA : 512 × 512 px.

Les zones sûres couvrent smartphone portrait, tablette paysage et bureau.

## 16. Budgets initiaux

- avatar : moins de 180 Ko ;
- couverture : moins de 160 Ko ;
- illustration de quête : moins de 120 Ko ;
- récompense : moins de 100 Ko ;
- pose de mascotte : moins de 180 Ko ;
- calque parallaxe : moins de 250 Ko ;
- fallback de scène : moins de 450 Ko ;
- éléments critiques du carrefour : moins de 1,5 Mo ;
- scène complète : budget séparé par univers ;
- aucun préchargement simultané des six scènes complètes.

## 17. Nommage

```text
<world-id-court>__<famille>__<sujet>__<etat-ou-age>__v<version>.<ext>
```

Exemples :

```text
firefly-forest__mascot__luma__happy__v01.webp
dragon-mountain__cover__main__default__v01.webp
space-station__quest__prepare-bag__6-8__v01.webp
elven-village__scene-layer__schoolhouse__stage-02__v01.webp
nature-discovery__scene__fallback__default__v01.webp
creative-studio__reward__paper-bird__unlocked__v01.webp
avatar__child__girl__3-5__v01.webp
```

Aucun nom public provisoire ne doit entrer dans un chemin stable.

## 18. Registre typé

```ts
interface AssetDefinition {
  id: string
  worldId?: string
  ageBand?: '3-5' | '6-8' | '9-10'
  kind:
    | 'icon'
    | 'avatar'
    | 'quest'
    | 'mascot'
    | 'world-cover'
    | 'world-layer'
    | 'world-fallback'
    | 'reward'
    | 'story'
    | 'audio'
  source: string
  width?: number
  height?: number
  bytesBudget: number
  alt: string
  fallbackId?: string
  preload: boolean
  animationSlots?: string[]
}
```

## 19. Manifeste de scène

Chaque couche déclare :

- asset ;
- profondeur ;
- stade d’apparition ;
- slot éventuel ;
- profil de mouvement ;
- comportement responsive ;
- variante mouvements réduits ;
- priorité de chargement.

Le build refuse une scène sans fallback ou avec une référence inconnue.

## 20. Fallbacks

- avatar neutre compatible avec l’âge ;
- silhouette générique de quête ;
- pose neutre de mascotte ;
- couverture simplifiée ;
- scène aplatie ;
- icône fonctionnelle ;
- texte alternatif.

Un asset manquant ne doit jamais empêcher l’enfant de comprendre ou terminer une quête.

## 21. Ordre de production

### Lot A, système commun

- proportions des avatars et mascottes ;
- langage de formes ;
- contours, lumière et textures ;
- prototype de carte univers ;
- prototype de scène parallaxe ;
- règles de compression.

### Lot B, avatars

- six avatars ;
- bustes et corps entiers ;
- tests à 96 px ;
- validation sur les trois formats d’écran.

### Lot C, couvertures et mascottes

- six couvertures ;
- planche de chaque mascotte ;
- expressions et poses communes ;
- miniatures du carrefour.

### Lot D, prototype parallaxe

- La Forêt des Lucioles complète ;
- calques séparés ;
- Luma animable ;
- mode réduit ;
- fallback ;
- tests de performance.

### Lot E, extension des scènes

- une scène par univers ;
- validation univers par univers ;
- aucun lancement simultané des six productions.

### Lot F, quêtes et récompenses

- matrice 30 familles × 3 âges ;
- illustrations ;
- récompenses ;
- textes alternatifs ;
- intégration au registre.

### Lot G, histoires

- chapitres ;
- illustrations ;
- réactions de mascotte ;
- sons éventuels.

## 22. Processus de validation

1. planche de concept ;
2. sélection du style ;
3. normalisation ;
4. découpage animable ;
5. test à taille réelle ;
6. test mouvements réduits ;
7. compression ;
8. enregistrement au registre ;
9. validation automatique ;
10. validation humaine ;
11. production du lot suivant.

Cette méthode garde six univers dans le même livre illustré, sans les transformer en six applications cousues ensemble au ruban adhésif.
