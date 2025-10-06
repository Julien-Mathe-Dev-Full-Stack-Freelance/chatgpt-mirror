# docs/bible/domain/ids/README.md

# IDs — SoT (générateur & schémas)

> **But** : fournir une génération **URL-safe** d’identifiants stables et définir les schémas/types d’IDs consumés par le domaine.  
> **Portée** : `src/core/domain/ids/*` (generator, schémas), use-cases, adapters/DTO, UI.

## 1) Contenu (SoT)

- **Generator** — [`#generator`](#generator)
  - `genId(size, allowInsecureFallback?)` : crypto-first, fallback optionnel.
  - Alphabet : `ID_ALPHABET` (`0-9`, `A-Z`, `_`, `a-z`, `-`) → **URL-safe**.
  - Politique fallback : **désactivé en production**, **activé en dev/test**.
- **Schemas** — [`#schema`](#schema)
  - `BlockId`, `PageId`, etc. (types afférents).
- **Tools** — [`#tools`](#tools)
  - _Toolkits_ par famille (`ListIdTools`, `PageIdTools`, …), `makeIdTools`, helpers (`genPageId`, `isPageId`).

## 2) Invariants

- **URL-safe** : les IDs générés ne nécessitent aucun encodage (utilisables dans des slugs/paths).
- **Crypto-first** : `crypto.getRandomValues` prioritaire ; **pas** de fallback silencieux en production.
- **Erreurs contrôlées** : input invalide ou indisponibilité crypto sans fallback → `DomainError(INTERNAL)`.

## 3) Exemples

### Générer un ID

```ts
import { genId } from "@/core/domain/ids/generator";
const id = genId(16); // ex: '3KxQOa5bXK_2t9aZ'
```

### Forcer sans fallback (ex. script prod)

```ts
genId(12, false); // jette si crypto indisponible
```

### Implémentation d’interface

```ts
import { systemIdGen } from "@/core/domain/ids/generator";
const id = systemIdGen.gen(10);
```

## 4) Relations

- **Errors** : `docs/bible/domain/errors/README.md#domain-error` (erreurs levées : `INTERNAL`).
- **Blocs** : `docs/bible/domain/blocks/README.md#model` (ex. `BlockId`).
- **Constants (web/urls)** : utiles si IDs apparaissent en URL.

---

## Generator

Ancre : `#generator`

- **Fichier** : `src/core/domain/ids/generator.ts`
- **Expose** :
  - `ID_ALPHABET`, `genId(size, allowInsecureFallback?)`, `systemIdGen`
- **Notes** :
  - Rejet de biais modulo au tirage crypto.
  - Fallback `Math.random` autorisé par défaut en dev/test, interdit en production.

---

## Schema

Ancre : `#schema`

- **Fichier** : `src/core/domain/ids/schema.ts`
- **Expose** :
  - `ID_SCHEMAS` (SoT) :
    - `list: { prefix: "lst_", size: 12 }`
    - `page: { prefix: "pg_", size: 24 }`
    - `menu: { prefix: "mnu_", size: 16 }`
    - `block: { prefix: "blk_", size: 16 }`
    - `site: { prefix: "site_", size: 12 }`
  - Types :
    - `PrefixedId<P>` ; alias `ListId`, `PageId`, `MenuId`, `BlockId`, `SiteId`
  - Helpers :
    - `getIdSchema(name)` — accès direct au schéma
    - `isIdOf(name, id)` — vérifie préfixe + taille
    - `idSchemaFor(id)` — retourne le schéma correspondant ou `null`
- **Notes** :
  - Les Template Literal Types **n’appliquent pas** la contrainte de **taille** : utiliser `isIdOf`/`idSchemaFor` au runtime si nécessaire.

---

## Tools

Ancre : `#tools`

- **Fichier** : `src/core/domain/ids/tools.ts`
- **Expose** :
  - Fabrique : `makeIdTools(name)`
  - Toolkits : `ListIdTools`, `PageIdTools`, `MenuIdTools`, `BlockIdTools`, `SiteIdTools`
  - Helpers : `genPageId`, `isPageId`
- **Docs détaillées** : voir `docs/bible/domain/ids/id-tools.md`.
