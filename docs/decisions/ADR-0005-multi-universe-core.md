# ADR-0005 — Le multi-univers devient un concept métier central

## Statut

Accepté pour le prochain cycle de développement.

## Contexte

La première V1 a été construite autour de La Forêt des Lucioles afin de valider la boucle familiale complète. Le produit cible doit cependant proposer plusieurs univers spécialisés par contexte de vie : soir, matin, sorties, école, nature et créativité.

Conserver La Forêt des Lucioles comme univers global créerait plusieurs incohérences :

- toutes les quêtes feraient progresser le même décor ;
- les mascottes des futurs univers seraient de simples habillages ;
- les contenus d’âge resteraient trop génériques ;
- les composants finiraient par contenir des conditions spécifiques à chaque monde ;
- les scènes parallaxes seraient difficiles à charger et versionner indépendamment.

## Décision

L’univers devient une propriété métier obligatoire de toute famille de quête.

Chaque univers possède :

- un identifiant stable ;
- un nom public modifiable ;
- un périmètre éditorial ;
- une mascotte ;
- une progression par enfant ;
- un catalogue de récompenses ;
- des chapitres ou découvertes ;
- une scène parallaxe déclarative ;
- un fallback statique.

La progression est calculée par couple `childId + worldId`.

Les catégories restent transversales. Elles servent à la recherche et au filtrage mais ne déterminent pas la progression.

## Contenus adaptés à l’âge

Une quête intégrée est modélisée comme une famille commune et des variantes par tranche d’âge. Une planification multi-enfants résout la variante appropriée au moment de créer chaque occurrence.

Une occurrence mémorise l’univers et la variante utilisés afin que l’historique ne change pas lors d’une évolution future du contenu.

## Profils enfants

Les champs de compagnon, couleur et univers actif sont supprimés.

Le profil conserve :

- prénom ou pseudonyme ;
- tranche d’âge ;
- niveau de lecture ;
- avatar.

La collection initiale contient un avatar garçon et un avatar fille pour chacune des trois tranches d’âge.

## Navigation

L’accueil familial contient deux accès de même niveau : enfant et parent.

L’espace enfant ouvre ensuite un carrefour de six univers. Une pastille rouge indique le nombre de quêtes actuellement disponibles dans chaque univers et disparaît à zéro.

## Architecture

Les variations de monde sont pilotées par :

- `WorldDefinition` ;
- les catalogues de contenus ;
- les manifestes de scènes ;
- le registre d’assets.

Les composants et services applicatifs ne doivent pas contenir de logique spécifique à un identifiant d’univers, sauf dans les adaptateurs de contenu explicitement dédiés.

## Données

Le prochain schéma est V3. La migration V2 vers V3 devra :

- sauvegarder l’état courant ;
- convertir les anciens profils ;
- attribuer un univers à chaque contenu et occurrence ;
- conserver la progression historique existante ;
- signaler les quêtes personnalisées dont l’univers doit être revu ;
- valider la cohérence entre quête, récompense et progression.

## Assets et PWA

Les couvertures des univers, avatars et contenus textuels restent légers et disponibles immédiatement. Les scènes parallaxes sont chargées par univers puis mises en cache. Un fallback statique garantit que l’usage d’une quête ne dépend jamais du téléchargement d’une animation.

## Conséquences

### Positives

- ajout de nouveaux univers sans refonte du moteur ;
- progression cohérente avec le contexte réel de la quête ;
- contenus réellement adaptés à l’âge ;
- assets et histoires chargeables indépendamment ;
- meilleure séparation entre avatar enfant et mascotte narrative.

### Coûts

- migration V2 vers V3 ;
- refonte du catalogue de quêtes ;
- nouvelle navigation enfant ;
- volume d’assets nettement supérieur ;
- tests supplémentaires sur les compatibilités d’âge et d’univers.

## Décisions différées

- nom public des univers nature et créativité ;
- nom et design des cinq mascottes restantes ;
- nombre final de paliers par univers ;
- technique d’animation retenue après prototype parallaxe.

## Documents liés

- [Plan directeur multi-univers](../MULTI-UNIVERSE-PLAN.md)
- [Modèle de données](../DATA-MODEL.md)
- [Bible des assets](../ASSET-BIBLE.md)
- [Feuille de route](../ROADMAP.md)
