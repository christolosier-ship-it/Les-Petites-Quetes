# Bible des assets

## 1. Rôle de ce document

Cette bible fixe les règles visuelles et techniques des assets réellement utilisés par Les Petites Quêtes.

Elle distingue clairement :

- ce qui existe dans le dépôt ;
- les placeholders encore assumés ;
- les règles à respecter lors du remplacement progressif par des visuels définitifs.

Elle ne suppose pas que les six mondes possèdent déjà leur production graphique finale.

## 2. État actuel

Le build valide actuellement **171 assets effectifs répartis dans trois registres** :

```text
src/assets/registry/assets.json
src/assets/registry/avatars.json
src/assets/registry/firefly-assets.json
```

La situation graphique est volontairement asymétrique :

- les six univers, leurs quatre stades, les quêtes et de nombreuses récompenses disposent déjà d’identifiants stables ;
- une partie importante de ces entrées pointe encore vers des SVG de placeholder ;
- La Forêt des Lucioles possède un premier diorama illustré réellement intégré ;
- les cinq images CC0 utilisées par ce diorama sont locales en WebP ;
- la couche vivante de La Forêt est générée avec Three.js ;
- les autres mondes utilisent actuellement le renderer parallaxe générique et leurs assets de stade enregistrés.

Un placeholder enregistré et explicite est préférable à un faux statut « asset final » dans la documentation.

## 3. Direction artistique commune

Tous les mondes appartiennent au même livre illustré :

- album jeunesse contemporain ;
- formes lisibles ;
- textures légères ;
- expressions chaleureuses ;
- détails compréhensibles sur tablette et smartphone ;
- animation douce ;
- aucune esthétique inquiétante pour les plus jeunes ;
- aucune interface visuelle construite autour de la culpabilité, du retard ou de la compétition.

Chaque univers peut ensuite avoir sa lumière, ses matériaux, sa palette et son rythme.

## 4. Identité actuelle des univers

| ID | Nom | Mascotte | Direction |
|---|---|---|---|
| `world.firefly-forest` | La Forêt des Lucioles | Luma | nuit douce, bois, lumière chaude, calme |
| `world.dragon-mountain` | La Montagne du Dragon | Flammèche | aube, roche ronde, chaleur, énergie du matin |
| `world.space-station` | La Station Spatiale | Nova | lumière claire, modules, étoiles, départ |
| `world.gnome-village` | Le Village des Lutins | Pico | bois, papier, école miniature, curiosité |
| `world.nature-discovery` | Nature et découvertes | Brindille | végétal, observation, saisons, petites bêtes |
| `world.creativity-workshop` | L’Atelier créatif | Mimo | couleurs, matières, formes, imagination |

Les anciens IDs `world.elven-village` et `world.creative-studio` ne doivent plus être utilisés.

## 5. Règle de licence

Le projet n’intègrere pas d’asset payant comme dépendance nécessaire à l’application.

Pour les ressources externes gratuites :

- licence explicite obligatoire ;
- usage commercial autorisé ;
- provenance conservée ;
- auteur conservé lorsque pertinent ;
- transformations documentées ;
- fichier embarqué localement avant dépendance en production.

Les ressources CC0 sont privilégiées lorsqu’elles correspondent à la direction artistique.

Les sources détaillées du diorama de La Forêt sont conservées dans `FIREFLY-FOREST-ASSETS.md`.

## 6. Aucune dépendance graphique réseau

Une ressource graphique nécessaire à l’expérience ne doit pas dépendre d’un domaine tiers à l’exécution.

Règle :

```text
source externe
→ vérification licence
→ téléchargement
→ optimisation
→ enregistrement dans le repo
→ entrée de registre
→ consommation locale
```

Openclipart est aujourd’hui une **provenance documentaire** de certaines ressources Glitch CC0. Il n’est plus un fournisseur runtime et n’apparaît pas dans le service worker.

## 7. Registre réel

Le contrat courant est :

```ts
interface AssetDefinition {
  id: string
  type: 'icon' | 'illustration' | 'avatar' | 'mascot' | 'reward' | 'sound'
  path: string
  width: number
  height: number
  alt: string
  maxBytes: number
  ageBands: readonly ('3-5' | '6-8' | '9-10')[]
  states: readonly string[]
}
```

