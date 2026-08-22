# Documentation de référence

Ce dossier constitue la source documentaire du projet Les Petites Quêtes.

La règle de gouvernance est simple : **le code sur `main` et les documents courants ci-dessous doivent raconter la même histoire**. Un ancien plan ou un ADR peut expliquer comment nous sommes arrivés ici, mais il ne doit pas devenir une seconde vérité concurrente.

## 1. Pour comprendre l’état actuel

Lire dans cet ordre :

1. [README du dépôt](../README.md) - vue d’ensemble, stack, exécution, déploiement et état du produit ;
2. [Architecture](./ARCHITECTURE.md) - structure réellement implémentée ;
3. [Modèle de données V3](./DATA-MODEL.md) - contrat réellement persisté ;
4. [Bible des assets](./ASSET-BIBLE.md) - règles graphiques, registre et état des placeholders ;
5. [Feuille de route](./ROADMAP.md) - uniquement ce qui reste à faire à partir du présent.

Ces cinq documents doivent être mis à jour lorsqu’une PR modifie une vérité qu’ils décrivent.

## 2. Pour comprendre le produit

Ces documents définissent les intentions et garde-fous fonctionnels :

- [Vision produit](./PRODUCT-VISION.md) ;
- [Cahier des charges](./CAHIER-DES-CHARGES.md) ;
- [Parcours utilisateurs](./USER-FLOWS.md) ;
- [Sécurité et protection de l’enfant](./CHILD-SAFETY.md) ;
- [Règles éditoriales](./CONTENT-GUIDELINES.md).

Ils ne doivent pas être utilisés pour affirmer qu’une structure technique existe si `ARCHITECTURE.md` ou `DATA-MODEL.md` dit le contraire.

## 3. Documentation des assets particuliers

- [Sources et licences de La Forêt des Lucioles](./FIREFLY-FOREST-ASSETS.md)

Ce document conserve notamment la provenance des ressources CC0 désormais embarquées localement dans le dépôt.

## 4. Décisions structurantes

Les ADR conservent l’historique des choix importants :

- [ADR-0001 - Règles du premier domaine métier](./decisions/ADR-0001-domain-rules.md)
- [ADR-0002 - Planification et génération des occurrences](./decisions/ADR-0002-schedules-occurrences.md)
- [ADR-0003 - Intégration de la V1 utilisable](./decisions/ADR-0003-v1-usable-integration.md)
- [ADR-0004 - Finalisation fonctionnelle de la V1](./decisions/ADR-0004-finalisation-v1.md)
- [ADR-0005 - Le multi-univers devient un concept métier central](./decisions/ADR-0005-multi-universe-core.md)

Un ADR est un **journal de décision**. Il peut donc employer le futur ou décrire un état ancien. Pour connaître l’implémentation actuelle, revenir aux documents de la section 1.

## 5. État consolidé au 22 août 2026

Le projet n’est plus dans la phase « cadrage multi-univers » décrite par l’ancienne documentation.

Sont effectivement présents :

- schéma familial V3 ;
- migration V1/V2 vers V3 ;
- six univers ;
- six mascottes nommées ;
- six avatars ;
- 30 familles de quêtes et 90 variantes ;
- progression par enfant et univers ;
- accueil familial, espace enfant et espace parent ;
- PWA local-first ;
- service worker unique généré au build ;
- assets Firefly CC0 locaux ;
- renderer générique + renderer diorama Firefly ;
- CI GitHub essentielle ;
- déploiement Vercel.

La production graphique finale des six univers n’est en revanche pas terminée. De nombreux IDs visuels sont encore reliés à des placeholders, ce qui est documenté explicitement dans `ASSET-BIBLE.md`.

## 6. Identifiants d’univers de référence

```text
world.firefly-forest
world.dragon-mountain
world.space-station
world.gnome-village
world.nature-discovery
world.creativity-workshop
```

Les anciens noms techniques `world.elven-village` et `world.creative-studio` sont obsolètes.

## 7. Une seule feuille de route

L’ancien document `MULTI-UNIVERSE-PLAN.md` décrivait le passage d’un socle V1 vers un moteur multi-univers. Cette transition est maintenant réalisée et le document est supprimé pour éviter de maintenir un plan parallèle devenu faux.

Les travaux futurs sont suivis uniquement dans [ROADMAP.md](./ROADMAP.md), à partir de l’état de `main`.

Il n’existe pas de « plan V4 » implicite.

## 8. Règle de gouvernance documentaire

Une PR doit mettre à jour la documentation courante si elle change :

- une frontière d’architecture ;
- le schéma persistant ;
- une migration ;
- la stratégie PWA ou de cache ;
- la plateforme de déploiement ;
- le contrat du registre d’assets ;
- les IDs d’univers ;
- le modèle de progression ;
- les règles de sécurité ou d’accessibilité enfant ;
- un jalon de roadmap réellement terminé.

À l’inverse, une petite PR ne doit pas créer un nouveau document de « vision cible » simplement parce qu’elle prépare une amélioration.

## 9. Contradiction documentaire

En cas de contradiction :

1. vérifier le code et les tests sur `main` ;
2. vérifier `ARCHITECTURE.md` ou `DATA-MODEL.md` selon le sujet ;
3. corriger la documentation obsolète dans la même PR ;
4. conserver un ADR seulement si l’historique de la décision reste utile.

Le but est d’éviter le musée de plans futuristes où personne ne sait plus quel vaisseau est réellement en vol. 🚀
