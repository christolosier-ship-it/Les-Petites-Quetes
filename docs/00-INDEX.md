# Dossier de cadrage

Ce dossier constitue la source de vérité du projet avant et pendant le développement applicatif.

## Ordre de lecture

1. [Vision produit](./PRODUCT-VISION.md)
2. [Cahier des charges](./CAHIER-DES-CHARGES.md)
3. [Architecture](./ARCHITECTURE.md)
4. [Modèle de données](./DATA-MODEL.md)
5. [Parcours utilisateurs](./USER-FLOWS.md)
6. [Sécurité et protection de l’enfant](./CHILD-SAFETY.md)
7. [Règles éditoriales](./CONTENT-GUIDELINES.md)
8. [Bible des assets](./ASSET-BIBLE.md)
9. [Feuille de route](./ROADMAP.md)

## Décisions structurantes

- [ADR-0001 — Règles du premier domaine métier](./decisions/ADR-0001-domain-rules.md)

## Règle de gouvernance

Aucune fonctionnalité ne doit être développée si elle contredit ces documents ou si son impact sur le domaine, les données, l’accessibilité et la sécurité n’a pas été analysé.

Toute décision structurante devra être documentée avant fusion :

- nouveau concept métier ;
- nouvelle dépendance majeure ;
- changement de stockage ;
- évolution du modèle de progression ;
- collecte de données personnelles ;
- communication réseau ;
- ajout d’un nouveau format d’asset ;
- modification importante d’un parcours enfant.

## Statut

Le cadrage initial est validé. Les ADR complètent désormais cette source de vérité à mesure que les lots métier sont développés.
