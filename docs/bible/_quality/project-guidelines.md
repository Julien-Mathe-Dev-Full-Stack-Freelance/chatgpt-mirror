# Projet — Lignes directrices

Ces règles encadrent la conception et l'implémentation du code. Elles complètent les règles d'intervention décrites dans `agent-guidelines.md`.

## Mirror & source

- Mirror public : https://github.com/Julien-Mathe-Dev-Full-Stack-Freelance/chatgpt-mirror.git
- Branche mirror : main
- Repo privé (source de vérité) : <hébergeur/URL privé non nécessaire>
- Branche source : staging
- Commit à considérer : <SHA> (optionnel — sinon, dernier de staging reflété dans le mirror)

## Principes généraux

- **Pragmatisme** : éviter la sur-ingénierie ; préférer des solutions simples et justifiées par le besoin métier.
- **Pas de `any`** : typer précisément chaque donnée ; recourir aux types utilitaires existants plutôt qu'à des cast approximatifs.
- **Types indexés** : exposer les champs via `Entity["prop"]` pour suivre automatiquement les évolutions du modèle.
- **Imports via alias** : bannir les chemins relatifs profonds au profit de `@/...`.

## Architecture & dépendances

- **Clean Architecture** : respecter le sens des dépendances (domaine → use cases → infrastructure → UI).
- **Atomic Design** : organiser les composants UI en atoms, molecules, organisms et sections/layouts.
- **Domaine** : ne jamais lever `new Error` brut ; utiliser les erreurs dédiées (`DomainError`, `UseCaseError`) avec un `ERROR_CODE` explicite.
- **Constantes** : éviter les magic strings/numbers lorsqu'une constante SoT existe (ex. `DEFAULT_CONTENT_STATE`).

## TypeScript & modules

- **Exports/imports types** : employer `export type { … }` et `import type …` dès qu'un symbole est uniquement utilisé pour le typage.
- **Annotations de fichier** : conserver les annotations (`@file`, `@intro`, …) reliant le code à la documentation SoT.
- **Hooks React** : n'utiliser les hooks (`useI18n`, `useMemo`, `useCallback`, …) qu'à l'intérieur d'un composant ou d'un hook custom, avec des tableaux de dépendances complets.

## DTOs, validation & API

- **Source de vérité des DTOs** : les adapters (API/UI) doivent typer leurs données à partir des DTO du domaine (`src/core/domain/.../dto.ts`). Ajouter le DTO manquant dans ce dossier plutôt que de dépendre directement des schémas Zod.
- **Validation API Next** : passer systématiquement par `parseDTO(schema, value)` dans `/app/api/**`. L'usage direct de `.parse()` / `.safeParse()` est interdit (règle ESLint `no-restricted-syntax`).
- **Réutilisation des helpers** : privilégier les utilitaires existants (`@/lib/guards`, `@/core/domain/slug/utils`, etc.) avant d'écrire une nouvelle logique.

## Internationalisation

- **Source des locales** : conserver les catalogues dans `src/i18n/locales` (y compris `errors`).
- **Fallback** : utiliser `createTSafe` pour gérer la chaîne de repli (locale demandée → `DEFAULT_LOCALE` → vide).
- **Client vs serveur** : `const { t } = useI18n();` dans les composants client, `const t = await getRequestT();` côté serveur (`src/i18n/server.ts`).
- **Code partagé** : dans les schémas, constantes ou helpers agnostiques des requêtes, employer `defaultT` (`src/i18n/default.ts`).

## UI & styles

- **next/image obligatoire** : remplacer `<img>` par `next/image` pour toutes les illustrations/logos côté public et admin.
- **Centralisation Tailwind** : définir les classes utilitaires partagées dans `src/infrastructure/ui` (ex. `CONTAINER_CLASS`) et les consommer depuis les composants.
- **Composition de classes** : utiliser `cn()` pour composer les classes dynamiques plutôt que les template strings.
- **Prévisualisations** : les previews d'images dans l'admin doivent elles aussi s'appuyer sur `next/image`.

## Normalisation & patchs

- **Normalizers** : nettoyer les saisies utilisateur via `src/lib/normalize.ts` avant de patcher l'état ou d'appeler un use case (URLs, slugs, handles…).
- **Patch adapters** : pour stabiliser `onPatch`, mémoriser `adaptPatchKV(patch)` via `useMemo(() => adaptPatchKV(patch), [patch])` afin d'éviter les avertissements `react-hooks/exhaustive-deps`.

## Observabilité & API

- **Logs** : utiliser `log.child({ ns: … })` pour contextualiser les messages ; aucun log dans le domaine pur.
- **Réponses API** : messages courts en anglais, enveloppe `{ settings: … }` pour les routes de réglages, et codes HTTP stables.
