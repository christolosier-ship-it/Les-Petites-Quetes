# Règles éditoriales et narratives multi-univers

## 1. Objectif

Garantir que les quêtes, variantes d’âge, histoires, mascottes et récompenses conservent une voix commune tout en donnant une identité claire à chaque univers.

## 2. Ton commun

Le ton est :

- chaleureux ;
- concret ;
- encourageant ;
- légèrement merveilleux ;
- jamais infantilisant ;
- jamais culpabilisant ;
- jamais sarcastique envers l’enfant.

## 3. Identité des univers

Chaque univers possède un vocabulaire narratif léger.

### La Forêt des Lucioles

- lumière ;
- calme ;
- nid ;
- clairière ;
- sommeil ;
- douceur du soir.

### La Montagne du Dragon

- réveil ;
- souffle ;
- sommet ;
- énergie ;
- départ du matin.

### La Station Spatiale

- mission ;
- équipement ;
- départ ;
- exploration ;
- journée dehors.

### Le Village des Lutins

- atelier ;
- cartable ;
- savoir ;
- lecture ;
- organisation scolaire.

### Univers nature

- observation ;
- saisons ;
- traces ;
- vivant ;
- curiosité.

### Univers créativité

- couleurs ;
- formes ;
- sons ;
- construction ;
- imagination.

Le vocabulaire d’univers embellit l’action mais ne doit jamais masquer la consigne réelle.

## 4. Famille et variante de quête

Une famille de quête définit l’intention réelle et l’univers.

Chaque variante d’âge définit :

- titre narratif ;
- action réelle ;
- consigne ;
- étapes ;
- durée ;
- illustration ;
- texte alternatif.

Une variante n’est pas une simple version raccourcie. Elle adapte la difficulté, l’autonomie, le vocabulaire et le nombre d’étapes.

## 5. Consignes

Une consigne doit :

- commencer par un verbe d’action ;
- décrire une action visible ;
- contenir une seule intention principale ;
- préciser l’aide d’un adulte lorsque nécessaire ;
- rester compréhensible sans connaître l’histoire de l’univers.

Exemples :

- 3-5 ans : « Pose ton pyjama près du lit. »
- 6-8 ans : « Prépare ton pyjama et range tes vêtements dans le panier. »
- 9-10 ans : « Prépare tes affaires du soir et vérifie que ta chambre est prête pour demain. »

## 6. Titres

Format recommandé :

```text
Titre d’aventure
Action réelle en sous-titre
```

Exemple :

```text
Le souffle du matin
S’habiller
```

Le titre peut changer selon l’univers et l’âge. L’action réelle reste explicite côté parent et accessible côté enfant.

## 7. Longueur par âge

### 3 à 5 ans

- titre : 2 à 5 mots ;
- consigne : 4 à 12 mots ;
- une étape visible à la fois ;
- vocabulaire concret ;
- aucune métaphore nécessaire pour comprendre l’action.

### 6 à 8 ans

- titre : 2 à 7 mots ;
- consigne : 6 à 20 mots ;
- jusqu’à trois étapes ;
- vocabulaire narratif léger.

### 9 à 10 ans

- titre : 2 à 8 mots ;
- consigne : jusqu’à 30 mots ;
- petit projet possible ;
- autonomie et préparation explicites.

## 8. Messages de progression

Les messages nomment l’univers concerné :

- « Une nouvelle lumière s’est réveillée dans la forêt. »
- « Un passage s’ouvre sur la montagne. »
- « Un nouveau module rejoint la station. »
- « Un atelier s’anime dans le village. »

Ils ne jugent jamais la valeur de l’enfant.

Formulations interdites :

- « Tu es le meilleur » ;
- « Enfin » ;
- « Tu as pris du retard » ;
- « Les autres ont fait mieux » ;
- « La mascotte est déçue ».

## 9. Pastilles de disponibilité

La pastille rouge signifie uniquement : « des quêtes sont disponibles maintenant ».

Elle ne doit jamais être décrite comme :

- retard ;
- dette ;
- urgence ;
- série à préserver ;
- tâche en souffrance.

Libellé accessible recommandé :

```text
2 quêtes disponibles dans La Station Spatiale
```

## 10. Quête non terminée

Messages autorisés :

- « Cette quête peut attendre. »
- « Tu peux la reprendre plus tard. »
- « Demande de l’aide si tu en as besoin. »

Aucun univers ne se dégrade et aucune mascotte ne devient triste.

## 11. Mascottes

Chaque mascotte est :

- compagne ;
- guide ;
- narratrice ;
- témoin de la progression.

Elle n’est jamais :

- surveillante ;
- juge ;
- donneuse d’ordres ;
- victime de l’inaction de l’enfant.

Luma est la mascotte de La Forêt des Lucioles. Les autres noms seront validés avec leurs planches graphiques.

## 12. Histoires

Chaque histoire :

- fonctionne indépendamment des autres univers ;
- utilise des chapitres courts ;
- reste compréhensible après une pause ;
- ne dépend pas d’une cadence quotidienne ;
- ne met pas le monde en danger à cause de l’enfant ;
- évite les antagonistes effrayants pour les plus jeunes.

## 13. Récompenses

Une récompense :

- appartient à un seul univers ;
- explique clairement ce qui a changé ;
- n’est pas une monnaie ;
- ne peut pas être perdue ;
- ne sert pas à comparer les enfants.

## 14. Diversité et représentation

Les six avatars initiaux respectent les tranches d’âge demandées. Les futures collections devront élargir progressivement :

- apparences ;
- coiffures ;
- vêtements ;
- lunettes ;
- handicaps visibles lorsque pertinent.

Les activités, couleurs, postures et univers ne sont jamais réservés à un genre.

## 15. Contenu intégré obligatoire

Chaque famille contient :

- `id` stable ;
- `worldId` ;
- intention réelle ;
- catégories ;
- aide adulte ;
- récompense du même univers ;
- variantes d’âge.

Chaque variante contient :

- tranche d’âge ;
- titre ;
- action réelle ;
- consigne ;
- étapes ;
- illustration ;
- durée ;
- texte alternatif.

## 16. Matrice de couverture

Le build produit une matrice :

```text
univers × tranche d’âge × nombre de variantes
```

Le pack initial cible au moins cinq variantes disponibles par univers et par tranche d’âge.

Une répartition très déséquilibrée doit être signalée avant fusion.

## 17. Validation automatique

Le build détecte :

- univers absent ou inconnu ;
- récompense d’un autre univers ;
- variante d’âge manquante ou dupliquée ;
- titre trop long ;
- consigne vide ;
- illustration absente ;
- texte alternatif absent ;
- identifiant dupliqué ;
- contenu adulte sans avertissement ;
- vocabulaire culpabilisant ;
- couverture insuffisante par âge et univers.

Une revue humaine reste obligatoire pour la sécurité, la compréhension et le ton.
