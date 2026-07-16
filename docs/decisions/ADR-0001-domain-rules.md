# ADR-0001 — Règles du premier domaine métier

## Statut

Proposé avec le lot profils, modèles de quêtes et validation.

## Contexte

Les documents de cadrage fixent les concepts généraux. Ce lot précise les limites nécessaires pour disposer de règles déterministes et testables.

## Profils

- Le profil utilise uniquement un nom d’affichage, une tranche d’âge large, un niveau de lecture et des références visuelles.
- Le nom d’affichage est normalisé et limité à 30 caractères.
- Un profil archivé reste conservé mais doit être restauré avant modification.
- L’archivage et la restauration sont idempotents.

## Modèles de quêtes

- Un modèle intégré est en lecture seule.
- Sa personnalisation crée une nouvelle entité `custom` avec un nouvel identifiant.
- Les tranches d’âge sont obligatoires, uniques et contrôlées à l’exécution.
- Les limites maximales de mots utilisent la tranche d’âge la plus jeune sélectionnée.
- Aucun minimum de mots n’est imposé au titre afin de préserver la création rapide. La qualité narrative reste vérifiée humainement.
- Une quête destinée aux 6 à 8 ans contient au maximum trois étapes. Les autres restent plafonnées à huit étapes.
- Une durée indicative est un entier compris entre 1 et 180 minutes.
- Le domaine contrôle la structure et les limites. Il ne juge pas automatiquement la qualité pédagogique d’une phrase.

## Validation

- Le mode `child` termine immédiatement l’occurrence.
- Les modes `parent` et `together` créent une demande de validation.
- Une confirmation termine l’occurrence.
- Les demandes et confirmations répétées restent idempotentes.
- Une occurrence terminée ne redevient jamais disponible.
- Le choix « une petite étape reste à faire » remet l’occurrence à l’état disponible.
- Le choix « regarder ensemble » conserve la demande ouverte.
- `validationNote` contient uniquement un code neutre : `small-step-remains` ou `review-together`.
- L’interface traduira ces codes avec le catalogue éditorial.
- Ce lot ne crée ni achèvement persistant, ni récompense, ni progression.

## Conséquences

- Le domaine reste indépendant de React, du navigateur, du stockage et de l’heure système.
- Les futures validations d’import pourront réutiliser les mêmes factories.
- La planification, la génération d’occurrences et les récompenses restent dans des lots séparés.
