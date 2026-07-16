# Feuille de route multi-univers

## 1. Situation actuelle

La V1 technique et fonctionnelle existante a validé :

- boucle parent-enfant ;
- profils ;
- planification ;
- validation ;
- récompenses ;
- progression ;
- IndexedDB ;
- migrations ;
- sauvegardes ;
- PWA ;
- contrôles statiques et dynamiques.

Cette base est actuellement centrée sur La Forêt des Lucioles. Le prochain cycle doit la transformer en moteur multi-univers avant la production graphique définitive.

## 2. Nouveau programme

Le programme cible :

- 6 univers ;
- 6 mascottes ;
- 6 avatars enfants initiaux ;
- progression indépendante par enfant et univers ;
- familles de quêtes avec variantes d’âge ;
- accueil familial en deux fenêtres ;
- carrefour enfant avec pastilles de disponibilité ;
- scènes parallaxes déclaratives ;
- migration V2 vers V3.

## 3. Porte 0, cadrage multi-univers

### Livrables

- vision mise à jour ;
- cahier des charges cible ;
- architecture cible ;
- modèle V3 ;
- nouveaux parcours ;
- bible des assets ;
- règles éditoriales ;
- sécurité enfant ;
- plan directeur ;
- ADR-0005.

### Porte de sortie

- univers obligatoire pour chaque quête ;
- distinction claire avatar/mascotte ;
- navigation validée ;
- stratégie d’âge validée ;
- migration définie ;
- aucun code modifié avant validation documentaire.

**Statut : en cours dans la PR documentaire multi-univers.**

## 4. Porte 1, domaine multi-univers

### Livrables

- `WorldDefinition` ;
- `QuestFamily` ;
- `QuestVariant` ;
- progression par enfant-univers ;
- univers et variante figés dans les occurrences ;
- avatars contraints par âge ;
- nouveaux invariants.

### Tests

- quête sans univers refusée ;
- variante incompatible refusée ;
- récompense croisée refusée ;
- progression isolée ;
- historique stable.

### Porte de sortie

- règles testées sans navigateur ;
- aucune condition spécifique à un nom d’univers dans le moteur ;
- typecheck, lint et couverture verts.

## 5. Porte 2, schéma V3 et migration

### Livrables

- schéma V3 ;
- migration V2 vers V3 ;
- conversion des profils ;
- table de correspondance des contenus intégrés ;
- revue des quêtes personnalisées ;
- import V2 et V3 ;
- restauration.

### Porte de sortie

- historique conservé ;
- aucune progression déplacée silencieusement ;
- sauvegarde avant migration ;
- import invalide sans effet ;
- tests de migration réels.

## 6. Porte 3, catalogue des univers et des quêtes

### Livrables

- six `WorldDefinition` ;
- six mascottes provisoires dans le registre ;
- audit des 40 modèles actuels ;
- familles de quêtes ;
- variantes d’âge ;
- matrice de couverture.

### Objectif initial

- 5 familles minimum par univers ;
- 3 variantes d’âge par famille ;
- 30 familles ;
- 90 variantes.

### Porte de sortie

- chaque univers possède un panel pour chaque âge ;
- récompenses cohérentes ;
- aucun contenu sans illustration ou fallback ;
- validation éditoriale automatique verte.

## 7. Porte 4, accueil familial et carrefour enfant

### Livrables

- écran principal à deux fenêtres ;
- accès enfant à gauche ;
- accès parent à droite ;
- sélection du profil ;
- six pavés d’univers ;
- compteur de quêtes disponibles ;
- badge absent à zéro ;
- navigation responsive.

### Porte de sortie

- un enfant atteint un univers en deux interactions maximum ;
- les compteurs sont exacts ;
- aucune comparaison entre profils ;
- mobile, tablette et bureau validés.

## 8. Porte 5, espace parent multi-univers

### Livrables

- suppression compagnon et couleur ;
- choix d’avatar filtré par âge ;
- bibliothèque filtrée par univers ;
- filtre par tranche d’âge ;
- éditeur avec univers obligatoire ;
- gestion des variantes ;
- attribution multi-enfants compatible ;
- progression par univers ;
- revue des quêtes migrées.

