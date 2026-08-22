# La Forêt des Lucioles — sources d’assets

## Règle du monde 1

La Forêt des Lucioles n’utilise que des ressources gratuites dont la licence autorise explicitement leur usage dans le projet. Aucun asset payant ne doit être ajouté au dépôt.

La première scène Three.js est volontairement procédurale : arbres, clairière, enfant en pyjama, Luma, champignons, lanterne, banc et lucioles sont construits avec des primitives Three.js. Cela donne un prototype complet sans verrouiller le projet sur un pack externe.

Les futurs remplacements de ces primitives doivent privilégier les sources CC0 ci-dessous.

## Sources validées

### Quaternius — Stylized Nature MegaKit

- Usage prévu : arbres, plantes, rochers, champignons et végétation principale.
- Formats disponibles : FBX, OBJ, Blend et glTF.
- Licence : CC0.
- Source : https://quaternius.com/packs/stylizednaturemegakit.html

### Quaternius — Ultimate Stylized Nature Pack

- Usage prévu : variantes d’arbres et éléments végétaux complémentaires.
- Formats disponibles : FBX, OBJ, Blend et glTF.
- Licence : CC0.
- Source : https://quaternius.com/packs/ultimatestylizednature.html

### Kenney — Nature Kit

- Usage prévu : pierres, végétation secondaire et remplissage de scène.
- Licence : CC0.
- Source : https://kenney.nl/assets/nature-kit

### Kenney — Mini Forest

- Usage prévu : quelques éléments de micro-scènes si leur style reste cohérent avec la direction générale.
- Licence : CC0.
- Source : https://kenney.nl/assets/mini-forest

### Kenney — Particle Pack

- Usage prévu : halos, particules, poussières lumineuses et variantes de lucioles.
- Licence : CC0.
- Source : https://kenney.nl/assets/particle-pack

### Quaternius — Universal Base Characters

- Usage éventuel : remplacer le personnage enfant procédural par un personnage gratuit et riggé après validation visuelle.
- Limite : les proportions disponibles sont surtout Regular, Superhero et Teen ; aucune intégration ne doit être faite tant qu’un rendu réellement enfant n’est pas validé.
- Licence : CC0.
- Source : https://quaternius.com/packs/universalbasecharacters.html

### Quaternius — Universal Animation Library

- Usage éventuel : marche, idle, observation et petites réactions du personnage humanoïde.
- Licence : CC0.
- Source : https://quaternius.com/packs/universalanimationlibrary.html

## Dépendance de rendu

Three.js est distribué sous licence MIT. Le projet utilise la version déclarée dans `package.json`.

## Règle d’intégration future

Avant d’ajouter un fichier externe dans `public`, conserver dans ce document :

1. son pack d’origine ;
2. son auteur ;
3. sa licence ;
4. son rôle dans la scène ;
5. les transformations appliquées ;
6. le nom de fichier final dans le dépôt.

Une ressource dont la licence est absente, ambiguë ou non commerciale n’entre pas dans le projet.
