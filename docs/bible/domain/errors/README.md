# docs/bible/domain/errors/README.md

# Errors — SoT (codes & classe d’erreur)

> **But** : définir la **classe d’erreur métier** et la liste **canonique** des codes exposés aux couches API/UI et à l’i18n.  
> **Portée** : `src/core/domain/errors/*`, routes API, use-cases, adapters/DTO, i18n (`errors.*` / `validation.*`).

## 1) Contenu (SoT)

- **Codes** — [`#codes`](#codes)
  - `ERROR_CODES` → `type ErrorCode` (union fermée)
  - `isErrorCode(v)` (guard robuste)
- **DomainError** — [`#domain-error`](#domain-error)
  - Classe `DomainError` : { `code: ErrorCode`, `message?`, `details?`, `cause?` }
  - Sérialisations :
    - `toJSON()` : **safe** pour UI/API (sans details/cause).
    - `toLogJSON()` : **logs uniquement** (ajoute details, cause normalisée, stack).
  - Guards : `isDomainError(v)` (souple), `isStrictDomainError(v)` (strict).

## 2) Invariants

- **Séparation des responsabilités** :
  - **Schémas/Zod** → erreurs `validation.*` (forme : type, min/max).
  - **Domaine** → `ErrorCode` (contraintes métier, cohérence, cross-field).
- **Contrat public** : les codes sont **stables** (mappages API/UI/analytics).
- **Sanitization** : `toJSON()` **n’expose jamais** `details` ni `cause`.
- **Logs** : `toLogJSON()` réservé à l’observabilité (ne pas renvoyer côté client).
- **Path adressable** : `IssuePath` décrit précisément où se situe le problème (clé/index/champ).
- **i18n** :
  - `BlockingIssue.code` → i18n `errors.*`
  - `UiWarning.code` → i18n `warnings.*` (espace de noms UI/local)

## 3) Exemples

### Lancer une erreur métier depuis un use-case

```ts
import { DomainError } from "@/core/domain/errors/domain-error";
import { ERROR_CODES } from "@/core/domain/errors/codes";

if (slugIsReserved(input.slug)) {
  throw new DomainError({
    code: ERROR_CODES.PAGE_SLUG_RESERVED,
    message: "Slug réservé",
    details: { slug: input.slug },
  });
}
```

### Mapper vers HTTP dans une route

```ts
import { isStrictDomainError } from "@/core/domain/errors/domain-error";

export function toHttp(err: unknown) {
  if (isStrictDomainError(err)) {
    switch (err.code) {
      case "UNAUTHORIZED":
        return [401, err.toJSON()];
      case "FORBIDDEN":
        return [403, err.toJSON()];
      case "NOT_FOUND":
        return [404, err.toJSON()];
      case "CONFLICT":
        return [409, err.toJSON()];
      default:
        return [400, err.toJSON()]; // ou 422 selon politique
    }
  }
  return [500, { name: "InternalError", message: "Internal Server Error" }];
}
```

### Logging structuré

```ts
try {
  // …
} catch (e) {
  if (isStrictDomainError(e)) {
    logger.error("domain_error", e.toLogJSON());
  } else {
    logger.error("unexpected_error", { message: String(e) });
  }
}
```

## 4) Relations

- **Codes** : [`codes.ts`](#codes)
- **DomainError** : [`domain-error.ts`](#domain-error)
- **Constants** : `docs/bible/domain/constants/README.md` (limits/layout peuvent générer issues)
- **Infra HTTP** : `docs/bible/infra/http/error-adapter.md` (uniquement pour erreurs bloquantes)
- **i18n** : `src/i18n/locales/**` (clés `errors.*`), distinct des `validation.*`.

---

## Codes

Ancre : `#codes`

- **Fichier** : `src/core/domain/errors/codes.ts`
- **Expose** :
  - `ERROR_CODES` (object canonique)
  - `type ErrorCode` (union)
  - `isErrorCode(v)` (guard robuste)
- **Notes** :
  - Ajouter un code → MAJ i18n (`errors.<CODE>`), mapping API, tests.

---

## DomainError

Ancre : `#domain-error`

- **Fichier** : `src/core/domain/errors/domain-error.ts`
- **Expose** :
  - `class DomainError` (constructeur `DomainErrorInit`)
  - `toJSON()` (safe), `toLogJSON()` (logs)
  - `isDomainError(v)` (souple), `isStrictDomainError(v)` (strict)
- **Notes** :
  - `isStrictDomainError` vérifie `name === "DomainError"` **et** `code ∈ ErrorCode`.
  - `details`/`cause` ne sont **jamais** exposés côté client.

---

## Issue types

Ancre : `#issue-types`

- **Fichier** : `src/core/domain/errors/issue-types.ts`
- **Expose** :
  - `type IssuePath = ReadonlyArray<string | number>`
  - `type BlockingIssue = { code: ErrorCode; path: IssuePath; meta? }`
  - `type UiWarning<C = string> = { code: C; path?; meta? }`
- **Notes** :
  - Les **warnings** servent au feedback d’édition (UI) ; ne pas les exposer en tant qu’erreurs HTTP.
  - Des **type-guards** optionnels peuvent être ajoutés si ces objets proviennent d’IO/JSON.
