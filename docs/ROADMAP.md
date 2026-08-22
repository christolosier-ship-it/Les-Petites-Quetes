# Feuille de route

## 1. Principe

Cette feuille de route part de l’état actuel de `main`.

Elle ne redessine pas un produit V4 théorique. Les briques déjà livrées sont considérées comme acquises ; les prochains lots doivent améliorer ou étendre le système existant sans recréer une architecture parallèle.

## 2. Socle acquis

### Domaine et données

- [x] schéma familial V3 ;
- [x] migrations V1 → V2 → V3 et V2 → V3 ;
- [x] validation runtime des imports et snapshots ;
- [x] sauvegarde automatique avant migration ;
- [x] journal de migration ;
- [x] profils enfants sans compagnon ni couleur ;
- [x] six avatars contraints par tranche d’âge ;
- [x] `worldId` dans les quêtes, planifications et occurrences ;
- [x] progression indépendante par enfant et univers ;
- [x] cohérence de progression recalculée depuis l’historique des récompenses.

### Contenus

- [x] six univers avec IDs stables ;
- [x] six mascottes nommées dans le catalogue ;
- [x] 30 familles de quêtes intégrées ;
- [x] 90 variantes, trois par famille ;
- [x] récompenses rattachées aux univers ;
- [x] 48 chapitres d’histoire intégrés ;
- [x] catalogue d’assets typé et contrôlé.

### Expérience

- [x] onboarding ;
- [x] accueil familial ;
- [x] espace enfant ;
- [x] sélection de profil ;
- [x] carrefour des six univers ;
- [x] navigation vers un monde ;
- [x] quêtes du jour et boucle de validation ;
- [x] célébration des récompenses ;
- [x] trésor / progression / histoire par monde ;
- [x] espace parent protégé par code local ;
- [x] onglets Aujourd’hui, Quêtes, Enfants, Univers et Réglages ;
- [x] création de quêtes personnalisées et planification ;
- [x] import, sauvegarde et restauration.

### PWA et livraison

- [x] PWA installable ;
- [x] service worker unique généré au build ;
- [x] aucun SW enregistré en développement ;
- [x] cache limité aux ressources locales ;
- [x] assets du diorama Firefly rapatriés dans le dépôt ;
- [x] suppression de GitHub Pages ;
- [x] previews Vercel sur branches/PR ;
- [x] production Vercel sur `main` ;
- [x] Node 24 et installation reproductible avec `npm ci`.

### Qualité

- [x] TypeScript strict ;
- [x] lint bloquant à zéro warning ;
- [x] contrôle des cycles ;
- [x] contrôle des assets ;
- [x] 85 tests automatisés ;
- [x] budget de bundle ;
- [x] CI GitHub essentielle, courte et lisible ;
- [x] audit lourd conservé en commande séparée.

## 3. Consolidation des scènes, acquise

L’architecture permettant d’étendre les univers sans copier les exceptions du premier monde est maintenant en place.

- [x] `ParallaxScene` réduit à un dispatcher ;
- [x] catalogue déclaratif de renderers ;
- [x] `GenericParallaxScene` commun ;
- [x] `FireflyForestDiorama` spécialisé ;
- [x] `FireflyForestScene` limité à la couche Three.js vivante ;
- [x] décor illustré séparé des acteurs ;
- [x] CSS générique séparé du CSS Firefly ;
- [x] suppression des anciens objets Three.js de décor inutilisés ;
- [x] suppression de la logique `sparkleGroups` morte.

Le prochain monde spécialisé ne doit pas réintroduire de `if (world.id === ...)` dans l’orchestrateur.

## 4. Prochain lot prioritaire : finir La Forêt des Lucioles

La Forêt est le premier monde ayant dépassé le stade du placeholder générique. Elle doit maintenant devenir la référence qualitative du projet.

### À faire

- [ ] harmoniser définitivement le style entre décor illustré, enfant et Luma ;
- [ ] remplacer les éléments visuels encore provisoires de la Forêt ;
- [ ] vérifier les quatre stades visuellement à taille réelle ;
- [ ] vérifier le plein écran sur smartphone et tablette ;
- [ ] contrôler les mouvements réduits ;
- [ ] contrôler le fonctionnement hors ligne après première ouverture ;
- [ ] vérifier les performances sur appareil iOS modeste ;
- [ ] supprimer toute ressource Firefly restante qui ne contribue plus au rendu final.

### Porte de sortie

La Forêt doit pouvoir servir de référence visuelle et technique sans documentation spéciale nécessaire pour comprendre ses exceptions.

## 5. Deuxième priorité : construire un monde 2 complet

Le meilleur test de l’architecture n’est plus un document, c’est un deuxième monde réel.

Ordre recommandé : **La Montagne du Dragon**.

### Objectifs

- [ ] définir si le renderer générique suffit ou si un renderer spécialisé est réellement justifié ;
- [ ] produire ses assets sans dépendance réseau ;
- [ ] utiliser les IDs déjà existants ;
- [ ] remplacer couverture et quatre stades placeholders ;
- [ ] intégrer Flammèche ;
- [ ] vérifier qu’aucune modification spécifique n’est requise dans `ParallaxScene` ;
- [ ] valider le cache, les budgets et les mouvements réduits.

