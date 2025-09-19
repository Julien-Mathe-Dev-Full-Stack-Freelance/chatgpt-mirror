# Lib — Utilitaires partagés

Le dossier `src/lib` regroupe les helpers transverses utilisés par plusieurs couches (domaine, infrastructure, UI). Ils évitent la duplication de logique et imposent certains patterns (logs, diff, normalisation, HTTP).

## Vue d'ensemble

### Racine

- `abortError.ts` : fabrique d'erreurs abortables (pattern fetch/abort controller).
- `cn.ts` : wrapper Tailwind pour composer des classes conditionnelles.
- `diff.ts`, `merge.ts`, `patch.ts` : outils de manipulation d'objets immuables (diffs, merges, patch KV).
- `guards.ts` : helpers de type guards (`isPresent`, `isNonEmptyString`, etc.).
- `log.ts` : instanciation du logger (`pino`-like) avec `log.child`.
- `normalize.ts` : normalisation d'entrées utilisateur (slug, url, handles).
- `notify.ts`, `notify-presets.ts` : helpers de notifications UI.
- `zod-bootstrap.ts` : configuration initiale Zod (localisation des messages, format). Utilisé par `src/schemas/setup-zod.ts`.

### API (`src/lib/api`)

- `handle-route.ts` : enveloppe commune aux API routes (logs, parsing `?state`).
- `responses.ts` : helpers `jsonOk`, `jsonHttpError`, `serverError`.
- `urls.ts` : parsing des query params (`state`, slugs, etc.).

### HTTP (`src/lib/http`)

- `api-fetch.ts` : fetch wrapper typé (timeout, instrumentation).
- `read-json.ts` : parser JSON sécurisé pour les réponses API.
- `validation.ts` : mapping d'erreurs Zod → HTTP (`zodToHttp`).

### Public (`src/lib/public`)

- `content.ts` : lecture du contenu publié (pages/settings) côté site public.

### UI (`src/lib/ui`)

- Helpers spécifiques aux previews (classes header/footer/social) partagés entre composants admin/public.

## Bonnes pratiques V1

- Toujours importer ces helpers plutôt que réimplémenter la logique dans un composant ou un use case.
- Ajouter la JSDoc `@intro` / `@layer` lorsque de nouveaux modules sont créés.
- Tenir cette page à jour lorsque de nouveaux sous-dossiers apparaissent (`analytics`, `tracking`, etc.).
