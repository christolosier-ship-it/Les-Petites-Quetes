# Cahier des charges V1

## 1. Objet

La V1 doit permettre à un adulte de préparer des quêtes simples et à un enfant de les découvrir, les accomplir puis obtenir une progression narrative et visuelle.

La V1 est locale, privée, installable et utilisable hors ligne. L’architecture devra permettre une future synchronisation familiale sans réécrire le domaine métier.

## 2. Périmètre utilisateur

### Espace parent

Le parent peut :

- créer, modifier et archiver plusieurs profils enfants ;
- choisir un prénom ou pseudonyme, une tranche d’âge, un niveau de lecture, un avatar et une couleur ;
- créer une quête depuis un modèle ou depuis zéro ;
- planifier une quête ponctuelle ou récurrente ;
- attribuer une quête à un ou plusieurs enfants ;
- définir si la validation adulte est nécessaire ;
- consulter les quêtes prévues, terminées, ignorées ou reportées ;
- valider ou refuser une demande de validation ;
- choisir l’univers narratif actif ;
- régler le son, la voix, les animations et la durée d’affichage ;
- exporter et importer une sauvegarde complète ;
- protéger l’espace parent par un code local.

### Espace enfant

L’enfant peut :

- sélectionner son profil si plusieurs profils existent ;
- voir un accueil illustré et ses quêtes du moment ;
- écouter la consigne ;
- choisir une quête facultative lorsque plusieurs choix sont proposés ;
- ouvrir une quête et voir ses étapes ;
- signaler qu’il a terminé ;
- attendre ou demander la validation d’un adulte ;
- découvrir la récompense obtenue ;
- consulter son monde, son histoire et ses objets débloqués.

## 3. Tranches d’expérience

### Mode Petit explorateur, 3 à 5 ans

- navigation par images ;
- texte secondaire ;
- lecture vocale accessible en un geste ;
- maximum de trois quêtes simultanées ;
- validation adulte activée par défaut ;
- aucune notion numérique abstraite nécessaire.

### Mode Aventurier, 6 à 8 ans

- textes courts ;
- plusieurs quêtes visibles ;
- choix facultatifs ;
- étapes simples ;
- progression narrative plus explicite.

### Mode Grand aventurier, 9 à 10 ans

- quêtes découpées ;
- durées indicatives ;
- petits projets ;
- autonomie renforcée ;
- validation adulte paramétrable.

## 4. Catégories de quêtes

La V1 propose les catégories suivantes :

- autonomie ;
- hygiène et routines ;
- participation familiale ;
- créativité ;
- découverte ;
- bien-être ;
- gentillesse ;
- aventure spéciale.

Chaque catégorie possède une icône, une couleur fonctionnelle et des modèles éditables.

## 5. Modèle d’une quête

Une quête contient au minimum :

- identifiant ;
- titre ;
- consigne courte ;
- illustration ;
- catégorie ;
- enfants concernés ;
- caractère obligatoire ou facultatif ;
- type de validation ;
- récompense narrative ;
- statut d’archivage.

Champs optionnels :

- consigne vocale préenregistrée ou synthétisable localement ;
- étapes ;
- durée indicative ;
- moment de la journée ;
- jours de récurrence ;
- date ponctuelle ;
- matériel nécessaire ;
- aide autorisée ;
- note réservée au parent ;
- illustration personnalisée.

## 6. Planification

Une quête peut être :

- disponible immédiatement ;
- planifiée à une date ;
- récurrente certains jours ;
- liée à un moment de la journée ;
- suspendue temporairement ;
- dupliquée.

Moments proposés :

- matin ;
- retour à la maison ;
- avant le repas ;
- après le repas ;
- soirée ;
- coucher ;
- à tout moment.

La V1 ne gère pas de calendrier complexe à la minute. Une heure précise reste facultative.

## 7. Cycle de vie d’une occurrence

```text
À venir → Disponible → Commencée → Validation demandée → Terminée
                         ↘ Reportée
                         ↘ Ignorée
```

Règles :

- une occurrence passée non réalisée n’est jamais automatiquement qualifiée d’échec ;
- un parent peut reporter ou ignorer une occurrence ;
- aucune série n’est cassée ;
- aucune récompense déjà obtenue n’est retirée ;
- un refus de validation renvoie la quête vers l’état disponible avec un message neutre ;
- l’historique distingue le modèle de quête de ses occurrences.

## 8. Validation

Types proposés :

- validation immédiate par l’enfant ;
- validation adulte requise ;
- validation ensemble ;
- preuve photo facultative, désactivée par défaut.

La validation adulte doit être accessible rapidement depuis l’accueil parent.

Le refus ne doit jamais afficher un message culpabilisant. Exemple : « Il reste peut-être une petite étape. Regarde avec ton adulte. »

## 9. Progression narrative

La V1 contient un seul univers complet.

Chaque quête terminée attribue une ressource narrative déterminée par le contenu, par exemple :

- luciole ;
- graine ;
- plume ;
- fragment de carte ;
- objet décoratif.

La progression débloque :

- des états de décor ;
- des objets ;
- des réactions de mascotte ;
- des fragments d’histoire ;
- des badges non compétitifs.

La récompense n’est pas une monnaie achetable. Aucun catalogue commercial n’existe.

