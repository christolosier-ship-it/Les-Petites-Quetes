# Cahier des charges cible multi-univers

## 1. Objet

Les Petites Quêtes doit permettre à un adulte de préparer des quêtes simples et à un enfant de les découvrir, les accomplir puis faire évoluer l’univers narratif auquel elles appartiennent.

L’application reste locale, privée, installable et utilisable hors ligne. Le changement multi-univers constitue le prochain cycle fonctionnel après la V1 technique existante.

## 2. Périmètre utilisateur

### Espace parent

Le parent peut :

- créer, modifier, archiver et restaurer plusieurs profils enfants ;
- choisir un prénom ou pseudonyme, une tranche d’âge, un niveau de lecture et un avatar compatible ;
- créer une quête depuis une famille de quête ou depuis zéro ;
- choisir obligatoirement l’univers d’une quête personnalisée ;
- planifier une quête ponctuelle ou récurrente ;
- attribuer une quête à un ou plusieurs enfants ;
- vérifier la compatibilité de chaque variante d’âge ;
- définir si la validation adulte est nécessaire ;
- consulter les quêtes prévues, terminées, ignorées ou reportées ;
- valider ou demander une petite étape supplémentaire ;
- consulter la progression de chaque enfant par univers ;
- régler le son, la voix, les animations et la durée des célébrations ;
- exporter et importer une sauvegarde complète ;
- protéger l’espace parent par un code local.

Les options compagnon et couleur sont supprimées.

### Espace enfant

L’enfant peut :

- sélectionner son profil si plusieurs profils existent ;
- voir les six univers ;
- connaître le nombre de quêtes disponibles dans chaque univers ;
- ouvrir un univers et sa scène évolutive ;
- consulter uniquement les quêtes compatibles avec son âge ;
- écouter la consigne ;
- ouvrir une quête et voir ses étapes ;
- signaler qu’il a terminé ;
- attendre ou demander la validation d’un adulte ;
- découvrir une récompense appartenant au même univers ;
- consulter le trésor et l’histoire de chaque univers.

## 3. Accueil familial

L’écran principal comporte deux fenêtres.

### Fenêtre enfant

- position gauche sur tablette et ordinateur ;
- ouvre directement le profil unique ;
- ouvre le sélecteur de profils s’il existe plusieurs enfants ;
- utilise les avatars, sans comparaison de progression.

### Fenêtre parent

- position droite sur tablette et ordinateur ;
- ouvre le verrou parent ;
- ne montre aucune donnée familiale détaillée avant déverrouillage.

Sur smartphone étroit, les deux fenêtres peuvent être empilées sans créer un troisième niveau de navigation.

## 4. Profils et avatars

Le profil contient :

- prénom ou pseudonyme ;
- tranche d’âge `3-5`, `6-8` ou `9-10` ;
- niveau de lecture ;
- avatar ;
- statut d’archivage.

Collection initiale :

- garçon 3-5 ans ;
- fille 3-5 ans ;
- garçon 6-8 ans ;
- fille 6-8 ans ;
- garçon 9-10 ans ;
- fille 9-10 ans.

Un avatar incompatible avec la tranche d’âge ne peut pas être enregistré.

L’avatar enfant est distinct de la mascotte d’un univers.

## 5. Univers

Le produit cible six univers.

| Univers | Quêtes principales |
|---|---|
| La Forêt des Lucioles | soirée, calme et coucher |
| La Montagne du Dragon | réveil, toilette, habillage et matin |
| La Station Spatiale | sorties, trajet et activités de journée |
| Le Village des Lutins | école, cartable, lecture et devoirs |
| Univers nature, nom à définir | jardin, observation, animaux et découverte |
| Univers créativité, nom à définir | dessin, musique, construction et imagination |

Chaque univers possède :

- une définition stable ;
- une mascotte ;
- une couverture ;
- une scène parallaxe ;
- plusieurs états de progression ;
- des récompenses ;
- des habitants ou objets ;
- une histoire ou une suite de découvertes ;
- un fallback statique.

## 6. Carrefour des univers

Après le choix du profil, un pavé est affiché pour chaque univers.

Chaque pavé présente :

- couverture ;
- nom ;
- mascotte ;
- aperçu du stade actuel ;
- nombre de quêtes disponibles.

