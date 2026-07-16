# Dossier de cadrage

Ce dossier constitue la source de vérité du projet avant et pendant le développement applicatif.

## Ordre de lecture

1. [Vision produit](./PRODUCT-VISION.md)
2. [Cahier des charges cible](./CAHIER-DES-CHARGES.md)
3. [Plan directeur multi-univers](./MULTI-UNIVERSE-PLAN.md)
4. [Architecture](./ARCHITECTURE.md)
5. [Modèle de données V3](./DATA-MODEL.md)
6. [Parcours utilisateurs](./USER-FLOWS.md)
7. [Sécurité et protection de l’enfant](./CHILD-SAFETY.md)
8. [Règles éditoriales](./CONTENT-GUIDELINES.md)
9. [Bible des assets](./ASSET-BIBLE.md)
10. [Feuille de route](./ROADMAP.md)

## Décisions structurantes

- [ADR-0001 — Règles du premier domaine métier](./decisions/ADR-0001-domain-rules.md)
- [ADR-0002 — Planification et génération des occurrences](./decisions/ADR-0002-schedules-occurrences.md)
- [ADR-0003 — Intégration de la V1 utilisable](./decisions/ADR-0003-v1-usable-integration.md)
- [ADR-0004 — Finalisation fonctionnelle de la V1](./decisions/ADR-0004-finalisation-v1.md)
- [ADR-0005 — Le multi-univers devient un concept métier central](./decisions/ADR-0005-multi-universe-core.md)

## Relation entre V1 et cible multi-univers

Les ADR-0003 et ADR-0004 décrivent le socle V1 effectivement implémenté et contrôlé.

L’ADR-0005 définit le prochain cap. Il ne prétend pas que le code actuel implémente déjà les six univers. Les prochains lots devront faire évoluer le domaine et le schéma vers V3 avant la production graphique massive.

## Règle de gouvernance

Aucune fonctionnalité ne doit être développée si elle contredit ces documents ou si son impact sur le domaine, les données, l’accessibilité et la sécurité n’a pas été analysé.

Toute décision structurante doit être documentée avant fusion :

- nouveau concept métier ;
- nouvelle dépendance majeure ;
- changement de stockage ;
- évolution du modèle de progression ;
- collecte de données personnelles ;
- communication réseau ;
- ajout d’un nouveau format d’asset ;
- modification importante d’un parcours enfant ;
- ajout ou changement d’un univers ;
- modification du moteur parallaxe ;
- changement de la stratégie de variantes d’âge.

## Statut

- socle V1 : finalisé dans la PR fonctionnelle ;
- cadrage multi-univers : documenté dans une PR dédiée ;
- code multi-univers : non démarré ;
- production graphique définitive : à lancer après stabilisation du modèle V3 et du prototype parallaxe.
