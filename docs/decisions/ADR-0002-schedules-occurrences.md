# ADR-0002 — Planification et génération des occurrences

## Statut

Proposé avec le lot planification et occurrences.

## Contexte

La V1 doit créer des quêtes ponctuelles ou récurrentes sans dépendre du fuseau du navigateur, sans dupliquer les occurrences et sans considérer une absence de réalisation comme un échec.

## Dates locales

- Une date métier utilise exclusivement le format `YYYY-MM-DD`.
- Le domaine ne lit jamais l’heure système et n’appelle pas `new Date()`.
- Les calculs de jours, années bissextiles et jours de semaine sont purs.
- Une fenêtre de génération est inclusive et limitée à 370 jours.
- Une heure précise reste facultative et utilise le format `HH:mm`.
- Le moment de la journée reste un concept distinct de l’heure exacte.

## Planifications

Trois types sont supportés :

- `immediate` : une occurrence à la date de démarrage fournie par l’application ;
- `one-off` : une occurrence ponctuelle ;
- `weekly` : plusieurs jours de semaine, avec une date de fin facultative.

Règles :

- au moins un enfant est requis ;
- un enfant ou un jour ne peut apparaître deux fois ;
- une planification non hebdomadaire ne contient ni jours de semaine ni date de fin ;
- une date de fin hebdomadaire ne précède jamais la date de début ;
- suspension et reprise sont idempotentes ;
- une planification supprimée est en lecture seule.

## Génération

- La génération reçoit explicitement une fenêtre, la date du jour, un instant technique et une factory d’identifiants.
- Elle retourne uniquement les nouvelles occurrences à persister.
- La clé d’idempotence est le triplet `scheduleId`, `childId`, `localDate`.
- Toute occurrence existante bloque une recréation, y compris une occurrence terminée ou représentée par un tombstone.
- Une collision d’identifiant est refusée explicitement.
- Un profil archivé ou supprimé est ignoré.
- Un identifiant d’enfant introuvable est traité comme une incohérence de données.
- Une planification suspendue ou supprimée ne génère rien.

## Statuts temporels

- Une occurrence postérieure à la date du jour est `upcoming`.
- Une occurrence du jour ou antérieure est `available`.
- Une fonction séparée rend disponibles les occurrences arrivées à échéance.
- Aucune occurrence passée n’est automatiquement ignorée, manquée ou échouée.
- Aucun compteur, série ou retrait de récompense ne dépend du calendrier.

## Conséquences

- La future couche applicative fournira l’horloge et les identifiants.
- IndexedDB stockera les planifications et occurrences dans un lot ultérieur.
- Les transitions manuelles de report et d’ignorance restent hors de ce lot.
- Le comportement reste identique lors des changements d’heure, car les jours métier ne sont pas calculés à partir d’instants UTC.
