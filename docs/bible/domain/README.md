# Domaine — Référence

Le dossier `src/core/domain` est la source de vérité métier. On y trouve les entités, use cases, erreurs, générateurs d'identifiants et utilitaires nécessaires au fonctionnement du studio Compoz.

## Sous-domaines

### Blocks (`src/core/domain/blocks`)

- **`constants.ts`** : types de blocs supportés (`text`, `image`), alignements autorisés et helpers de garde.
- **`model.ts`** : union discriminée des blocs (`TextBlock`, `ImageBlock`) adossée aux `BlockId`.
- Ces types sont réutilisés par les schémas (`@/schemas/blocks`) et par les use cases de pages.

### Constantes (`src/core/domain/constants`)

- Centralise les limites (longueurs, tailles), les layouts par défaut, les URLs et la configuration web.
- Fournit des symboles consommés par les use cases (ex. `DEFAULT_CONTENT_STATE`, `POS_APPEND`).

### Entités (`src/core/domain/entities`)

- Types transverses (ex. `DomainEntityMeta`) partagés entre pages et site.

### Erreurs (`src/core/domain/errors`)

- Codes d'erreurs (`codes.ts`) et typages (`DomainError`, `UseCaseError`).
- `error-adapter.ts` traduit les erreurs métier vers des enveloppes HTTP/UI.

### Identifiants (`src/core/domain/ids`)

- `schema.ts` documente la forme des identifiants (préfixes, longueurs) via Zod.
- `tools.ts` expose les helpers de génération (`genPageId`, `genBlockId`).

### Pages (`src/core/domain/pages`)

- `entities/page.ts` : entité canonique `Page` (id, slug, layout, blocks, meta).
- `defaults` : valeurs initiales d'une page (layout, blocks, meta).
- `validators/slugs.ts` : règles de normalisation/validation des slugs.
- `ports/pages-repository.ts` : contrat du dépôt (persist, ensureBase, exists, put, delete).
- `use-cases/**` : orchestration métier (`create-page`, `update-page`, `delete-page`) avec erreurs/typage associés.

### Site (`src/core/domain/site`)

- `dto.ts` et `entities/**` : représentation du site (menus, SEO, identité, theme).
- `defaults/**` : valeurs par défaut pour chaque sous-partie (header, footer, social…).
- `index/**` : actions et helpers pour maintenir l'index des pages (utilisé par `createPage`).
- `use-cases/**` : scénarios d'édition (`update-*-settings`, `publish-site`), chacun avec erreurs/types dédiés.
- `validators/**` : validations spécifiques (menus, identity, publish, SEO, social, theme).

### Slug & URLs (`src/core/domain/slug`, `src/core/domain/urls`)

- Helpers de normalisation des slugs (`normalizeSlug`, `isReservedSlug`, `isValidSlug`).
- Fonctions utilitaires sur les URLs (`href`, `mailto`, comparaisons) utilisées par le site public.

### Utils (`src/core/domain/utils`)

- `clock.ts` : horloge injectable (`systemClock.nowIso`).
- `deep-freeze.ts` : utilitaire pour figer les constantes domaine.

## Règles V1 à vérifier

- Chaque use case doit n'exposer que des dépendances injectées via ports (aucun accès direct à l'infrastructure).
- Documenter les invariants métier (slug unique par état, limites de contenu, propagation index).
- Garder les annotations JSDoc (`@file`, `@intro`, `@layer`) alignées avec la doc.
- Ajouter dans cette page les liens vers les modules documentés au fur et à mesure (checklist à tenir dans `../_roadmap/src-inventory.md`).

## Liens utiles

- Validation associée : [`../../schemas`](../../schemas)
- Adapters/persistance : [`../infrastructure`](../infrastructure)
- Utilitaires partagés : [`../lib`](../lib)
