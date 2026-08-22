# Cahier des charges

## 1. Objet

Les Petites Quêtes permet à un adulte de préparer de petites actions du quotidien et à un enfant de les vivre comme des aventures dans six univers illustrés.

Le contrat actuel est celui d’une PWA familiale :

- privée ;
- local-first ;
- installable ;
- utilisable sans backend applicatif ;
- pensée pour des enfants de 3 à 10 ans ;
- conçue pour limiter le temps d’écran plutôt que le maximiser.

Le multi-univers et le schéma V3 sont déjà implémentés. Les travaux restants concernent principalement la qualité graphique, l’extension des scènes, les tests sur appareils réels et le pilote familial.

## 2. Principes non négociables

- Le parent prépare, l’enfant joue.
- Chaque quête appartient à un univers précis.
- Chaque enfant possède une progression indépendante dans chaque univers.
- L’effort est valorisé, jamais la perfection.
- Une quête non réalisée ne retire rien et ne dégrade aucun monde.
- Aucun classement entre enfants.
- Aucune série à préserver.
- Aucun achat intégré, publicité, réseau social ou géolocalisation.
- Les données familiales restent locales dans l’architecture actuelle.
- Une fonction essentielle ne doit pas dépendre d’une animation ou d’un son.

## 3. Univers disponibles

| ID | Nom | Mascotte | Usage principal |
|---|---|---|---|
| `world.firefly-forest` | La Forêt des Lucioles | Luma | soirée, calme et coucher |
| `world.dragon-mountain` | La Montagne du Dragon | Flammèche | réveil et routines du matin |
| `world.space-station` | La Station Spatiale | Nova | sorties et défis de journée |
| `world.gnome-village` | Le Village des Lutins | Pico | école, lecture et organisation |
| `world.nature-discovery` | Nature et découvertes | Brindille | jardin, animaux et observation |
| `world.creativity-workshop` | L’Atelier créatif | Mimo | dessin, musique et imagination |

Ces six IDs sont les références techniques actuelles.

## 4. Profils enfants

Un profil contient :

- prénom ou pseudonyme ;
- tranche d’âge `3-5`, `6-8` ou `9-10` ;
- niveau de lecture ;
- avatar ;
- statut d’archivage.

Le catalogue propose une fille et un garçon pour chacune des trois tranches d’âge. Le runtime refuse un avatar incompatible avec l’âge du profil.

Le profil ne possède plus de compagnon, couleur personnalisée ou univers actif permanent.

## 5. Accueil familial

Après l’onboarding, l’application propose deux accès principaux :

- espace enfant ;
- espace parent.

L’espace parent est protégé par un code local à quatre chiffres.

L’espace enfant ouvre le profil actif et permet de changer de profil lorsque plusieurs enfants sont présents.

## 6. Carrefour enfant

L’enfant voit les six univers dans un carrefour.

Chaque univers peut afficher le nombre de quêtes disponibles pour l’enfant concerné. Ce nombre :

- est dérivé de l’état réel des occurrences ;
- n’est pas persisté comme score ;
- disparaît lorsqu’il vaut zéro ;
- ne représente jamais une dette ou un retard.

L’enfant ouvre ensuite le monde de son choix.

## 7. Espace d’un univers

Un espace de monde rassemble :

- sa scène ;
- ses quêtes disponibles ;
- sa progression ;
- ses récompenses ;
- son histoire.

La progression d’un monde n’est alimentée que par les récompenses rattachées à ce même monde.

## 8. Quêtes intégrées

Le catalogue courant contient :

- 30 familles logiques ;
- 90 `QuestTemplate` ;
- trois variantes par famille ;
- une variante pour chacune des tranches d’âge.

Le modèle réel utilise un `familyId` commun pour relier les trois `QuestTemplate` d’une famille.

Une quête intégrée possède notamment :

- `familyId` ;
- `worldId` ;
- titre ;
- consigne ;
- catégorie ;
- illustration ;
- tranche(s) d’âge ;
- niveau de lecture ;
- étapes ;
- mode de validation par défaut ;
- définition de récompense.

Les modèles intégrés sont en lecture seule. Le parent peut en créer une version personnalisée.

## 9. Quêtes personnalisées

Le parent peut créer une quête depuis zéro ou personnaliser un modèle intégré.

Une quête personnalisée permet actuellement de choisir :

- l’univers ;
- le titre ;
- la consigne ;
- la catégorie ;
- l’illustration enregistrée ;
- une ou plusieurs tranches d’âge compatibles ;
- le niveau de lecture ;
- la durée indicative ;
- les étapes ;
- l’aide adulte éventuelle ;
- le mode de validation ;
- la récompense ;
- une note parentale.

Le modèle courant ne crée pas trois entités `QuestVariant` persistantes séparées pour une quête personnalisée. Une évolution de ce type devra être motivée par un besoin réel et documentée comme changement de modèle.

## 10. Planification

Le parent peut préparer une quête :

- immédiatement ;
- à une date ponctuelle ;
- chaque semaine sur certains jours.

Une planification contient :

- template ;
- famille ;
- univers ;
- un ou plusieurs enfants ;
- date de début ;
- éventuelle date de fin pour une récurrence ;
- jours de semaine éventuels ;
- moment de la journée ;
- heure précise éventuelle ;
- priorité `required` ou `optional` ;
- mode de validation ;
- état suspendu ou actif.

## 11. Occurrences

La génération crée des occurrences datées pour chaque enfant concerné.

Statuts actuels :

```text
upcoming
available
started
validation-requested
completed
postponed
ignored
```

Une occurrence retient son `questTemplateId`, son `questFamilyId` et son `worldId`.

