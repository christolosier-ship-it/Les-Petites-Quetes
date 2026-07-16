# Feuille de route

## Principe

Le projet avance par portes de validation. Une phase n’est pas considérée terminée parce que des fichiers existent, mais parce que ses décisions sont cohérentes, testables et approuvées.

## État au 16 juillet 2026

La V1 fonctionnelle est finalisée sur les volets produit, domaine, persistance, interfaces, sauvegarde et PWA.

- phases 0 à 6 : réalisées et contrôlées ;
- phase 7 : contenu fonctionnel présent, production graphique définitive encore à réaliser ;
- phase 8 : contrôles statiques, tests automatisés, responsive et hors ligne réalisés ; tests utilisateurs accompagnés et performance sur appareils modestes encore à conduire ;
- phase 9 : pilote privé non démarré ;
- phase 10 : déploiement technique disponible, documentation publique et revue finale encore à compléter.

Les illustrations, icônes, poses de mascotte et animations parallaxes constituent désormais un chantier graphique séparé. Elles devront respecter la bible des assets sans modifier le domaine métier stabilisé.

## Phase 0, cadrage

### Livrables

- vision produit ;
- cahier des charges ;
- architecture ;
- modèle de données ;
- parcours ;
- sécurité enfant ;
- règles éditoriales ;
- bible des assets ;
- feuille de route.

### Porte de sortie

- périmètre V1 validé ;
- tranches d’âge confirmées ;
- univers initial retenu ;
- aucun désaccord majeur entre produit, données et architecture ;
- fonctions hors périmètre clairement listées.

**Statut : réalisée.**

## Phase 1, conception détaillée

### Livrables

- wireframes espace enfant ;
- wireframes espace parent ;
- carte de navigation ;
- design system ;
- prototype du monde ;
- prototype de mascotte animable ;
- schémas détaillés IndexedDB ;
- contrats des repositories ;
- décisions d’architecture documentées ;
- stratégie PWA et mises à jour ;
- stratégie de lecture vocale ;
- plan de tests.

### Porte de sortie

- parcours principal testable sur maquette ;
- création d’une quête en moins de 30 secondes sur prototype ;
- quête enfant compréhensible sans lecture ;
- animation réalisable avec les assets choisis ;
- aucun besoin technique majeur non résolu.

**Statut : réalisée pour la conception fonctionnelle. Prototype graphique animé encore à produire.**

## Phase 2, fondation technique

### Livrables

- projet React et TypeScript ;
- configuration stricte ;
- structure des couches ;
- contrôles d’architecture ;
- CI ;
- tests ;
- shell PWA ;
- navigation ;
- design tokens ;
- registre d’assets ;
- validation de contenus ;
- budgets de bundle.

### Porte de sortie

- tous les contrôles sont verts ;
- aucune fonctionnalité métier couplée directement au stockage ;
- build et smoke test automatiques ;
- fonctionnement hors ligne.

**Statut : réalisée.**

## Phase 3, domaine métier

### Lots

1. Profils enfants
2. Modèles de quêtes
3. Planifications
4. Occurrences
5. Validation
6. Récompenses
7. Progression
8. Histoire

### Porte de sortie

- règles testées sans navigateur ;
- transitions invalides refusées ;
- génération idempotente ;
- aucune punition implicite ;
- progression reconstructible.

**Statut : réalisée.**

## Phase 4, persistance

### Livrables

- IndexedDB ;
- repositories ;
- migration V1 vers V2 ;
- sauvegarde avant migration ;
- journal de migration ;
- export ;
- import validé profondément ;
- restauration ;
- sauvegardes automatiques consultables.

### Porte de sortie

- tests de migration depuis chaque schéma supporté ;
- import invalide sans effet ;
- restauration fiable ;
- écritures ordonnées ;
- absence d’accès au stockage hors adaptateurs.

**Statut : réalisée. Le stockage média photo reste réservé à une évolution ultérieure.**

## Phase 5, expérience parent

### Livrables

- onboarding ;
- verrou parent ;
- tableau de bord ;
- profils complets ;
- bibliothèque ;
- modèles personnalisables ;
- éditeur de quête ;
- planification multi-enfants ;
- gestion des routines ;
- demandes de validation ;
- réglages et sauvegardes.

### Porte de sortie