## 10. Univers initial

Nom de travail : **La Forêt des Lucioles**.

Éléments minimum :

- une mascotte principale ;
- quatre états progressifs du décor ;
- douze objets ou habitants débloquables ;
- une histoire de huit chapitres courts ;
- des réactions pour découverte, encouragement, validation et retour après une pause ;
- une fin ouverte permettant de continuer à enrichir le monde.

## 11. Bibliothèque initiale

La V1 doit inclure au moins 40 modèles répartis entre les catégories.

Chaque modèle doit préciser :

- tranche d’âge recommandée ;
- niveau de lecture ;
- nécessité éventuelle d’un adulte ;
- durée indicative ;
- contexte ;
- consigne courte ;
- variante douce ;
- illustration associée.

## 12. Écrans V1

### Enfant

1. Sélection du profil
2. Mon monde
3. Mes quêtes
4. Détail d’une quête
5. Validation demandée
6. Récompense débloquée
7. Mon histoire et mon trésor

### Parent

1. Verrou parent
2. Tableau de bord
3. Profils enfants
4. Liste et calendrier léger des quêtes
5. Création ou modification d’une quête
6. Demandes de validation
7. Bibliothèque de modèles
8. Univers et progression
9. Sauvegarde et réglages

## 13. Navigation

L’espace enfant ne doit pas dépasser trois destinations principales :

- Monde ;
- Quêtes ;
- Trésor.

L’espace parent peut utiliser cinq destinations :

- Aujourd’hui ;
- Quêtes ;
- Enfants ;
- Monde ;
- Réglages.

Le passage vers l’espace parent doit nécessiter une action volontaire et une vérification locale.

## 14. Audio et lecture

- chaque consigne peut être lue à voix haute ;
- le son reste désactivable ;
- aucune fonction essentielle ne dépend du son ;
- les effets sont courts ;
- aucun son ne démarre de manière agressive ;
- l’application respecte les préférences de réduction des animations.

La solution technique de synthèse ou d’enregistrement sera définie pendant la conception détaillée.

## 15. Stockage et sauvegarde

La V1 conserve localement :

- profils ;
- modèles personnalisés ;
- planifications ;
- occurrences ;
- progression ;
- réglages ;
- photos facultatives ;
- version du schéma.

Exigences :

- IndexedDB pour les données applicatives ;
- migrations versionnées ;
- sauvegarde avant migration ;
- export JSON complet ;
- import validé avant remplacement ;
- restauration possible ;
- aucune dépendance réseau pour l’usage quotidien.

## 16. PWA et fonctionnement hors ligne

- installation sur smartphone et tablette ;
- fonctionnement hors ligne après le premier chargement ;
- service worker versionné ;
- message clair lors d’une mise à jour ;
- aucun écran blanc si un asset facultatif manque ;
- chargement différé des assets narratifs lourds ;
- conservation du dernier état cohérent.

## 17. Accessibilité

- grandes zones tactiles ;
- contraste suffisant ;
- aucun texte intégré uniquement dans une image ;
- navigation clavier dans l’espace parent ;
- libellés accessibles ;
- réduction des animations ;
- alternatives textuelles ;
- consignes compréhensibles sans couleur ;
- tailles de texte adaptables ;
- aucune limite de temps bloquante.

## 18. Confidentialité

- aucun compte dans la V1 ;
- aucun suivi publicitaire ;
- aucune télémétrie distante ;
- aucun identifiant public d’enfant ;
- aucune collecte de date de naissance complète ;
- prénom ou pseudonyme suffisant ;
- photos facultatives et locales ;
- suppression totale accessible au parent ;
- avertissement avant export ou partage d’une sauvegarde.

## 19. Exigences de qualité

Le dépôt doit disposer avant la première version fonctionnelle de :

- TypeScript strict ;
- tests du domaine sans navigateur ;
- tests des migrations ;
- tests des règles de planification ;
- tests des progressions ;
- contrôles d’architecture ;
- contrôle des dépendances circulaires ;
- détection du code mort ;
- contrôle de taille du bundle ;
- tests de fumée navigateur ;
- validation automatique du registre d’assets ;
- vérification des contenus obligatoires.

## 20. Hors périmètre V1

- synchronisation familiale ;
- comptes en ligne ;
- classement ;
- amis ;
- chat ;
- localisation ;
- publicité ;
- achat intégré ;
- récompenses financières ;
- monnaie achetable ;
- intelligence artificielle ;
- analyse émotionnelle automatique ;
- intégration scolaire ;
- contrôle du téléphone de l’enfant ;
- partage public ;
- plus d’un univers complet.

## 21. Critères d’acceptation globaux

La V1 est acceptable lorsque :

- un parent peut créer un profil et une quête sans documentation ;
- un enfant non lecteur peut comprendre la quête grâce à l’image et à l’audio ;
- la réalisation et la validation fonctionnent hors ligne ;
- la progression est déterministe et ne perd aucun objet ;
- un jour sans quête accomplie ne produit aucun message négatif ;
- les données survivent à une mise à jour de schéma ;
- l’export puis l’import restaurent un état équivalent ;
- l’espace parent est protégé ;
- les parcours principaux passent les tests sur mobile, tablette et ordinateur ;
- l’application reste utilisable avec les animations et le son désactivés.