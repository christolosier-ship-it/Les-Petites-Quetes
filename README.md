# Les Petites Quêtes

Une application familiale qui transforme les petites actions du quotidien en aventures illustrées pour les enfants.

> Petit effort, morceau d’aventure, monde qui grandit.

## Statut

La V1 est entrée en création par incréments. La branche stable reste protégée par des pull requests et une chaîne complète de contrôles.

Le premier lot fournit uniquement la fondation exécutable : shell React, navigation parent/enfant, PWA hors ligne, design tokens, registres typés, tests et garde-fous d’architecture. Le moteur de quêtes n’est pas encore développé.

## Principes fondateurs

- Le parent prépare, l’enfant joue.
- La progression récompense l’effort, jamais la perfection.
- Aucun classement, aucune publicité et aucun achat intégré.
- L’application complète les encouragements du parent sans chercher à les remplacer.
- La sécurité, l’accessibilité et la vie privée des enfants sont intégrées dès la conception.

## Architecture

Le projet est un monolithe modulaire React + TypeScript, local-first et organisé autour du domaine métier.

```text
Interface → commandes applicatives → domaine pur → ports → adaptateurs locaux
```

Les composants ne lisent pas le stockage, le domaine ne dépend pas du navigateur et les assets passent par un registre typé.

## Démarrage local

Prérequis : Node.js 22.

```bash
npm install
npm run dev
```

## Contrôles

```bash
npm run check
```

Cette commande vérifie l’architecture, les cycles, les budgets de fichiers, les assets, les contenus, le lint, le typage, la couverture, le build, le bundle et un smoke test dans Chrome.

## Documents

- [Vision produit](./docs/PRODUCT-VISION.md)
- [Cahier des charges V1](./docs/CAHIER-DES-CHARGES.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Modèle de données](./docs/DATA-MODEL.md)
- [Parcours utilisateurs](./docs/USER-FLOWS.md)
- [Sécurité enfant](./docs/CHILD-SAFETY.md)
- [Règles éditoriales](./docs/CONTENT-GUIDELINES.md)
- [Bible des assets](./docs/ASSET-BIBLE.md)
- [Feuille de route](./docs/ROADMAP.md)

## Méthode de développement

1. Planification et cahier des charges
2. Conception fonctionnelle, technique et graphique
3. Création par lots contrôlés
4. Tests métier, accessibilité, sécurité et performance
5. Déploiement progressif
