# docs/bible/domain/constants/web.md

# Constants — Web SoT

> **But** : définir les garde-fous liés aux interactions web : protocoles absolus, URLs relatives et emails ASCII.  
> **Portée** : `src/core/domain/constants/web.ts`, schémas/DTO qui consomment ces règles, use-cases liés aux liens et formulaires.

## 1) Contenu (SoT)

- **Protocoles absolus**
  - `ABSOLUTE_ALLOWED_PROTOCOLS = ["http:", "https:"]`
  - `type AbsoluteAllowedProtocol`
  - Guard : `isAbsoluteHttpProtocol(v)`
- **URLs relatives**
  - Regex `RELATIVE_URL_RE` : commence par `/`, interdit `//` (protocol-relative) et `\`.
  - Guard : `isRelativeUrl(v)`
- **Emails simples (ASCII)**
  - Regex `SIMPLE_EMAIL_RE` (sans internationalisation).
  - Guard : `isSimpleEmail(v)`

## 2) Invariants

- **Protocoles** : seuls `http:` et `https:` sont autorisés pour les liens sortants → extension nécessite une revue sécurité/SEO.
- **URLs relatives** :
  - Commencent par `/`.
  - Jamais `//` (évite protocol-relative) ni `\`.
  - Limité aux caractères ASCII usuels (prévisibilité côté admin & site).
- **Emails** : uniquement ASCII, sans IDN ; garantie de compatibilité RFC 6068 (`mailto:`).

## 3) Exemples d’usage

### Validation (adapter → domaine)

- Rejeter un lien externe avec `ftp:` ou `javascript:`.
- Valider un path relatif reçu depuis un DTO avant mapping.
- Vérifier un email fourni dans un formulaire admin.

### Schémas Zod

```ts
z.string().regex(RELATIVE_URL_RE);
z.string().regex(SIMPLE_EMAIL_RE);
```

### Use-case

Publication d’un site → refuser toute ressource externe hors http:/https:.

Normaliser les menus/admin pour ne contenir que des chemins relatifs valides.

## 4) Relations

Urls (constants) : urls.ts
(chemins relatifs canoniques)

Helpers URL : src/core/domain/urls/href.ts (composition rel() / href())

Infra HTTP : adaptateurs qui construisent des liens/headers
