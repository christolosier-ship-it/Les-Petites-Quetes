# Bible des assets

## 1. Finalité

Créer un univers visuel cohérent, animé et durable avant de produire les images en volume.

Aucun asset final ne doit être généré tant que :

- le style n’est pas validé sur une planche de référence ;
- les proportions de la mascotte ne sont pas fixées ;
- les formats et budgets ne sont pas définis ;
- les éléments à animer ne sont pas séparés ;
- les conventions de nommage ne sont pas appliquées.

## 2. Direction visuelle initiale

Univers de travail : **La Forêt des Lucioles**.

Intentions :

- album jeunesse contemporain ;
- formes arrondies et lisibles ;
- textures légères ;
- couleurs chaleureuses ;
- expressions franches ;
- détails suffisants pour émerveiller sans surcharger les petits écrans ;
- absence de réalisme inquiétant ;
- décors accueillants de jour comme de soir.

## 3. Mascotte principale

Nom provisoire : **Lumo**, petit gardien de lucioles.

La mascotte doit rester reconnaissable :

- en silhouette ;
- en taille 96 px ;
- sans texte ;
- dans toutes les expressions ;
- sur fonds clairs et sombres.

### Expressions V1

- neutre ;
- heureux ;
- encourageant ;
- curieux ;
- surpris ;
- fier ;
- calme ;
- endormi.

Aucune expression de tristesse destinée à culpabiliser l’enfant.

### Poses V1

- debout ;
- salutation ;
- montre une quête ;
- tient une luciole ;
- découvre un objet ;
- lit une histoire ;
- se repose.

## 4. Construction animable

Pour les animations importantes, la mascotte ne doit pas être une image aplatie unique.

Éléments potentiellement séparés :

- corps ;
- tête ;
- yeux ;
- paupières ;
- bouche ;
- bras gauche ;
- bras droit ;
- accessoire ;
- ombre ;
- particules de lucioles.

La méthode exacte pourra utiliser :

- SVG articulé ;
- sprites WebP ;
- calques PNG/WebP positionnés ;
- animation vectorielle dédiée si le bénéfice justifie la dépendance.

Le choix sera validé par un prototype avant production de toutes les poses.

## 5. Décor évolutif

Le monde initial possède quatre états principaux :

1. Clairière endormie
2. Premières lumières
3. Village réveillé
4. Forêt illuminée

Chaque état réutilise une base commune et ajoute des éléments débloqués.

Calques recommandés :

- ciel ;
- arrière-plan ;
- végétation lointaine ;
- sol ;
- maison ou arbre central ;
- emplacements d’objets ;
- habitants ;
- particules ;
- premier plan ;
- couche d’interaction.

## 6. Illustrations de quêtes

La V1 vise environ 40 illustrations couvrant les modèles intégrés.

Une illustration de quête doit :

- montrer l’action principale ;
- éviter les détails parasites ;
- être compréhensible sans texte ;
- ne pas montrer de geste dangereux ;
- représenter des enfants variés ;
- fonctionner dans une carte carrée ou légèrement verticale ;
- posséder un texte alternatif.

Exemples de familles :

- dents et toilette ;
- vêtements et pyjama ;
- jouets et chambre ;
- table et repas ;
- plantes et jardin ;
- animaux familiers ;
- créativité ;
- lecture ;
- découverte extérieure ;
- émotions et calme ;
- aide familiale ;
- préparation de sortie.

## 7. Récompenses V1

Prévoir au minimum :

- 12 objets décoratifs ;
- 6 habitants ou animaux ;
- 8 fragments narratifs illustrés ;
- 10 badges non compétitifs ;
- 6 types de particules ou petites célébrations.

## 8. Icônes fonctionnelles

Les icônes fonctionnelles doivent rester distinctes des illustrations narratives.

Catégories :

- autonomie ;
- hygiène ;
- famille ;
- créativité ;
- découverte ;
- bien-être ;
- gentillesse ;
- aventure.

Actions :

- écouter ;
- commencer ;
- terminer ;
- demander de l’aide ;
- valider ;
- reporter ;
- modifier ;
- archiver ;
- parent ;
- enfant ;
- son ;
- animation ;
- sauvegarde.