La clé métier est :

```text
scheduleId + childId + localDate
```

Le runtime interdit deux occurrences partageant cette clé.

## 12. Validation

Une quête peut être validée :

- par l’enfant ;
- par le parent ;
- ensemble.

Une réalisation ne peut être enregistrée qu’une fois pour une occurrence.

Lorsqu’une récompense est attribuée, la progression correspondante est recalculée à partir de l’historique.

## 13. Récompenses et progression

Les définitions de récompenses appartiennent à un univers.

La progression familiale est stockée par couple :

```text
childId + worldId
```

Elle contient actuellement :

- stade `0 | 1 | 2 | 3` ;
- nombre de réalisations prises en compte ;
- récompenses débloquées ;
- chapitres débloqués ;
- éventuel instant de dernière célébration.

Les seuils actuels sont déterminés par le nombre de récompenses du monde :

- 0 à 1 : stade 0 ;
- 2 à 5 : stade 1 ;
- 6 à 11 : stade 2 ;
- 12 et plus : stade 3.

Le runtime vérifie que la progression enregistrée correspond réellement aux attributions de récompenses.

## 14. Espace parent

L’espace parent possède cinq onglets :

1. Aujourd’hui ;
2. Quêtes ;
3. Enfants ;
4. Univers ;
5. Réglages.

Il permet notamment :

- validation des demandes ;
- filtrage de la bibliothèque par univers, âge et catégorie ;
- planification ;
- gestion des quêtes personnalisées ;
- gestion des routines ;
- gestion des profils ;
- consultation des progressions ;
- préférences de son, narration, animations et célébrations ;
- export/import ;
- restauration des sauvegardes automatiques ;
- changement du code parent ;
- suppression totale des données locales.

## 15. Migration des anciennes données

Le schéma courant est V3.

Le chargeur accepte les snapshots V1, V2 et V3.

Lors d’une migration V2 vers V3 :

- `accentId` et `activeWorldId` sont supprimés ;
- les avatars sont remis en conformité si nécessaire ;
- les anciennes données sans univers explicite sont rattachées à La Forêt des Lucioles ;
- les anciennes quêtes personnalisées sont signalées dans `questTemplateIdsNeedingWorldReview` ;
- une sauvegarde préalable est créée en IndexedDB ;
- le résultat est validé avant utilisation.

## 16. Sauvegarde et restauration

Le parent peut télécharger une sauvegarde JSON complète des données familiales.

Lors d’un import :

- le fichier est lu localement ;
- l’état est migré si nécessaire ;
- l’état est validé ;
- l’état actuel est sauvegardé avant remplacement ;
- le remplacement est effectué par le repository.

Les sauvegardes automatiques disponibles sont listées dans les réglages et peuvent être restaurées.

## 17. PWA et fonctionnement hors ligne

Le service worker est généré pendant le build et n’est enregistré qu’en production.

Règles actuelles :

- une seule stratégie de cache ;
- aucune dépendance graphique réseau nécessaire ;
- ressources essentielles locales précachées ;
- ressources locales dynamiques mises en cache après première utilisation ;
- anciens caches applicatifs supprimés lors de l’activation d’une nouvelle version ;
- navigation de secours vers `index.html` hors ligne.

## 18. Scènes

L’orchestrateur générique `ParallaxScene` sélectionne un renderer déclaré.

Deux renderers existent :

- `generic-parallax` ;
- `firefly-diorama`.

La Forêt des Lucioles combine un décor illustré local 2.5D et une couche Three.js chargée à la demande.

Les autres mondes utilisent actuellement le renderer générique avec des assets de stade dont plusieurs sont encore des placeholders.

Le mode mouvements réduits doit conserver toute information de progression sans dépendre du mouvement.

## 19. Assets

Les assets applicatifs passent par les registres typés de `src/assets/registry`.

La CI vérifie notamment :

- IDs ;
- métadonnées ;
- présence physique ;
- dimensions ;
- budget de poids.

Les ressources graphiques externes doivent être rapatriées, optimisées et documentées avant de devenir nécessaires au runtime.

## 20. Accessibilité et sécurité enfant

Le produit doit préserver :

- zones tactiles adaptées ;
- navigation parent utilisable au clavier ;
- mode mouvements réduits ;
- fonctionnement sans effets sonores ;
- textes alternatifs ;
- formulations non culpabilisantes ;
- absence de comparaison ;
- actions réelles compréhensibles par l’enfant ;
- temps d’écran bref.

`CHILD-SAFETY.md` et `CONTENT-GUIDELINES.md` détaillent ces règles.

## 21. Qualité technique

Une PR vers `main` doit passer la CI essentielle :

```text
architecture
cycles
assets
lint sans warning
typecheck
tests
build de production
```

Le contrôle plus lourd est disponible via :

```bash
npm run audit
```

Il n’est pas exécuté automatiquement à chaque PR afin de garder un signal CI court et utile.

## 22. Déploiement

Vercel est la plateforme de déploiement actuelle :

```text
branche / PR → preview
main         → production
```

GitHub Pages ne fait plus partie de la chaîne de livraison.

## 23. Travaux restant hors de ce contrat

Les travaux futurs ne redéfinissent pas le socle : ils l’enrichissent.

Ils concernent notamment :

- finition graphique de La Forêt des Lucioles ;
- réalisation d’un deuxième monde complet ;
- remplacement progressif des placeholders ;
- mascottes et illustrations finales ;
- finition PWA iOS ;
- accessibilité sur appareils réels ;
- pilote familial.

Le détail et l’ordre sont maintenus uniquement dans `ROADMAP.md`.
