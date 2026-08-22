# ADR-0005 - Le multi-univers devient un concept métier central

## Statut

Accepté et mis en œuvre.

Cette ADR conserve la décision qui a fait passer le produit du socle V1 centré sur La Forêt des Lucioles au modèle multi-univers aujourd’hui présent dans `main`.

Pour l’architecture et le modèle de données courants, se référer à `ARCHITECTURE.md` et `DATA-MODEL.md` plutôt qu’aux formulations prospectives historiques de cette décision.

## Contexte au moment de la décision

La première V1 avait été construite autour de La Forêt des Lucioles afin de valider la boucle familiale complète. Le produit devait ensuite proposer plusieurs univers spécialisés par contexte de vie : soir, matin, sorties, école, nature et créativité.

Conserver La Forêt des Lucioles comme univers global aurait créé plusieurs incohérences :

- toutes les quêtes auraient fait progresser le même décor ;
- les mascottes des futurs univers auraient été de simples habillages ;
- les contenus d’âge seraient restés trop génériques ;
- les composants auraient fini par contenir des conditions spécifiques à chaque monde ;
- les scènes auraient été difficiles à charger et versionner indépendamment.

## Décision

L’univers devient une propriété métier obligatoire des quêtes et de leur cycle de planification.

Chaque univers possède :

- un identifiant stable ;
- un nom public ;
- un périmètre éditorial ;
- une mascotte ;
- une progression par enfant ;
- un catalogue de récompenses ;
- des chapitres ou découvertes ;
- une scène rendue par le système de renderers.

La progression est calculée par couple `childId + worldId`.

Les catégories restent transversales. Elles servent à la recherche et au filtrage mais ne déterminent pas la progression.

## Contenus adaptés à l’âge

Le catalogue intégré regroupe aujourd’hui trois `QuestTemplate` par `familyId`, un pour chaque tranche d’âge.

Une planification et ses occurrences conservent le template, la famille et l’univers utilisés afin que les références restent cohérentes lorsque le contenu évolue.

## Profils enfants

Les champs de compagnon, couleur et univers actif ont été supprimés.

Le profil conserve :

- prénom ou pseudonyme ;
- tranche d’âge ;
- niveau de lecture ;
- avatar.

Le catalogue contient une fille et un garçon pour chacune des trois tranches d’âge.

## Navigation

L’accueil familial sépare les accès enfant et parent.

L’espace enfant ouvre un carrefour de six univers. Une pastille indique le nombre de quêtes actuellement disponibles dans chaque univers et disparaît à zéro.

## Architecture

Les variations de monde sont pilotées par :

- `WorldDefinition` ;
- les catalogues de contenus ;
- le catalogue de renderers de scène ;
- le registre d’assets.

Après consolidation, `ParallaxScene` ne contient plus d’exception Firefly : il sélectionne un renderer déclaré. La Forêt utilise `firefly-diorama`, les autres mondes `generic-parallax` par défaut.

## Données

Le schéma V3 est désormais le schéma courant.

La migration V2 vers V3 :

- sauvegarde l’état courant avant migration dans IndexedDB ;
- convertit les anciens profils ;
- ajoute les références d’univers et de famille nécessaires ;
- rattache l’héritage V2 à La Forêt lorsque l’ancien schéma ne permet pas une attribution plus précise ;
- signale les quêtes personnalisées dont l’univers doit être revu ;
- valide l’état V3 avant utilisation.

## Assets et PWA

La PWA possède désormais une seule stratégie de service worker généré au build.

Les ressources graphiques nécessaires au runtime sont locales. Les cinq ressources CC0 du diorama Firefly ont notamment été rapatriées dans le dépôt et enregistrées dans le registre d’assets.

## Conséquences observées

### Positives

- six univers présents sans six applications distinctes ;
- progression cohérente par enfant et monde ;
- catalogue de quêtes réellement décliné par âge ;
- séparation avatar enfant / mascotte narrative ;
- scènes extensibles par renderer déclaré ;
- possibilité de faire progresser la production graphique monde par monde.

### Coûts assumés

- migration V2 vers V3 ;
- catalogue de contenus plus riche ;
- volume d’assets supérieur ;
- contrôles supplémentaires sur les références, les âges et les univers ;
- nécessité de maintenir la documentation et les assets en cohérence avec les IDs stables.

## Décisions autrefois différées, désormais résolues

- univers nature : **Nature et découvertes** (`world.nature-discovery`) ;
- univers créativité : **L’Atelier créatif** (`world.creativity-workshop`) ;
- mascottes : Luma, Flammèche, Nova, Pico, Brindille et Mimo ;
- progression de scène actuelle : quatre stades `0` à `3` ;
- premier renderer spécialisé : diorama illustré + couche Three.js pour La Forêt.

La finition graphique des six univers reste progressive et appartient à la roadmap courante.

## Documents liés

- [Architecture](../ARCHITECTURE.md)
- [Modèle de données](../DATA-MODEL.md)
- [Bible des assets](../ASSET-BIBLE.md)
- [Feuille de route](../ROADMAP.md)
- [Index documentaire](../00-INDEX.md)
