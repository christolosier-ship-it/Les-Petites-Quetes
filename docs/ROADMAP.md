# Feuille de route

## Principe

Le projet avance par portes de validation. Une phase n’est pas considérée terminée parce que des fichiers existent, mais parce que ses décisions sont cohérentes, testables et approuvées.

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

## Phase 2, fondation technique

### Livrables

- projet React et TypeScript ;
- configuration stricte ;
- structure des couches ;
- contrôles d’architecture ;
- CI ;
- tests ;
- shell PWA ;
- navigation vide ;
- design tokens ;
- registre d’assets ;
- validation de contenus ;
- budgets de bundle.

### Porte de sortie

- tous les contrôles sont verts ;
- aucune fonctionnalité métier encore couplée à l’interface ;
- build et smoke test automatiques ;
- fonctionnement offline du shell.

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

## Phase 4, persistance

### Livrables

- IndexedDB ;
- repositories ;
- migrations ;
- sauvegarde avant migration ;
- export ;
- import ;
- restauration ;
- stockage média facultatif.

### Porte de sortie

- tests de migration depuis chaque schéma ;
- import invalide sans effet ;
- restauration fiable ;
- absence d’accès au stockage hors adaptateurs.

## Phase 5, expérience parent minimale

### Livrables

- verrou parent ;
- tableau de bord ;
- profils ;
- bibliothèque ;
- éditeur de quête ;
- planification ;
- demandes de validation ;
- réglages et sauvegarde.

### Porte de sortie

- parcours complet utilisable sans documentation ;
- saisie rapide ;
- navigation clavier ;
- aucune option avancée imposée.

## Phase 6, expérience enfant minimale

### Livrables

- sélection de profil ;
- monde ;
- quêtes du jour ;
- détail ;
- audio ;
- demande de validation ;
- récompense ;
- trésor ;
- histoire.

### Porte de sortie

- parcours réalisable avec son désactivé ;
- parcours réalisable avec animations réduites ;
- mode 3 à 5 ans compréhensible sans lecture ;
- trois interactions principales maximum par quête.

## Phase 7, contenu et assets

### Livrables

- univers La Forêt des Lucioles ;
- mascotte ;
- quatre états du monde ;
- 40 quêtes ;
- récompenses ;
- habitants ;
- huit chapitres ;
- sons ;
- textes alternatifs ;
- icônes PWA.

### Porte de sortie

- registre complet ;
- aucun asset manquant ;
- budgets respectés ;
- cohérence graphique validée ;
- contenus relus pour chaque tranche d’âge.

## Phase 8, tests et stabilisation

### Tests

- domaine ;
- intégration ;
- migrations ;
- accessibilité ;
- responsive ;
- PWA ;
- hors ligne ;
- mise à jour ;
- import/export ;
- tests utilisateurs parent ;
- tests accompagnés enfant ;
- performance sur appareils modestes.

### Porte de sortie

- aucun défaut bloquant ;
- aucune perte de données ;
- aucune régression de sécurité enfant ;
- parcours principaux validés ;
- documentation à jour.

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

## Phase 10, déploiement V1

### Livrables

- build de production ;
- hébergement ;
- domaine éventuel ;
- politique de confidentialité ;
- guide parent ;
- sauvegardes ;
- procédure de retour arrière ;
- notes de version ;
- support minimal.

## Après la V1

Ordre potentiel, à revalider selon l’usage :

1. modèles et aventures supplémentaires ;
2. second univers ;
3. duplication de routines ;
4. synchronisation familiale privée ;
5. partage d’un pack de quêtes sans données enfant ;
6. outils de création narrative.

Aucune fonction connectée n’est automatiquement prioritaire. La V1 doit d’abord prouver que la boucle familiale est utile.