La pastille de disponibilité :

- est rouge ;
- contient un chiffre ;
- est absente lorsque le nombre vaut zéro ;
- ne compte que les occurrences réellement disponibles ;
- ne représente jamais un retard ou un échec ;
- possède un libellé accessible.

## 7. Tranches d’expérience

### 3 à 5 ans

- navigation principalement visuelle ;
- une à trois quêtes visibles par univers ;
- consignes de 4 à 12 mots ;
- une étape à la fois ;
- validation adulte par défaut ;
- aucune notion numérique abstraite nécessaire.

### 6 à 8 ans

- textes courts ;
- plusieurs quêtes visibles ;
- jusqu’à trois étapes ;
- choix facultatifs ;
- progression narrative explicite.

### 9 à 10 ans

- consignes plus détaillées ;
- petits projets ;
- étapes et durée indicative ;
- autonomie renforcée ;
- validation adulte paramétrable.

## 8. Modèle éditorial d’une quête

Une quête intégrée est composée d’une famille et de variantes d’âge.

### Famille de quête

- identifiant stable ;
- univers obligatoire ;
- intention réelle ;
- catégories transversales ;
- besoin éventuel d’un adulte ;
- récompense du même univers ;
- statut d’archivage.

### Variante d’âge

- identifiant stable ;
- tranche d’âge ;
- niveau de lecture ;
- titre narratif ;
- action réelle ;
- consigne ;
- étapes ;
- durée ;
- illustration ;
- texte alternatif ;
- éventuelle variante douce.

Une famille de quête intégrée doit posséder au moins une variante. Le catalogue complet vise une variante pour chaque tranche d’âge.

## 9. Catégories

Les catégories restent utiles pour rechercher ou filtrer :

- autonomie ;
- hygiène ;
- participation familiale ;
- créativité ;
- découverte ;
- bien-être ;
- gentillesse ;
- aventure spéciale.

Une catégorie peut apparaître dans plusieurs univers. Elle ne détermine jamais la progression.

## 10. Planification

Une quête peut être :

- disponible immédiatement ;
- planifiée à une date ;
- récurrente certains jours ;
- liée à un moment de la journée ;
- suspendue ;
- dupliquée.

Une planification multi-enfants résout la variante d’âge individuellement lors de la génération de chaque occurrence.

L’enregistrement est refusé lorsqu’un enfant ciblé ne possède aucune variante compatible.

## 11. Occurrence

Une occurrence mémorise notamment :

- planification ;
- enfant ;
- famille de quête ;
- variante d’âge ;
- univers ;
- date locale ;
- statut ;
- validation ;
- réalisation éventuelle.

Le snapshot de l’univers et de la variante préserve l’historique lorsque les contenus évoluent.

## 12. Cycle de vie

```text
À venir → Disponible → Commencée → Validation demandée → Terminée
                         ↘ Reportée
                         ↘ Ignorée
```

Règles :

- une occurrence passée non réalisée n’est jamais qualifiée d’échec ;
- aucune série n’est cassée ;
- aucune récompense déjà obtenue n’est retirée ;
- un refus de validation renvoie vers un état neutre ;
- une réalisation ne peut être comptée qu’une fois.

## 13. Validation et récompense

Types :

- validation immédiate par l’enfant ;
- validation adulte ;
- validation ensemble.

Une récompense :

- appartient au même univers que la quête ;
- est attribuée une seule fois ;
- fait progresser uniquement cet univers ;
- peut être présentée immédiatement ou au prochain passage enfant.

## 14. Progression par univers

Chaque enfant possède une progression indépendante dans chaque univers.

La progression peut débloquer :

- états de scène ;
- calques parallaxes ;
- objets ;
- habitants ;
- réactions de mascotte ;
- chapitres ;
- badges non compétitifs.

Aucune progression globale chiffrée ne compare les univers ou les enfants.

## 15. Scènes parallaxes

Les scènes sont décrites par des manifestes de contenu.

Chaque manifeste définit :

- calques et profondeurs ;
- format et zones sûres ;
- paliers de progression ;
- emplacements débloquables ;
- ancres de mascotte ;
- mouvements légers ;
- mode réduit ;
- fallback statique.

Une quête reste réalisable si les calques animés ne sont pas disponibles.

