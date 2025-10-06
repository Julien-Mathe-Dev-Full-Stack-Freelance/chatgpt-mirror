# docs/bible/domain/ids/id-tools.md

# IDs — Toolkits (helpers de génération/validation)

> **But** : fournir une API ergonomique, typée et **alignée sur la SoT** pour générer/valider des IDs préfixés.  
> **Portée** : `src/core/domain/ids/tools.ts` (toolkits), usages dans le domaine, l’API et l’UI.

## 1) Aperçu

Les _toolkits_ encapsulent les invariants par famille d’ID (préfixe, taille, alphabet) et exposent une API commune :

- `prefix` (ex. `"pg_"`)
- `size` (taille du suffixe aléatoire, hors préfixe)
- `re` (RegExp runtime stricte: **préfixe + taille + alphabet**)
- `gen()` → génère un ID conforme (crypto-first via `genId`)
- `is(id)` → garde de type (valide contre `re`)
- `hasPrefix(id)` → vérifie uniquement le préfixe

## 2) API

**Fichier** : `src/core/domain/ids/tools.ts`  
**Exports principaux** :

- Fabrique générique : `makeIdTools(name: IdSchemaName)`
- Toolkits spécialisés :
  - `ListIdTools`, `PageIdTools`, `MenuIdTools`, `BlockIdTools`, `SiteIdTools`
- Helpers exemples :
  - `genPageId(): PageId`
  - `isPageId(id: string): id is PageId`

**Types** :

- `Tools<P, Id>` : shape commune d’un toolkit.
- Branded/alias types : `ListId`, `PageId`, `MenuId`, `BlockId`, `SiteId` _(définis dans le schéma)_.

## 3) Exemples d’usage

### Générer un ID de page

```ts
import { PageIdTools } from "@/core/domain/ids/tools";
const pageId = PageIdTools.gen(); // "pg_xxx..."
```

### Vérifier un ID reçu (runtime + typage)

```ts
import { PageIdTools } from "@/core/domain/ids/tools";

function loadPage(id: string) {
  if (!PageIdTools.is(id)) {
    throw new Error("Invalid PageId"); // mapper vers une DomainError côté domaine si nécessaire
  }
  // ici `id` est affiné en `PageId`
}
```

### Vérifier uniquement le préfixe (cas permissif)

```ts
import { MenuIdTools } from "@/core/domain/ids/tools";

if (MenuIdTools.hasPrefix(input)) {
  // utile pour router ou parser, sans valider la taille/alphabet
}
```

## 4) Invariants & limites

- **URL-safe** : l’alphabet appliqué par la RegExp reste cohérent avec `ID_ALPHABET` du générateur.
- **Taille au runtime** : les Template Literal Types ne contraignent pas la taille → la RegExp `re` fait autorité.
- **SoT unique** : préfixes/tailles proviennent de `ID_SCHEMAS` (schéma) — ne pas dupliquer ces valeurs ailleurs.

## 5) Relations (SoT)

- **SoT global (IDs)** : voir `docs/bible/domain/ids/README.md`.
  - Générateur : `#generator`
  - Schéma : `#schema`
  - Outils (cette page) : `#tools`

## 6) Check-list d’intégration

- [ ] Utiliser **exclusivement** `ID_SCHEMAS` pour les préfixes/tailles.
- [ ] Appeler `gen()` plutôt que concaténer manuellement le préfixe.
- [ ] Valider les entrées non-fiables avec `is()` (contrat UI/API).
- [ ] Mapper les erreurs invalides vers des **DomainError** stables au besoin.
