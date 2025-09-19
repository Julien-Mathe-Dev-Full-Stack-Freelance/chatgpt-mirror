# Domaine — Constants

Ce dossier regroupe les constantes **communes** du domaine.

## Fichiers

- `common.ts` : états de contenu, positions d’insertion.
- `layout.ts` : largeurs/alignements/espacements (unions fermées).
- `limits.ts` : **bornes métier** (titres, SEO, menus, blocs, footer, URLs).
- `web.ts` : politiques HTTP/URL/email (`ABSOLUTE_ALLOWED_PROTOCOLS`, `RELATIVE_URL_RE`). Voir [`web.md`](./web.md).

## Rappels V1

- Ces bornes sont la **SoT** : l’UI et les schémas Zod doivent consommer ces valeurs.
- Toute évolution de `limits.ts` => mettre à jour cette page et les validations associées.
- Imports **via `@/...`** uniquement.
