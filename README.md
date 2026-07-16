# Les Petites Quêtes

Une application familiale qui transforme les petites actions du quotidien en aventures illustrées pour les enfants de 3 à 10 ans.

> Petit effort, morceau d’aventure, monde qui grandit.

## Statut

La V1 fonctionnelle couvre la boucle familiale complète sur un appareil :

```text
Préparer une quête → la réaliser hors écran → la valider → faire grandir le monde
```

Les fonctions, les données, la PWA et les parcours sont finalisés. Les visuels actuels restent volontairement provisoires : les illustrations définitives, les icônes, la mascotte et les scènes parallaxes seront produits séparément à partir de la bible graphique.

## Fonctions V1

### Premier lancement

- présentation courte et confirmation d’un usage familial privé ;
- création du premier profil ;
- choix d’un compagnon et d’une couleur ;
- code parent local ;
- mode de validation par défaut ;
- sélection d’une à trois premières quêtes ;
- arrivée directe dans le monde enfant.

### Espace parent

- création, modification, archivage et restauration de plusieurs profils ;
- bibliothèque de 40 quêtes réparties entre 8 catégories ;
- planification directe d’un modèle ou création d’une copie personnalisée ;
- modèles familiaux modifiables, archivables et réutilisables ;
- quêtes personnalisées avec étapes, durée, aide adulte, note et récompense ;
- attribution à un ou plusieurs enfants ;
- planification immédiate, ponctuelle ou hebdomadaire ;
- moments de journée, heure facultative et date de fin ;
- routines modifiables, suspendables, reprenables et duplicables ;
- validation parent ou ensemble ;
- report au lendemain et choix neutre de laisser une quête de côté ;
- réglages de lecture vocale, effets sonores, animations et célébrations ;
- export JSON, import confirmé et sauvegardes automatiques restaurables ;
- suppression complète des données locales.

### Espace enfant

- choix du profil ;
- trois destinations : Monde, Quêtes et Trésor ;
- maximum de trois quêtes visibles pour les 3 à 5 ans ;
- distinction douce des quêtes facultatives ;
- lecture vocale locale ;
- étapes montrées une par une aux plus jeunes ;
- démarrage et signalement de fin en quelques interactions ;
- attente neutre d’une validation adulte ;
- célébration immédiate ou différée ;
- quatre états de La Forêt des Lucioles ;
- douze objets ou habitants et huit chapitres.

## Vie privée et intégrité

- fonctionnement local-first sans compte ;
- données stockées dans IndexedDB ;
- aucune publicité, télémétrie ou communication sociale ;
- aucune date de naissance complète ;
- validation runtime de chaque entité importée ;
- contrôle des références et de la progression ;
- sauvegarde transactionnelle avant import, migration ou restauration ;
- journal de migration ;
- écritures sérialisées afin d’éviter la perte d’une action rapide.

Le code parent sépare les usages sur l’appareil. Il ne constitue pas un chiffrement des données locales.

## PWA

- installation sur smartphone, tablette ou ordinateur ;
- fonctionnement hors ligne après le premier chargement ;
- service worker généré depuis les bundles de production ;
- bundles JavaScript et CSS précachés ;
- nouvelle version proposée sans interrompre l’usage ;
- aucun fallback HTML utilisé à la place d’un asset JavaScript ou CSS.

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

La chaîne vérifie notamment :

- TypeScript strict et code mort ;
- architecture, imports entre features et cycles ;
- budgets de fichiers, assets et bundle ;
- 40 contenus et formulations interdites ;
- 84 scénarios unitaires et leur couverture ;
- migrations, imports et sauvegardes ;
- build GitHub Pages et service worker ;
- parcours Chrome mobile, tablette et bureau ;
- onboarding, famille, routines, validation, récompense, import corrompu, persistance et hors ligne.

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
