/**
 * @file src/core/domain/blocks/model.ts
 * @intro Union discriminée des blocs (métier) — forme interne et invariants.
 * @layer domain/model
 * @sot docs/bible/domain/blocks/README.md#model
 * @description
 * - Déclare `TextBlock`, `ImageBlock` et l’union `Block` (discriminant `type`).
 * - S’appuie sur les unions fermées de `constants.ts` (BlockType, BlockAlignment).
 * - Expose des type-guards (`isTextBlock`, `isImageBlock`) pour sécuriser adapters/DTOs.
 * - Ne contient aucune dépendance UI/infra ; pas de side-effects.
 * @remarks
 * - Étendre ici d’abord (V2+) puis mettre à jour : schémas Zod, DTO, adapters, UI.
 */

import type { BlockType } from "@/core/domain/blocks/constants";
import type { HorizontalAlignment } from "@/core/domain/constants/layout";
import type { BlockId } from "@/core/domain/ids/schema";

// ───────────────────────────────────────────────────────────────────────────────
// Base commune des blocs
// - Discriminant `type` ∈ BlockType (union fermée).
// - `id` : identifiant métier (BlockId), jamais un `string` brut.
// - `align` : optionnel, contraint par BlockAlignment (pas de "magic strings").
// ───────────────────────────────────────────────────────────────────────────────
export interface BlockBase<T extends BlockType = BlockType> {
  id: BlockId;
  type: T;
  align?: HorizontalAlignment;
}

// ───────────────────────────────────────────────────────────────────────────────
// Blocs V1 (simples et composables)
// - Étendre ici AVANT de modifier les schémas Zod ou l'UI.
// - Garder la structure minimale : le rendu reste dans la couche UI.
// ───────────────────────────────────────────────────────────────────────────────

export interface TextBlock extends BlockBase<"text"> {
  /** Contenu textuel brut (pas de markup riche au niveau domaine). */
  text: string;
}

export interface ImageBlock extends BlockBase<"image"> {
  /** URL normalisée (via normalizers) ; absolue si exigée par l’UI. */
  src: string;
  /** Texte alternatif requis (a11y) — invariant métier, non délégué à l’UI. */
  alt: string;
  /** Dimensions optionnelles ; ratio/cover/contain relèvent de la présentation. */
  width?: number;
  height?: number;
}

/** Union discriminée consommée par les use-cases et l’UI. */
export type Block = TextBlock | ImageBlock;

// ───────────────────────────────────────────────────────────────────────────────
// Type guards — préférer ces gardes à des tests ad hoc dans les adapters.
// Invariant : la discrimination se fait uniquement via `type`.
// ───────────────────────────────────────────────────────────────────────────────
export function isTextBlock(b: Block): b is TextBlock {
  return b.type === "text";
}

export function isImageBlock(b: Block): b is ImageBlock {
  return b.type === "image";
}
