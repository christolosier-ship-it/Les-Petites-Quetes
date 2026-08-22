# Parcours utilisateurs

## 1. Statut

Ce document décrit les parcours effectivement proposés par l’application actuelle.

Les évolutions non encore livrées sont suivies dans `ROADMAP.md` et ne sont pas décrites ici comme des écrans existants.

## 2. Premier lancement

1. L’application charge ou crée l’état familial local.
2. Si l’onboarding n’est pas terminé, le parcours de démarrage s’ouvre.
3. Le parent crée le premier profil enfant avec prénom ou pseudonyme, tranche d’âge, niveau de lecture et avatar compatible.
4. Il choisit un code parent à quatre chiffres.
5. Il choisit le mode de validation par défaut.
6. Il sélectionne entre une et trois premières quêtes suggérées.
7. Ces quêtes sont planifiées immédiatement pour le premier enfant.
8. L’onboarding est marqué comme terminé et l’espace enfant peut s’ouvrir.

Aucun compagnon ni couleur de profil n’est demandé.

## 3. Accueil familial

Une fois l’onboarding terminé, l’accueil permet d’ouvrir :

- l’espace enfant ;
- l’espace parent.

L’espace parent reste verrouillé tant que le code local n’a pas été validé.

## 4. Choisir un enfant

Dans l’espace enfant :

- s’il existe un seul profil actif, il devient le profil courant ;
- s’il existe plusieurs profils actifs, leurs avatars et prénoms sont affichés dans un sélecteur ;
- toucher un profil le rend actif et ramène au carrefour des univers.

Aucun score comparatif n’est affiché entre enfants.

## 5. Carrefour des univers

Le carrefour affiche les six mondes du catalogue.

Pour chaque monde :

- le renderer de scène fournit l’aperçu ;
- le nom, la mascotte et le focus sont affichés ;
- le stade de progression de l’enfant est utilisé ;
- une pastille apparaît uniquement lorsqu’au moins une occurrence de ce monde est actuellement au statut `available`.

La pastille indique donc des quêtes prêtes maintenant, pas un retard.

Toucher un pavé ouvre l’espace de ce monde.

## 6. Espace d’un monde

Chaque monde possède trois onglets enfant :

1. **Mon univers** ;
2. **Mes quêtes** ;
3. **Mon trésor**.

L’en-tête permet aussi de revenir :

- à l’accueil familial ;
- au carrefour de tous les univers.

### Mon univers

Affiche la scène du monde selon la progression de l’enfant.

### Mes quêtes

Affiche les occurrences pertinentes de cet enfant et de cet univers et permet de suivre leur cycle de réalisation.

### Mon trésor

Affiche :

- les récompenses débloquées de ce monde ;
- les chapitres d’histoire débloqués de ce monde.

Une récompense ou un chapitre d’un autre univers ne doit pas apparaître ici.

## 7. Réaliser une quête

Le cycle métier d’une occurrence utilise les statuts :

```text
upcoming
→ available
→ started
→ validation-requested
→ completed
```

Selon l’action de la famille, une occurrence peut aussi devenir :

```text
postponed
ignored
```

Le vocabulaire visible doit rester neutre. Une quête non faite n’est pas transformée en échec ou en dette.

## 8. Validation

Selon le mode configuré :

- l’enfant peut terminer directement ;
- une validation parent peut être demandée ;
- la réalisation peut être validée ensemble.

L’espace parent, onglet **Aujourd’hui**, centralise les actions liées aux occurrences et validations courantes.

Une réalisation validée :

1. crée une `Completion` ;
2. crée une seule attribution principale de récompense ;
3. recalcule la progression de l’enfant dans le monde de la récompense ;
4. rend la célébration disponible côté enfant.

## 9. Célébration

Lorsqu’une récompense attribuée n’a pas encore été reconnue par l’enfant, une célébration peut être affichée dans l’espace enfant.

Le parent règle sa durée sur :

- 3 secondes ;
- 5 secondes ;
- 8 secondes.

Après reconnaissance, l’ID de l’attribution est conservé dans `acknowledgedRewardGrantIds` pour éviter de rejouer la même célébration indéfiniment.

## 10. Ouvrir l’espace parent

1. Depuis l’accueil, le parent ouvre son espace.
2. Si nécessaire, `ParentLock` demande le code à quatre chiffres.
3. Après déverrouillage, cinq onglets sont disponibles :
   - Aujourd’hui ;
   - Quêtes ;
   - Enfants ;
   - Univers ;
   - Réglages.
4. Le bouton **Verrouiller** referme explicitement l’espace parent.

## 11. Bibliothèque de quêtes

Dans **Quêtes > Bibliothèque** :

- le parent choisit une tranche d’âge ;
- il peut filtrer par univers ;
- il peut filtrer par catégorie ;
- le catalogue annonce 30 familles et 90 variantes ;
- chaque carte correspond à un `QuestTemplate` adapté à la tranche d’âge sélectionnée.

Depuis une carte, le parent peut :

- **Préparer** le template ;
- **Personnaliser** le template intégré pour créer une version familiale.

