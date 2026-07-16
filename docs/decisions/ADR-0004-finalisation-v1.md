# ADR-0004 — Finalisation fonctionnelle de la V1

## Statut

Accepté avec la finalisation fonctionnelle issue de l’audit de conformité.

## Contexte

La première boucle familiale était utilisable, mais l’audit a identifié plusieurs écarts avant un pilote réel : validation superficielle des imports, écritures concurrentes possibles, migrations sans restauration accessible, mise à jour PWA fragile et parcours parent ou enfant incomplets.

Les illustrations définitives, les icônes finales, la mascotte animée et les tableaux parallaxes restent volontairement hors de cette décision. Ils pourront remplacer les ressources provisoires par le registre d’assets sans modifier le domaine métier.

## Schéma familial V2

Le schéma V2 ajoute :

- `onboardingCompleted` ;
- `celebrationDurationSeconds` ;
- `acknowledgedRewardGrantIds` pour présenter une récompense validée par un adulte au prochain passage de l’enfant.

Une migration réelle transforme les états V1. Les récompenses déjà obtenues sont marquées comme présentées afin de ne pas rejouer toutes les anciennes célébrations.

## Validation et import

Chaque état chargé ou importé est hydraté et validé à l’exécution :

- structure et métadonnées de chaque entité ;
- identifiants uniques ;
- références entre profils, modèles, planifications, occurrences, réalisations et récompenses ;
- unicité des occurrences et des récompenses principales ;
- cohérence de la progression reconstruite depuis les récompenses ;
- profil actif et réglages ;
- contenu familial limité aux modèles personnalisés.

Un import invalide ne modifie jamais l’état courant.

## Persistance

IndexedDB conserve trois stores :

- `familyState` : snapshot familial courant ;
- `familyBackups` : sauvegardes automatiques restaurables ;
- `migrationJournal` : journal minimal des migrations terminées.

Une migration sauvegarde l’ancien état avant remplacement. Un import ou une restauration enregistre également l’état courant et le nouvel état dans une même transaction IndexedDB.

Les mutations applicatives passent par `StateCommitQueue`. Elles sont calculées et persistées dans l’ordre, puis publiées dans React uniquement après réussite de l’écriture. Une écriture refusée ne laisse donc pas l’interface afficher un état non sauvegardé.

## Parcours fonctionnels

La V1 finalisée comprend :

- onboarding guidé ;
- profils complets, archivables et restaurables ;
- modèles intégrés planifiables ou personnalisables ;
- modèles familiaux modifiables, archivables et réutilisables ;
- planifications multi-enfants, ponctuelles ou hebdomadaires ;
- heure, date de fin, priorité, pause, reprise, modification et duplication ;
- validation immédiate, parent ou ensemble ;
- récompense différée après validation adulte ;
- distinction neutre des quêtes facultatives ;
- étapes présentées une par une aux 3 à 5 ans ;
- sauvegardes automatiques consultables et restaurables ;
- effets sonores courts et réduction des mouvements réellement appliquée.

## PWA

Le service worker est généré après le build depuis les fichiers présents dans `dist`. Il précache donc les bundles JavaScript et CSS exacts de la version construite.

Une nouvelle version reste en attente jusqu’à une action volontaire. Le fallback vers `index.html` est réservé aux navigations et n’est jamais utilisé à la place d’un asset JavaScript ou CSS.

## Stratégie de tests

Les couches pures et migrables sont mesurées par la couverture unitaire : domaine, services applicatifs, migrations, sauvegardes et validation runtime.

Les adaptateurs dépendant réellement du navigateur, notamment IndexedDB, le contrôleur React, le service worker et le responsive, sont exercés dans Chrome sur :

- mobile ;
- tablette ;
- bureau ;
- rechargement persistant ;
- fonctionnement hors ligne.

Cette répartition évite les faux tests d’IndexedDB tout en conservant une validation dynamique de bout en bout.

## Conséquences

La V1 fonctionnelle est prête pour sa phase graphique puis pour un pilote familial accompagné. Le prochain chantier produit porte sur les assets définitifs, les icônes, la mascotte et les scènes parallaxes, sans modification des règles métier stabilisées ici.