Il n’existe actuellement pas dans ce contrat de champs `worldId`, `preload`, `fallbackId` ou `animationSlots`. Ne pas les documenter comme déjà disponibles.

Les composants résolvent un asset enregistré avec :

```ts
getAsset(id)
getAssetUrl(id)
```

Les chemins bruts ne doivent pas devenir une seconde API d’assets parallèle.

## 8. Validation automatique

`npm run check:assets` contrôle les trois registres.

Il vérifie notamment :

- IDs présents et uniques par registre ;
- métadonnées minimales ;
- dimensions entières ;
- budget `maxBytes` valide ;
- au moins une tranche d’âge ;
- présence du fichier dans `public/` ;
- poids réel inférieur ou égal au budget déclaré.

Ce contrôle fait partie de la CI GitHub essentielle.

## 9. Avatars

Le catalogue contient six avatars :

```text
avatar.child.3-5.boy
avatar.child.3-5.girl
avatar.child.6-8.boy
avatar.child.6-8.girl
avatar.child.9-10.boy
avatar.child.9-10.girl
```

Règles :

- l’avatar représente l’enfant, jamais la mascotte ;
- il doit rester lisible en petite taille ;
- il doit fonctionner sur fond clair et sombre ;
- l’âge visuel doit rester cohérent avec `ageBand` ;
- vêtements, couleurs et activités ne doivent pas enfermer les enfants dans des rôles genrés ;
- toute nouvelle entrée doit être déclarée dans `avatars.json` et validée par le catalogue.

Le runtime refuse un avatar incompatible avec l’âge du profil.

## 10. Mascottes

Chaque univers possède actuellement un identifiant et un nom de mascotte dans `worldCatalog` :

- Luma ;
- Flammèche ;
- Nova ;
- Pico ;
- Brindille ;
- Mimo.

Les visuels définitifs et jeux d’expressions ne sont pas tous produits. Le fait que l’identité métier existe ne signifie pas que tous les assets artistiques associés sont finalisés.

Principes visuels :

- silhouette reconnaissable ;
- lecture possible en petite taille ;
- émotions positives ou neutres ;
- poses d’accueil, aide, découverte et célébration ;
- aucune expression de reproche.

## 11. Scènes de monde

### Renderer générique

Les mondes sans renderer spécialisé utilisent `GenericParallaxScene`.

Une définition générique assemble des calques à profondeur variable et les révèle selon le stade de progression.

Les assets doivent donc prévoir suffisamment de marge pour de petits déplacements sans révéler de bord vide.

### La Forêt des Lucioles

La Forêt utilise `FireflyForestDiorama`, composé de deux couches distinctes :

```text
FireflyForestIllustratedBackdrop
+ FireflyForestScene (Three.js lazy)
```

Le décor 2.5D contient actuellement cinq ressources locales :

```text
public/worlds/firefly-forest/meadow.webp
public/worlds/firefly-forest/cottage.webp
public/worlds/firefly-forest/rustic-house.webp
public/worlds/firefly-forest/tree-house.webp
public/worlds/firefly-forest/foliage.webp
```

Elles sont enregistrées sous les IDs :

```text
world.firefly-forest.diorama-meadow
world.firefly-forest.diorama-cottage
world.firefly-forest.diorama-rustic-house
world.firefly-forest.diorama-tree-house
world.firefly-forest.diorama-foliage
```

La couche Three.js ne doit pas reconstruire un second décor concurrent. Elle porte actuellement :

- l’enfant ;
- Luma ;
- les étoiles ;
- la lune ;
- les lucioles.

## 12. États de progression

Les scènes utilisent quatre stades :

```text
0 → découverte
1 → premiers changements
2 → monde vivant
3 → monde enrichi
```

Le passage d’un stade à l’autre doit ajouter de la richesse, jamais représenter une dégradation provoquée par l’absence d’activité.

Un asset de stade doit être remplaçable sans changer l’identité technique du monde.

## 13. Mouvements réduits

Le mode mouvements réduits est une contrainte produit, pas un bonus.

Lorsqu’il est actif :

- la progression reste visible ;
- le parallaxe au pointeur est neutralisé ;
- les animations décoratives peuvent être arrêtées ;
- le contenu et les actions restent compréhensibles ;
- aucun élément métier ne dépend du mouvement.

## 14. Illustrations de quêtes

Le catalogue métier contient 30 familles et 90 variantes. Le registre graphique utilise encore de nombreux placeholders communs.

