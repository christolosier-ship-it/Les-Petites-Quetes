# ADR-0003 — Intégration de la V1 utilisable

## Statut

Proposé avec la V1 fonctionnelle de bout en bout.

## Contexte

Les fondations, les profils, les modèles de quêtes, la validation, les planifications et la génération d’occurrences sont déjà séparés et testés. Pour accélérer l’obtention d’un produit utilisable, les phases persistance, interfaces, progression, contenu et stabilisation sont regroupées dans une seule PR.

Ce regroupement ne modifie pas les frontières d’architecture : il regroupe la livraison, pas les responsabilités du code.

## Persistance

- La V1 utilise IndexedDB derrière `FamilyRepository`.
- Le repository conserve un snapshot familial cohérent et des sauvegardes avant import.
- Les composants et pages n’accèdent jamais directement à IndexedDB.
- Une migration pure valide chaque état chargé ou importé.
- L’import est entièrement validé avant remplacement.
- Les enregistrements métier gardent leurs identifiants, révisions et tombstones.
- Un environnement sans IndexedDB utilise un repli mémoire non persistant, utile aux tests et aux navigateurs atypiques.

Le snapshot pourra être éclaté en stores spécialisés sans changer le domaine ni les écrans.

## Contrôleur applicatif

- `useFamilyApp` orchestre le chargement, les commandes et la sauvegarde.
- Chaque mutation produit un nouvel état cohérent avant persistance.
- L’interface reçoit des actions métier, jamais le repository.
- Les planifications sont actualisées au lancement sur une fenêtre de quatorze jours.

## Progression

- Une occurrence terminée crée au maximum une `Completion` et un `RewardGrant`.
- La progression est reconstruite depuis les récompenses attribuées.
- Aucune série quotidienne ou compteur d’échec n’existe.
- Les quatre états du monde sont débloqués à 0, 2, 6 et 12 réalisations.
- Les chapitres dépendent uniquement du nombre total de réalisations, jamais de leur régularité.

## Expérience parent

L’espace parent comprend cinq destinations :

1. Aujourd’hui ;
2. Quêtes ;
3. Enfants ;
4. Monde ;
5. Réglages.

Il permet la création et modification des profils, la bibliothèque de quarante modèles, les quêtes personnalisées, les planifications, les validations, les reports, l’ignorance neutre, les préférences et la sauvegarde.

Le code parent est une séparation locale d’usage, pas une protection cryptographique.

## Expérience enfant

L’espace enfant conserve trois destinations :

1. Monde ;
2. Quêtes ;
3. Trésor.

Le parcours principal reste limité à ouvrir une quête, la comprendre ou l’écouter, puis signaler sa réalisation. L’application renvoie rapidement vers l’action réelle.

## Contenu et assets

- La V1 contient quarante modèles répartis entre huit catégories.
- La Forêt des Lucioles comprend douze récompenses, huit chapitres et quatre états.
- Les visuels inclus constituent un kit vectoriel provisoire cohérent.
- Ils ne remplacent pas la validation graphique prévue par `ASSET-BIBLE.md`.
- Tous les identifiants passent néanmoins par le registre typé afin que les futurs assets définitifs puissent remplacer les placeholders sans modifier les composants.

## Tests de sortie

La PR doit valider :

- domaine, migrations, sauvegarde et progression ;
- création du premier profil dans React ;
- parcours Chrome mobile complet ;
- création d’une quête depuis la bibliothèque ;
- réalisation, validation et récompense ;
- persistance après rechargement ;
- rechargement hors ligne ;
- architecture, cycles, contenus, assets et bundle.

## Conséquences

La V1 devient testable par une famille sur un seul appareil. Les assets illustrés définitifs, les photos facultatives et la validation accompagnée avec de vraies familles restent des travaux de finition et de pilote, pas des prérequis à la boucle fonctionnelle.
