# Les Petites Quêtes

Une application familiale qui transforme les petites actions du quotidien en aventures illustrées pour les enfants de 3 à 10 ans.

> Petit effort, morceau d’aventure, monde qui grandit.

## Statut

Une première V1 utilisable est disponible dans la PR d’intégration. Elle couvre la boucle familiale complète sur un appareil :

```text
Préparer une quête → la réaliser hors écran → la valider → faire grandir le monde
```

Les visuels actuels forment un kit vectoriel provisoire cohérent. La production des illustrations définitives restera pilotée par la bible graphique du projet.

## Fonctions V1

### Espace parent

- code parent local à quatre chiffres ;
- création, modification et archivage des profils ;
- bibliothèque de 40 quêtes réparties entre 8 catégories ;
- création de quêtes personnalisées ;
- planification immédiate, ponctuelle ou hebdomadaire ;
- validation parent ou ensemble ;
- report au lendemain et choix neutre de laisser une quête de côté ;
- préférences de lecture vocale et d’animations ;
- export et restauration JSON.

### Espace enfant

- choix du profil ;
- trois destinations : Monde, Quêtes et Trésor ;
- consignes illustrées et lecture vocale locale ;
- démarrage et signalement de fin en quelques interactions ;
- récompenses narratives ;
- quatre états de La Forêt des Lucioles ;
- douze objets ou habitants et huit chapitres.

## Vie privée

- fonctionnement local-first sans compte ;
- données stockées dans IndexedDB sur l’appareil ;
- aucune publicité, télémétrie ou communication sociale ;
- aucune date de naissance complète ;
- sauvegarde explicite avant restauration ;
- import entièrement validé avant remplacement.

Le code parent sépare les usages sur l’appareil. Il ne constitue pas un chiffrement des données locales.

## Principes fondateurs

- Le parent prépare, l’enfant joue.
- La progression récompense l’effort, jamais la perfection.
- Aucun classement, aucune série cassable et aucun retrait de récompense.
- L’application renvoie rapidement vers l’action dans le monde réel.
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

Cette commande vérifie l’architecture, les cycles, les budgets de fichiers, les assets, les 40 contenus, le lint, le typage, la couverture, le build, le bundle et un parcours complet dans Chrome mobile, y compris la persistance et le hors ligne.

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
- [Décisions structurantes](./docs/00-INDEX.md)