- parcours complet utilisable sans documentation ;
- saisie rapide ;
- navigation clavier possible ;
- options avancées regroupées dans les écrans dédiés.

**Statut : réalisée fonctionnellement. Validation avec de vrais parents encore à conduire.**

## Phase 6, expérience enfant

### Livrables

- sélection de profil ;
- monde ;
- quêtes du jour ;
- détail ;
- audio ;
- demande de validation ;
- récompense immédiate ou différée ;
- trésor ;
- histoire ;
- distinction douce des quêtes facultatives ;
- étapes unitaires pour les 3 à 5 ans.

### Porte de sortie

- parcours réalisable avec son désactivé ;
- parcours réalisable avec animations réduites ;
- trois interactions principales maximum par quête ;
- aucune mécanique culpabilisante.

**Statut : réalisée fonctionnellement. La compréhension sans lecture dépend encore des futurs assets illustrés.**

## Phase 7, contenu et assets

### Livrables fonctionnels réalisés

- univers La Forêt des Lucioles ;
- quatre états du monde ;
- 40 quêtes ;
- 12 récompenses ;
- habitants ;
- huit chapitres ;
- textes alternatifs et fallbacks ;
- registre typé.

### Livrables graphiques restant à produire

- mascotte définitive ;
- expressions et poses ;
- quatre décors réellement différenciés ;
- 40 illustrations de quêtes ;
- récompenses et habitants illustrés ;
- sons finaux ;
- icônes PWA PNG ;
- scènes et animations parallaxes.

### Porte de sortie

- registre complet avec les assets définitifs ;
- aucun asset manquant ;
- budgets respectés ;
- cohérence graphique validée ;
- contenus relus pour chaque tranche d’âge ;
- compréhension des quêtes testée à taille réelle.

**Statut : en cours. Fonctionnel terminé, graphisme définitif à réaliser.**

## Phase 8, tests et stabilisation

### Réalisé

- tests du domaine ;
- tests des services applicatifs ;
- tests des migrations et imports ;
- contrôle des écritures concurrentes ;
- contrôles d’architecture et cycles ;
- couverture des couches pures ;
- responsive Chrome mobile, tablette et bureau ;
- PWA et fonctionnement hors ligne ;
- mise à jour contrôlée du service worker ;
- navigation complète ;
- build et déploiement automatisés.

### Restant

- audit manuel d’accessibilité avec lecteur d’écran ;
- tests Safari et iOS installés ;
- tests utilisateurs parent ;
- tests accompagnés enfant ;
- performance sur appareils modestes ;
- contrôle final avec les assets définitifs.

### Porte de sortie

- aucun défaut bloquant ;
- aucune perte de données ;
- aucune régression de sécurité enfant ;
- parcours principaux validés ;
- documentation à jour.

**Statut : stabilisation technique réalisée, validation humaine et multi-navigateurs restante.**

## Phase 9, pilote privé

### Déroulement

- installation par quelques familles volontaires ;
- période d’usage réelle ;
- retours structurés ;
- analyse de la compréhension enfant ;
- analyse du temps de préparation parent ;
- corrections ciblées.

### Porte de sortie

- usage régulier observé ;
- absence de mécanisme vécu comme culpabilisant ;
- parents capables de gérer les quêtes sans assistance ;
- enfant revenant pour découvrir son monde plutôt que pour accumuler des points.

**Statut : non démarrée.**

## Phase 10, déploiement V1

### Déjà disponible

- build de production ;
- hébergement GitHub Pages ;
- sauvegardes ;
- contrôles post-déploiement ;
- mécanisme de mise à jour PWA.

### Restant avant diffusion finale

- domaine éventuel ;
- politique de confidentialité publiée ;
- guide parent ;
- procédure de retour arrière documentée ;
- notes de version ;
- support minimal ;
- validation après intégration des assets définitifs ;
- bilan du pilote privé.

**Statut : déploiement technique disponible, diffusion finale non validée.**

## Après la V1

Ordre potentiel, à revalider selon l’usage :

1. modèles et aventures supplémentaires ;
2. second univers ;
3. synchronisation familiale privée ;
4. partage d’un pack de quêtes sans données enfant ;
5. outils de création narrative.

Aucune fonction connectée n’est automatiquement prioritaire. La V1 doit d’abord prouver que la boucle familiale est utile.