### Porte de sortie

- aucun enfant ne reçoit une variante incompatible ;
- création simple en moins de 30 secondes ;
- options avancées repliées ;
- navigation clavier validée.

## 9. Porte 6, moteur parallaxe

### Livrables

- manifeste typé de scène ;
- calques par profondeur ;
- slots débloquables ;
- ancres de mascotte ;
- responsive ;
- mouvements réduits ;
- fallback statique ;
- chargement différé ;
- cache par univers.

### Prototype obligatoire

La Forêt des Lucioles sert de premier prototype complet avec Luma.

### Porte de sortie

- aucun composant spécifique à la forêt ;
- scène fluide sur tablette cible ;
- fallback fonctionnel hors ligne ;
- budgets respectés ;
- ajout d’un second univers sans modifier le moteur.

## 10. Porte 7, avatars et identité commune

### Livrables

- six avatars ;
- bustes et corps entiers ;
- design system personnages ;
- tests en 96 px ;
- intégration au registre ;
- migration des anciens avatars.

### Porte de sortie

- chaque âge possède garçon et fille ;
- aucun avatar incompatible ;
- style cohérent avec les mascottes ;
- lisibilité sur les trois formats.

## 11. Porte 8, production univers par univers

L’ordre proposé :

1. La Forêt des Lucioles ;
2. La Montagne du Dragon ;
3. La Station Spatiale ;
4. Le Village des Lutins ;
5. univers nature ;
6. univers créativité.

Chaque univers livre :

- couverture ;
- mascotte ;
- scène parallaxe ;
- fallback ;
- récompenses ;
- habitants ;
- histoire ;
- illustrations de quêtes ;
- sons facultatifs ;
- textes alternatifs.

Un univers doit être validé avant de lancer le volume complet du suivant.

## 12. Porte 9, stabilisation

### Contrôles

- TypeScript strict ;
- architecture ;
- cycles ;
- contenu ;
- assets ;
- budgets ;
- migration ;
- navigation ;
- responsive ;
- hors ligne ;
- Safari/iOS ;
- accessibilité ;
- performance sur appareils modestes.

### Porte de sortie

- aucune perte de données ;
- aucun défaut bloquant ;
- aucune progression croisée ;
- aucune quête hors âge ;
- chaque scène possède un fallback ;
- documentation à jour.

## 13. Porte 10, pilote familial

### Déroulement

- installation chez quelques familles ;
- observation de l’accueil à deux fenêtres ;
- compréhension des six univers ;
- compréhension des pastilles ;
- temps de création parent ;
- usage des variantes d’âge ;
- perception des mascottes ;
- performance des scènes ;
- corrections ciblées.

### Porte de sortie

- parents autonomes ;
- enfants capables de choisir le bon univers ;
- pastilles non vécues comme une pression ;
- univers reconnus visuellement ;
- temps d’écran bref ;
- aucune confusion avatar/mascotte.

## 14. Porte 11, diffusion

### Livrables

- build de production ;
- icônes PWA finales ;
- politique de confidentialité ;
- guide parent ;
- notes de version ;
- procédure de retour arrière ;
- support minimal ;
- bilan pilote.

## 15. Séquence des PR

1. documentation multi-univers ;
2. domaine et types V3 ;
3. migration et validation runtime ;
4. catalogues de mondes et variantes ;
5. accueil familial et carrefour ;
6. espace parent ;
7. moteur parallaxe ;
8. avatars ;
9. intégration de La Forêt des Lucioles ;
10. un PR graphique par univers restant ;
11. stabilisation et pilote.

## 16. Décisions encore ouvertes

- nom public de l’univers nature ;
- nom public de l’univers créativité ;
- noms des cinq mascottes restantes ;
- nombre final de paliers par univers ;
- technique d’animation après prototype ;
- répartition définitive des 40 quêtes existantes.

Ces décisions n’empêchent pas de stabiliser les identifiants techniques et le modèle métier.
