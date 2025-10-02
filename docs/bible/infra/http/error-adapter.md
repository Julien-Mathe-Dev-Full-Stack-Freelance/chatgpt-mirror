# docs/bible/infra/http/error-adapter.md

# HTTP — Error Adapter (SoT)

> **But** : définir la politique d’adaptation des erreurs **domaine** vers des réponses **HTTP** minimales, stables et non sensibles.  
> **Portée** : `src/infrastructure/http/error-adapter.ts`, routes API `app/api/**`, classe `DomainError`, codes `ErrorCode`.

## 1) Contenu (SoT)

- **Corps minimal** : `HttpErrorBody = { code: ErrorCode }` (pas de `details`, pas de `cause`).
- **Exceptions explicites** — `EXPLICIT_STATUS` :
  ```ts
  UNAUTHORIZED → 401, FORBIDDEN → 403, NOT_FOUND/PAGE_NOT_FOUND → 404, CONFLICT → 409
  ```
- **Familles par préfixe** — `PREFIX_RULES` :
  ```ts
  /^SEO_/ → 400, /^PAGE_/ → 400, /^PUBLISH_/ → 400
  ```
- **Défaut** : 500 si aucune règle ne matche.
- **Garde stricte** : `isStrictDomainError` (préférée pour éviter les faux positifs).

## 2) Invariants

- **Non divulgation** : ne jamais exposer `details`, `cause`, `stack` — réservés aux logs (`toLogJSON()`).
- **Stabilité** : `code` est l’unique information renvoyée côté client (contrat UI/i18n).
- **Ordre des règles** : exceptions **>** préfixes **>** défaut 500.
- **Couverture** : chaque nouveau `ErrorCode` doit être couvert par `EXPLICIT_STATUS` **ou** `PREFIX_RULES` (dev guard alerte sinon).

## 3) Exemples

### Route API (usage)

```ts
import { toHttpError } from "@/infrastructure/http/error-adapter";

export async function PATCH(req: Request) {
  try {
    // ... logique de use-case
    return Response.json({ ok: true });
  } catch (e) {
    const { status, body } = toHttpError(e);
    return Response.json(body, { status });
  }
}
```

### Étendre une famille

```ts
// Erreurs liées au thème → 400
PREFIX_RULES.push({ test: (c) => /^THEME_/.test(c), status: 400 });
```

### Couverture dev (extrait)

```ts
// En dev, une alerte liste les codes non couverts ; passer en throw pour fail-fast si souhaité.
if (misses.length) {
  throw new Error(`[errors] Missing HTTP mapping for: ${misses.join(", ")}`);
}
```

## 4) Relations

- **DomainError** : `docs/bible/domain/errors/README.md#domain-error` (sérialisation contrôlée).
- **Error codes** : `docs/bible/domain/errors/README.md#codes` (union fermée).
- **Constants** : `docs/bible/domain/constants/README.md` (les limites/layout/theme peuvent générer des erreurs).

---

## HTTP Error Adapter

Ancre : `#http-error-adapter`

- **Fichier** : `src/infrastructure/http/error-adapter.ts`
- **Expose** :
  - `statusFromErrorCode(code): number`
  - `toHttpErrorBody(err): { code }`
  - `toHttpError(err): { status, body }`
  - `EXPLICIT_STATUS`, `PREFIX_RULES` (politique d’adaptation)
- **Notes** :
  - Préférer `isStrictDomainError` pour reconnaître les erreurs domaine.
  - Compléter les mappings à chaque ajout de `ErrorCode`, puis tester (dev guard).
