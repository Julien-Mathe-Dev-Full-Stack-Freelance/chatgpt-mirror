# UI — Atomic Design & hooks

Cette section décrit la couche présentation : composants React, constantes d'UI et hooks. L'objectif est de garantir la cohérence visuelle et l'usage des bons helpers.

## Composants (`src/components`)

### Admin

- Arborescence Atomic Design (`atoms`, `molecules`, `organisms`, `sections`, `layouts`).
- `pages/` : composition des écrans admin (ex. `PagesPage`).
- `previews/` : rendus temps réel des blocs/pages (utilise `@/lib/ui/*`).
- `theme/ThemeProvider` : applique les classes `admin-theme`.

### Public-site

- `layouts/` : composition des pages publiques (`Hero`, `Footer`, etc.).
- Doit rester découplé des composants admin (mutualiser via `@/components/shared`).

### Shared

- `theme/` : providers/bridges communs aux deux espaces.

### UI

- Bibliothèque de primitives (Button, Input, Tabs…) inspirée de shadcn, stylée via `cn()` + tokens `src/infrastructure/ui`.

## Constantes (`src/constants`)

- `admin/` et `shared/` : chaînes, classes Tailwind, mapping d'icônes.
- Sont importées par les composants pour garder un style homogène (pas de magic string dans l'UI).

## Hooks (`src/hooks`)

- `_shared/` : hooks réutilisables (ex. `useContentState`, `useDebouncedValue`).
- `admin/` : hooks spécifiques (gestion d'intents, API admin, notifications).
- Respecter les conventions React (`use` prefix, dépendances complètes, pas d'appel conditionnel).

## Points de contrôle V1

- Utiliser systématiquement les primitives `src/components/ui` avant de créer un nouveau composant de base.
- Documenter toute nouvelle constante ou hook dans cette page et dans l'inventaire.
- Garder la JSDoc alignée avec la doc (expliquer le rôle et les invariants de chaque hook/composant majeur).
