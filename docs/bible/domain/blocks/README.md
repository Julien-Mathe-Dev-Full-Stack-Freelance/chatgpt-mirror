# docs/bible/domain/blocks/README.md

# Blocs — SoT (Single Source of Truth)

> **But** : définir les types de blocs, leur forme **métier** et les invariants partagés entre domaine, schémas et UI.  
> **Portée** : `src/core/domain/blocks/*`, schémas `src/schemas/blocks/**`, adapters/DTO liés, UI de rendu/édition.

## 1) Contenu (SoT)

- **Unions fermées (constants)**
  - `BlockType` : `"text" | "image"`.
  - `BlockAlignment` : `"start" | "center" | "end"`.
  - Guards : `isBlockType(v)`, `isBlockAlignment(v)`.
- **Modèle (model)**
  - `TextBlock`, `ImageBlock`, union `Block` (discriminant `type`).
  - `id: BlockId` (identifiant métier), `align?: BlockAlignment`.
  - Guards : `isTextBlock(b)`, `isImageBlock(b)`.
- **Extension**
  1. Ajouter le type dans `constants.ts`.
  2. Étendre le **modèle** (`model.ts`) avec l’interface dédiée.
  3. Mettre à jour les **schémas Zod** (`src/schemas/blocks/**`) et **DTO/adapters**.
  4. Implémenter le **mapping UI** (édition + rendu) sans chaînes magiques.

## 2) Invariants

- **Discrimination stricte** par `type` (pas d’inspection structurelle coûteuse).
- **A11y** : `ImageBlock.alt` est **requis** au niveau domaine.
- **Pas de logique UI** dans le modèle (cover/contain/ratio gérés en présentation).
- **Identité** : `id` est un `BlockId` typé, jamais une string arbitraire.

## 3) Exemples d’usage

### Validation d’entrée (adapter → domaine)

- Rejeter un bloc dont `type` ∉ `BlockType` (400 ou erreur domaine typée).
- Vérifier `align` via `isBlockAlignment` ou par schéma.

### Mapping UI (rendu)

- `Record<BlockType, Component>` côté UI (mapping exhaustif, pas de default silencieux).

## 4) Relations

- **Constants** : [`constants.ts`](./README.md#constants)
- **Model** : [`model.ts`](./README.md#model)
- **Schémas** : `src/schemas/blocks/**` _(à pointer précisément par bloc)_
- **DTO/Adapters** : `src/core/domain/blocks/dto/**` _(si présents)_

---

## Constants

Ancre : `#constants`

- Fichier : `src/core/domain/blocks/constants.ts`
- Expose : `BLOCK_TYPES`, `BlockType`, `BLOCK_ALIGNMENTS`, `BlockAlignment`, `isBlockType`, `isBlockAlignment`.

---

## Model

Ancre : `#model`

- Fichier : `src/core/domain/blocks/model.ts`
- Expose : `TextBlock`, `ImageBlock`, `Block`, `isTextBlock`, `isImageBlock`.
- Détails :
  - `TextBlock.text: string` — contenu brut (pas de markup riche au domaine).
  - `ImageBlock.src: string` — URL normalisée en amont ; `alt: string` requis.
  - `width?/height?` — optionnels, contraints UI au besoin.