## 16. Bibliothèque initiale cible

Le premier pack multi-univers complet vise :

- 6 univers ;
- 5 familles minimum par univers ;
- 3 variantes d’âge par famille ;
- 30 familles minimum ;
- 90 variantes minimum.

Les 40 modèles actuels doivent être audités et redistribués. La quantité finale pourra augmenter sans modifier le modèle.

## 17. Écrans enfant

1. Accueil familial en deux fenêtres
2. Sélection du profil
3. Carrefour des univers
4. Intérieur d’un univers
5. Quêtes de l’univers
6. Détail d’une quête
7. Validation demandée
8. Récompense
9. Trésor de l’univers
10. Histoire de l’univers

## 18. Écrans parent

1. Verrou parent
2. Tableau de bord
3. Profils enfants simplifiés
4. Bibliothèque filtrée par univers et âge
5. Familles et variantes de quêtes
6. Planification
7. Routines
8. Demandes de validation
9. Progressions par univers
10. Sauvegardes et réglages
11. Revue des quêtes personnalisées migrées

## 19. Audio et accessibilité

- chaque consigne peut être lue à voix haute ;
- aucune fonction essentielle ne dépend du son ;
- grandes zones tactiles ;
- contraste suffisant ;
- textes alternatifs ;
- pastilles compréhensibles sans la couleur seule ;
- navigation clavier dans l’espace parent ;
- mouvements réduits ;
- aucun délai bloquant.

## 20. Stockage et schéma V3

Le schéma cible V3 ajoute :

- définitions d’univers versionnées ;
- univers obligatoire sur les familles de quête ;
- variantes d’âge ;
- univers et variante dans les occurrences ;
- progression par enfant et univers ;
- avatars contraints par âge ;
- suppression des champs compagnon, couleur et univers actif.

## 21. Migration V2 vers V3

La migration doit :

- créer une sauvegarde ;
- convertir les profils ;
- préserver toutes les réalisations ;
- répartir les contenus intégrés par table explicite ;
- conserver l’historique incertain dans son univers actuel ;
- signaler les quêtes personnalisées à revoir ;
- valider la cohérence avant remplacement.

## 22. PWA et chargement

- shell, avatars, couvertures et contenus textuels précachés ;
- scènes lourdes chargées par univers ;
- mise en cache après première ouverture ;
- fallback statique hors ligne ;
- aucun écran blanc si un asset manque ;
- budgets par univers contrôlés au build.

## 23. Confidentialité et sécurité

- aucun compte enfant ;
- aucune publicité ou télémétrie ;
- aucune localisation ;
- aucune comparaison ;
- prénom ou pseudonyme suffisant ;
- suppression totale accessible au parent ;
- aucune mascotte triste à cause d’une quête non réalisée.

## 24. Exigences de qualité

Le dépôt doit ajouter des contrôles pour :

- quête sans univers ;
- variante d’âge absente ou dupliquée ;
- attribution incompatible avec l’âge ;
- récompense d’un autre univers ;
- progression croisée ;
- manifeste parallaxe incomplet ;
- fallback absent ;
- pastille incorrecte ;
- migration V2 vers V3 ;
- chargement différé et hors ligne.

## 25. Hors périmètre du prochain cycle

- synchronisation familiale ;
- comptes en ligne ;
- classement ;
- amis ou chat ;
- géolocalisation ;
- publicité et achats intégrés ;
- intelligence artificielle ;
- analyse automatique d’images ou d’émotions ;
- création procédurale d’univers ;
- boutique de récompenses.

## 26. Critères d’acceptation

Le recalage multi-univers est acceptable lorsque :

- l’accueil comporte les deux fenêtres enfant et parent ;
- les six univers sont visibles pour chaque enfant ;
- les pastilles reflètent exactement les quêtes disponibles ;
- chaque quête possède un univers ;
- chaque enfant reçoit une variante compatible avec son âge ;
- une réalisation ne fait progresser que le bon univers ;
- les profils n’affichent plus compagnon ni couleur ;
- les six avatars initiaux sont disponibles ;
- la migration V2 vers V3 préserve l’historique ;
- chaque scène fonctionne avec mouvements réduits et fallback ;
- les parcours principaux passent sur mobile, tablette et ordinateur.