Le remplacement progressif doit respecter :

- compréhension de l’action sans texte ;
- composition adaptée à l’âge ;
- pas de geste dangereux ;
- cohérence avec le monde de la quête ;
- texte alternatif utile ;
- même ID d’asset tant qu’il représente la même fonction logique.

Un chantier graphique ne doit pas obliger à modifier les règles métier.

## 15. Récompenses et histoires

Les définitions métier de récompenses et de chapitres sont déjà rattachées aux six univers.

Leur couverture visuelle reste progressive.

Lorsqu’un visuel définitif remplace un placeholder :

- conserver l’ID stable lorsque le sens ne change pas ;
- mettre à jour dimensions et budget ;
- valider le fichier ;
- vérifier le rendu à taille réelle ;
- conserver le fonctionnement hors ligne.

## 16. Formats

Formats privilégiés :

### SVG

- icônes ;
- placeholders ;
- formes simples d’interface ;
- illustrations réellement vectorielles.

### WebP

- décors illustrés ;
- personnages raster ;
- récompenses complexes ;
- calques de scènes ;
- images nécessitant transparence ou compression forte.

### PNG

À réserver aux besoins de compatibilité ou de source lorsque WebP/SVG n’est pas approprié.

### Three.js

À utiliser pour des éléments dont le mouvement, la profondeur ou l’éclairage justifient réellement une couche 3D. Three.js n’est pas une obligation pour chaque monde.

## 17. Dimensions de travail recommandées

Ces dimensions restent des références de production, pas une promesse sur tous les fichiers déjà présents :

- avatar source : 1024 × 1024 px ;
- couverture : environ 1200 × 900 px ;
- illustration de quête : 768 × 768 px ;
- récompense : 512 × 512 px ;
- mascotte : 1024 × 1024 px ou vectoriel ;
- tableau de scène : environ 2048 × 1536 px avec marge de parallaxe ;
- chapitre : environ 1280 × 960 px ;
- icône PWA : 512 × 512 px.

La vérification importante reste le rendu réel sur smartphone et tablette.

## 18. Budgets

Les budgets sont déclarés **par asset dans le registre** via `maxBytes`. C’est cette valeur qui fait foi pour le build.

Garde-fous recommandés lors de la production :

- avatar : environ 180 Ko maximum ;
- couverture : environ 160 Ko ;
- illustration de quête : environ 120 Ko ;
- récompense : environ 100 Ko ;
- calque de scène : environ 250 Ko ;
- fallback aplati : environ 450 Ko.

Un besoin exceptionnel doit ajuster explicitement le budget de l’entrée concernée, pas contourner le contrôle.

## 19. Nommage

Les IDs applicatifs sont plus importants que les noms de fichiers. Ils doivent rester stables et descriptifs.

Exemples actuels :

```text
world.firefly-forest-cover
world.dragon-mountain-stage-2
quest.firefly.brush-teeth
world.firefly-forest.diorama-cottage
```

Pour les nouveaux fichiers physiques, préférer :

```text
<world>__<fonction>__<sujet>__<etat>.<ext>
```

Ne jamais réintroduire d’anciens IDs ou de noms provisoires dans les chemins stables.

## 20. Processus d’intégration

Pour un nouvel asset :

1. vérifier le besoin et l’ID logique ;
2. vérifier la licence si la source est externe ;
3. importer le fichier dans `public/` ;
4. optimiser le format et le poids ;
5. ajouter ou mettre à jour l’entrée de registre ;
6. documenter la provenance si nécessaire ;
7. exécuter `npm run check:assets` ;
8. vérifier l’écran réel et le mode mouvements réduits ;
9. vérifier la preview Vercel ;
10. fusionner uniquement avec CI verte.

## 21. Ordre graphique à venir

La priorité n’est plus de construire un « moteur cible » avant les assets : le moteur multi-univers et les renderers sont déjà séparés.

Le travail graphique restant peut donc avancer monde par monde :

1. terminer et polir La Forêt des Lucioles ;
2. produire un deuxième monde complet pour éprouver l’extensibilité du système ;
3. remplacer progressivement les couvertures/stades placeholders ;
4. enrichir les illustrations de quêtes et récompenses ;
5. finaliser mascottes et histoires.

Chaque monde doit garder son identité sans transformer le projet en six applications visuellement incompatibles.