## 12. Créer une quête personnalisée

Depuis **Créer depuis zéro** ou depuis la personnalisation d’un modèle intégré :

1. le parent remplit le modèle de quête ;
2. il choisit notamment l’univers et les tranches d’âge concernées ;
3. il remplit ensuite la planification ;
4. au moins une tranche d’âge et un enfant sont requis ;
5. l’application crée un `QuestTemplate` personnalisé ;
6. elle crée immédiatement la planification associée.

Le modèle courant ne demande pas de créer trois entités séparées de variantes d’âge pour une quête personnalisée.

## 13. Gérer les modèles familiaux

Dans **Quêtes > Mes modèles** :

- les quêtes personnalisées peuvent être gérées ;
- les anciennes quêtes migrées nécessitant une vérification d’univers sont signalées ;
- le parent peut ouvrir une quête concernée et corriger son classement pour les usages futurs.

L’historique déjà produit n’est pas déplacé silencieusement.

## 14. Gérer les routines

Dans **Quêtes > Routines**, le parent gère les planifications existantes.

Une planification peut notamment être suspendue puis reprise. La suspension empêche la production attendue de nouvelles occurrences sans effacer l’historique ni la progression acquise.

## 15. Gérer les enfants

Dans l’onglet **Enfants** :

- création de profils ;
- modification des informations ;
- changement de tranche d’âge ;
- choix d’un avatar compatible ;
- archivage et restauration selon les actions disponibles.

La validation runtime protège également la cohérence avatar-âge lors du chargement des données.

## 16. Consulter les univers côté parent

L’onglet **Univers** présente la progression familiale par monde.

La donnée de référence est `WorldProgress`, identifiée par le couple enfant-univers et validée contre l’historique des récompenses attribuées.

## 17. Réglages de confort

L’onglet **Réglages** permet actuellement de modifier :

- activation de la narration ;
- activation des effets sonores ;
- politique de mouvements `system`, `reduce` ou `allow` ;
- durée de célébration.

Le mode `reduce` neutralise les déplacements décoratifs qui ne sont pas nécessaires à la compréhension.

## 18. Exporter les données

Dans **Réglages > Sauvegarder et restaurer** :

1. le parent télécharge un fichier JSON ;
2. ce fichier contient les données familiales privées nécessaires à la restauration ;
3. l’interface rappelle explicitement le caractère privé de cette sauvegarde.

Le fichier reste local : aucun compte cloud n’est nécessaire.

## 19. Importer une sauvegarde

1. Le parent choisit un fichier JSON.
2. Une prévisualisation affiche le nombre de profils, planifications et réalisations détectés.
3. Le parent confirme le remplacement.
4. Le contenu passe par la logique de migration et validation.
5. L’ancien état est conservé en sauvegarde avant remplacement.
6. Si le fichier est invalide, il ne devient pas l’état familial courant.

## 20. Restaurer une sauvegarde automatique

Les sauvegardes automatiques disponibles sont listées avec leur raison et leur date.

Lors d’une restauration :

1. le parent choisit une sauvegarde ;
2. il confirme ;
3. l’état actuel est lui-même sauvegardé sous la raison `before-restore` ;
4. la sauvegarde choisie est migrée/validée puis restaurée.

## 21. Changer le code parent

Le parent saisit un nouveau code de quatre chiffres et l’enregistre.

Le code protège une séparation d’interface locale. Il ne constitue pas un système de compte distant.

## 22. Supprimer les données locales

Dans la zone de suppression totale :

1. le parent doit écrire `SUPPRIMER` ;
2. le bouton d’effacement devient disponible ;
3. les données locales de l’application sont supprimées.

Cette action doit rester volontaire et difficile à déclencher par erreur.

## 23. Utilisation hors ligne

Après chargement et mise en cache des ressources nécessaires :

- la navigation applicative ne dépend pas d’un backend ;
- les données métier restent dans IndexedDB ;
- le service worker fournit les ressources locales mises en cache ;
- une scène lourde chargée dynamiquement est mise en cache à sa première récupération ;
- aucune image essentielle de La Forêt ne dépend d’un hôte externe.

## 24. La Forêt des Lucioles

Dans La Forêt :

- le diorama illustré local est rendu par `FireflyForestDiorama` ;
- la couche Three.js est chargée à la demande ;
- la scène peut être agrandie hors mode compact ;
- les quatre stades modifient le rendu ;
- les mouvements réduits sont respectés ;
- un fallback visuel existe pendant le chargement de la couche Three.js.

Les autres mondes passent actuellement par le renderer parallaxe générique.

## 25. Ce qui n’est pas un parcours actuel

Les éléments suivants ne doivent pas être décrits comme déjà livrés :

- compte utilisateur distant ;
- synchronisation familiale cloud ;
- boutique ;
- classement ;
- réseau social ;
- géolocalisation ;
- routeur URL complet par écran ;
- éditeur de trois entités `QuestVariant` persistantes ;
- production graphique finale des six mondes.

Les évolutions retenues ultérieurement seront ajoutées ici uniquement lorsqu’elles deviendront de vrais parcours.
