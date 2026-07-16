# Règles éditoriales et narratives

## 1. Objectif

Garantir que toutes les quêtes, histoires, messages et récompenses conservent la même voix et respectent l’âge de l’enfant.

## 2. Ton général

Le ton est :

- chaleureux ;
- concret ;
- encourageant ;
- légèrement merveilleux ;
- jamais infantilisant ;
- jamais culpabilisant ;
- jamais sarcastique envers l’enfant.

## 3. Structure d’une consigne

Une consigne enfant doit :

- commencer par un verbe d’action ;
- décrire une action visible ;
- éviter les abstractions ;
- tenir idéalement en une phrase ;
- contenir une seule intention principale ;
- préciser l’aide d’un adulte lorsque nécessaire.

Exemples :

- « Mets ton pyjama et pose tes vêtements dans le panier. »
- « Choisis trois jouets et range-les dans leur maison. »
- « Avec un adulte, arrose la plante jusqu’au petit repère. »

À éviter :

- « Sois sage. »
- « Range correctement ta chambre. »
- « Fais tous tes devoirs sans discuter. »

## 4. Titres de quêtes

Le titre narratif peut embellir l’action, mais il ne doit jamais la masquer.

Format recommandé :

```text
Titre d’aventure
Action réelle en sous-titre
```

Exemple :

- « Les crocs du dragon »
- sous-titre : « Se brosser les dents »

## 5. Longueur par âge

### 3 à 5 ans

- titre : 2 à 5 mots ;
- consigne : 4 à 12 mots ;
- une seule étape visible à la fois ;
- vocabulaire concret.

### 6 à 8 ans

- titre : 2 à 7 mots ;
- consigne : 6 à 20 mots ;
- jusqu’à trois étapes courtes.

### 9 à 10 ans

- titre : 2 à 8 mots ;
- consigne : jusqu’à 30 mots ;
- étapes possibles pour un petit projet.

## 6. Messages de progression

Les messages valorisent l’action :

- « Tu as aidé le village à grandir. »
- « Une nouvelle luciole s’est réveillée. »
- « Cette petite action a débloqué un passage. »

Ils n’évaluent pas la valeur de l’enfant :

- pas de « Tu es le meilleur » ;
- pas de « Tu es plus fort que les autres » ;
- pas de « Enfin ! » ;
- pas de « Tu aurais pu faire mieux ».

## 7. Quête non terminée

Messages autorisés :

- « Cette quête peut attendre. »
- « Tu peux la reprendre plus tard. »
- « Demande de l’aide si tu en as besoin. »

Aucune formule de perte, d’échec ou de déception.

## 8. Aide et coopération

Les contenus peuvent valoriser :

- demander de l’aide ;
- faire ensemble ;
- essayer une petite étape ;
- adapter la quête ;
- faire une pause.

L’autonomie ne signifie pas accomplir seul à tout prix.

## 9. Narration

L’histoire initiale doit :

- fonctionner par chapitres courts ;
- ne pas dépendre d’une cadence quotidienne ;
- rester compréhensible après une longue pause ;
- ne pas mettre le monde en danger à cause de l’enfant ;
- présenter la mascotte comme compagne, pas comme surveillante ;
- éviter tout antagoniste effrayant pour les plus jeunes.

## 10. Récompenses et badges

Les badges décrivent des expériences variées :

- première découverte ;
- aide apportée ;
- quête créative ;
- aventure en famille ;
- curiosité ;
- autonomie essayée.

Ils ne doivent pas devenir une hiérarchie de valeur.

## 11. Diversité et représentation

Les illustrations et textes doivent montrer :

- différentes familles ;
- différentes apparences ;
- des enfants avec ou sans lunettes ;
- des situations de handicap lorsque pertinent ;
- des activités non genrées ;
- des vêtements et environnements variés.

Les quêtes ne supposent pas qu’une tâche appartient à un genre.

## 12. Contenus intégrés

Chaque modèle doit contenir :

- `id` stable ;
- titre narratif ;
- action réelle ;
- consigne ;
- catégorie ;
- tranches d’âge ;
- illustration ;
- durée indicative ;
- aide adulte ;
- variantes ;
- récompense ;
- texte alternatif.

## 13. Validation éditoriale automatique

Le build doit pouvoir détecter :

- champ obligatoire manquant ;
- titre trop long ;
- consigne vide ;
- catégorie inconnue ;
- illustration absente ;
- âge incompatible ;
- texte alternatif absent ;
- identifiant dupliqué ;
- contenu marqué adulte sans avertissement.

Une revue humaine reste obligatoire pour le ton, la sécurité et la compréhension.