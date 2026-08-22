# Vision produit

## Proposition

Les Petites Quêtes est une application familiale privée qui transforme les petites actions du quotidien en aventures illustrées adaptées aux enfants de 3 à 10 ans.

Le parent prépare les quêtes. L’enfant les découvre dans plusieurs univers thématiques, les réalise dans le monde réel, puis fait évoluer le décor, la mascotte et l’histoire de l’univers concerné.

> Petit effort, morceau d’aventure, univers qui grandit.

## Promesse centrale

Chaque contexte du quotidien possède son propre territoire imaginaire.

- le soir nourrit La Forêt des Lucioles ;
- le matin fait grandir La Montagne du Dragon ;
- les sorties développent La Station Spatiale ;
- les activités scolaires animent Le Village des Lutins ;
- la nature et l’observation font évoluer Nature et découvertes ;
- la création et l’imagination alimentent L’Atelier créatif.

Une quête n’alimente jamais une progression générique. Elle appartient à un univers précis et ne fait évoluer que celui-ci.

## Problème traité

Les routines familiales peuvent devenir répétitives, conflictuelles ou trop abstraites pour un jeune enfant. Les solutions existantes reposent souvent sur des tableaux de corvées, des points, des récompenses matérielles ou des comparaisons.

Les Petites Quêtes cherche une autre voie :

- rendre la consigne compréhensible ;
- donner une petite marge de choix ;
- encourager la participation ;
- valoriser l’effort ;
- créer un rituel parent-enfant ;
- relier les actions réelles à des univers cohérents ;
- éviter la pression de performance.

## Public principal

Familles avec un ou plusieurs enfants de 3 à 10 ans.

### 3 à 5 ans

- interface principalement visuelle ;
- avatar adapté à la tranche d’âge ;
- consignes très courtes et vocalisables ;
- peu de choix simultanés ;
- validation accompagnée par un adulte lorsque nécessaire.

### 6 à 8 ans

- avatar adapté à la tranche d’âge ;
- lecture de phrases courtes ;
- choix parmi plusieurs quêtes ;
- premières responsabilités autonomes.

### 9 à 10 ans

- avatar adapté à la tranche d’âge ;
- quêtes plus longues ou découpées ;
- petits projets créatifs ou de découverte ;
- autonomie accrue sans logique de productivité adulte.

## Les six univers

| Univers | Mascotte | Type de quêtes |
|---|---|---|
| La Forêt des Lucioles | Luma | routines et petits défis du soir ou du coucher |
| La Montagne du Dragon | Flammèche | routines et petits défis du matin |
| La Station Spatiale | Nova | préparation des sorties et petits défis de journée |
| Le Village des Lutins | Pico | routines et petits défis scolaires |
| Nature et découvertes | Brindille | nature, observation et découverte |
| L’Atelier créatif | Mimo | imagination, création et expression |

Ces six univers sont déjà présents dans le catalogue applicatif. Leur niveau de finition graphique n’est pas identique : La Forêt des Lucioles possède le renderer le plus avancé, tandis que plusieurs visuels des autres mondes restent des placeholders.

## Avatars et mascottes

L’avatar représente l’enfant dans l’application. Le catalogue initial propose six personnages : une fille et un garçon pour chacune des trois tranches d’âge.

La mascotte appartient à un univers. Elle accueille, accompagne et célèbre, mais ne représente pas l’enfant.

Les options de compagnon et de couleur personnalisée ne font plus partie du profil.

## Accueil familial

L’écran principal sépare clairement :

- l’espace enfant ;
- l’espace parent protégé par un code local.

L’enfant rejoint son profil puis le carrefour des six univers. Le parent prépare les quêtes, gère les profils, les validations, les progressions, les réglages et les sauvegardes.

## Carrefour enfant

Après sélection de son profil, l’enfant voit un pavé par univers.

Une pastille peut afficher le nombre de quêtes disponibles dans l’univers. Elle disparaît lorsque le nombre est nul et ne représente jamais un retard, une faute ou une série à préserver.

## Boucle d’usage

```text
Choisir son profil
→ choisir un univers
→ découvrir une quête adaptée
→ agir dans le monde réel
→ demander ou obtenir validation
→ faire évoluer cet univers
→ quitter l’écran
```

La boucle doit rester courte. L’application n’est pas conçue pour retenir l’enfant longtemps devant l’écran.

## Différenciation

Le produit ne suit pas le modèle :

```text
Corvée → points → cadeau
```

Il suit le modèle :

```text
Petit effort → aventure thématique → univers qui évolue
```

## Principes non négociables

1. Le parent prépare, l’enfant joue.
2. Chaque quête appartient à un univers.
3. Chaque univers progresse indépendamment pour chaque enfant.
4. Les contenus tiennent compte des trois tranches d’âge.
5. L’effort est valorisé, jamais la perfection.
6. Une quête manquée ne provoque aucune perte ni culpabilisation.
7. Aucun enfant n’est comparé à un autre.
8. Aucune publicité ni achat intégré.
9. Aucun réseau social, chat public ou géolocalisation.
10. Les données restent minimales et privées.
11. L’expérience des plus jeunes doit rester compréhensible avec un minimum de lecture.
12. Les récompenses numériques prolongent l’histoire, elles ne remplacent pas l’encouragement humain.

## Indicateur principal de réussite

Une famille utilise régulièrement l’application tout en réduisant les rappels conflictuels, et l’enfant identifie naturellement l’univers lié au moment ou au type d’activité.

## Mesures secondaires

- création ou préparation d’une quête rapide pour le parent ;
- compréhension d’une quête en quelques secondes ;
- accès simple aux six univers ;
- validation courte ;
- aucune progression attribuée au mauvais univers ;
- usage quotidien compatible avec quelques minutes d’écran ;
- aucune donnée enfant nécessaire au-delà des informations minimales du profil local.

## Évolution

La vision produit reste stable pendant que l’implémentation graphique mûrit. Les prochains travaux portent sur la finition des mondes, l’accessibilité, la qualité PWA et le pilote familial.

Les décisions techniques courantes sont décrites dans `ARCHITECTURE.md`, le contrat de données dans `DATA-MODEL.md` et les prochains lots dans `ROADMAP.md`.