## 9. Formats

### SVG

À privilégier pour :

- icônes ;
- formes simples ;
- éléments d’interface ;
- mascotte articulée si le prototype est concluant.

### WebP transparent

À privilégier pour :

- illustrations peintes ;
- poses complexes ;
- récompenses ;
- habitants ;
- éléments de décor.

### PNG

Réservé à :

- icônes PWA requises ;
- besoins de compatibilité ;
- sources de travail avant conversion.

### Audio

Formats de diffusion courts et compressés. Chaque son doit avoir une alternative silencieuse.

## 10. Dimensions de référence

Budgets initiaux à confirmer par prototype :

- icône PWA : 512 × 512 px ;
- illustration de quête source : 768 × 768 px ;
- récompense : 512 × 512 px ;
- pose de mascotte : 1024 × 1024 px ou équivalent vectoriel ;
- décor principal : 1920 × 1080 px avec zones sûres responsive ;
- chapitre illustré : 1280 × 960 px ;
- miniature : générée à partir de la source lors du build lorsque possible.

## 11. Budgets de poids

Objectifs de départ :

- icône fonctionnelle : moins de 20 Ko ;
- illustration de quête : moins de 120 Ko ;
- récompense : moins de 100 Ko ;
- pose de mascotte : moins de 180 Ko ;
- décor par calque : moins de 250 Ko ;
- asset initial critique total : moins de 1,5 Mo ;
- univers complet chargé à la demande.

Les budgets seront vérifiés automatiquement.

## 12. Nommage

Format :

```text
<univers>__<famille>__<sujet>__<etat>__v<version>.<ext>
```

Exemples :

```text
firefly-forest__mascot__lumo__happy__v01.webp
firefly-forest__quest__brush-teeth__default__v01.webp
firefly-forest__reward__lantern__unlocked__v01.webp
ui__category__creativity__default__v01.svg
```

Les noms de fichiers restent sans espaces, accents ni majuscules.

## 13. Registre

Chaque asset doit être déclaré dans un manifeste typé :

```ts
interface AssetDefinition {
  id: string
  kind: 'icon' | 'quest' | 'mascot' | 'world' | 'reward' | 'story' | 'audio'
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

Aucun composant ne référence directement un chemin de fichier.

## 14. Fallbacks

- silhouette générique de quête ;
- pose neutre de mascotte ;
- décor sans élément optionnel ;
- icône fonctionnelle simple ;
- texte alternatif toujours présent.

Un asset manquant ne doit jamais empêcher l’enfant de comprendre ou terminer une quête.

## 15. Premier paquet à produire

### Lot A, validation du style

- planche de la mascotte ;
- 8 expressions ;
- 4 poses ;
- palette ;
- objets de référence ;
- un écran de monde ;
- 3 illustrations de quêtes très différentes.

### Lot B, prototype animé

- mascotte découpée ;
- clignement ;
- respiration ;
- salutation ;
- réaction de récompense ;
- particules de lucioles.

### Lot C, monde V1

- quatre états du décor ;
- objets débloquables ;
- habitants ;
- éléments de premier plan ;
- variations jour, soir si retenues.

### Lot D, bibliothèque de quêtes

- 40 illustrations ;
- miniatures ;
- textes alternatifs ;
- contrôles de cohérence.

### Lot E, application

- icônes PWA ;
- onboarding ;
- écrans vides ;
- erreurs douces ;
- récompenses ;
- chapitres.

## 16. Processus de validation

1. Générer une planche de concept, pas des fichiers isolés.
2. Valider le style et la silhouette.
3. Extraire les designs choisis.
4. Normaliser proportions, palette et contours.
5. Préparer les calques animables.
6. Tester à taille réelle sur smartphone.
7. Convertir et compresser.
8. Enregistrer dans le manifeste.
9. Lancer les validations automatiques.
10. Produire le lot suivant uniquement après validation.

Cette méthode évite une ménagerie graphique où chaque personnage semble venir d’un livre différent.