### Porte de sortie

Un deuxième monde complet doit pouvoir être livré principalement par contenu, assets et éventuellement un renderer déclaré, sans duplication du moteur Firefly.

## 6. Remplacement progressif des placeholders

Après validation du monde 2, poursuivre monde par monde :

1. La Station Spatiale ;
2. Le Village des Lutins ;
3. Nature et découvertes ;
4. L’Atelier créatif.

Pour chaque univers :

- [ ] couverture définitive ;
- [ ] quatre états visuels cohérents ;
- [ ] mascotte finalisée ;
- [ ] récompenses principales illustrées ;
- [ ] illustrations de quêtes prioritaires ;
- [ ] histoire illustrée lorsque pertinente ;
- [ ] alt text ;
- [ ] budgets ;
- [ ] test mobile/tablette ;
- [ ] test hors ligne.

Il n’est pas nécessaire de produire six mondes en parallèle.

## 7. Illustrations de quêtes

Le modèle métier 30 × 3 est déjà stable. Le chantier restant est surtout graphique et éditorial.

- [ ] remplacer progressivement les placeholders par des illustrations propres aux familles/âges ;
- [ ] conserver les IDs logiques stables ;
- [ ] prioriser les quêtes réellement utilisées lors du pilote ;
- [ ] vérifier la compréhension sans texte pour les 3-5 ans ;
- [ ] éviter trois images quasi identiques si l’âge justifie une composition différente.

La production graphique ne doit pas provoquer une nouvelle refonte du domaine.

## 8. PWA et finition mobile

Le socle PWA est consolidé. Les finitions restantes concernent surtout la qualité d’installation et les appareils réels.

- [ ] fournir des icônes PWA raster adaptées à iOS, notamment pour `apple-touch-icon` ;
- [ ] tester installation et mise à jour sur Safari iOS ;
- [ ] tester reprise après changement de service worker ;
- [ ] tester un premier lancement hors connexion après installation ;
- [ ] mesurer les temps d’ouverture du chunk Firefly ;
- [ ] vérifier le comportement après plusieurs versions mises en cache.

Aucune deuxième stratégie de service worker ne doit être ajoutée pour résoudre ces points.

## 9. Accessibilité et sécurité enfant

Avant pilote élargi :

- [ ] revue clavier complète de l’espace parent ;
- [ ] revue VoiceOver / lecteur d’écran ;
- [ ] audit des textes alternatifs ;
- [ ] vérification des zones tactiles ;
- [ ] vérification des contrastes ;
- [ ] revue de tous les écrans 3-5 ans sans dépendance à la lecture ;
- [ ] vérification du mode silencieux ;
- [ ] vérification des mouvements réduits ;
- [ ] revue de toute formulation pouvant être vécue comme pression ou échec.

Les règles de `CHILD-SAFETY.md` et `CONTENT-GUIDELINES.md` restent les références produit.

## 10. Audit avant pilote

L’audit lourd n’est pas exécuté à chaque PR, mais devient obligatoire avant un jalon de diffusion.

```bash
npm run check
npm run audit
```

À compléter par :

- test iOS réel ;
- test Android réel ;
- test tablette ;
- test restauration de sauvegarde ;
- test migration depuis un jeu V1/V2 représentatif ;
- test hors ligne ;
- vérification Vercel production ;
- revue documentaire.

## 11. Pilote familial

Quand La Forêt et au moins un deuxième monde sont visuellement représentatifs :

- [ ] installer l’application chez quelques familles ;
- [ ] mesurer la compréhension de l’accueil ;
- [ ] vérifier que les enfants identifient les univers ;
- [ ] observer la compréhension des quêtes selon l’âge ;
- [ ] mesurer le temps de création parent ;
- [ ] vérifier que les pastilles ne sont pas vécues comme une pression ;
- [ ] observer l’intérêt pour la progression narrative ;
- [ ] relever les problèmes de performance et d’installation.

Le pilote doit décider des priorités suivantes à partir de l’usage réel, pas déclencher automatiquement une nouvelle refonte générale.

## 12. Évolutions de modèle possibles, mais non engagées

Le modèle V3 fonctionne actuellement sans les concepts suivants :

- entités persistantes `QuestFamily` / `QuestVariant` séparées ;
- snapshot explicite de tranche d’âge dans l’occurrence ;
- `worldId` dupliqué dans `Completion` et `RewardGrant` ;
- slots de scène persistés dans `WorldProgress` ;
- navigation URL avec routeur.

Ces sujets ne constituent **pas** une V4 planifiée.

Ils ne doivent être ouverts que si un besoin utilisateur, une limite technique ou une migration concrète le justifie.

## 13. Règle pour les prochaines PR

Une PR future doit pouvoir répondre simplement à trois questions :

1. Quel problème réel résout-elle ?
2. Quelle couche existante modifie-t-elle ?
3. Quel contrôle prouve qu’elle n’a pas cassé le reste ?

Si la réponse nécessite d’inventer un deuxième plan directeur complet, le périmètre est probablement trop large.
