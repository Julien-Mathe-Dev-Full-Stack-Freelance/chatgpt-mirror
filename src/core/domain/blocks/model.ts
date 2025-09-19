/**
 * @file src/core/domain/blocks/model.ts
 * @intro Union discriminée des blocs (métier) adossée aux identifiants de bloc.
 * @layer domaine
 * @sot docs/bible/domain/blocks/README.md
 * @description
 * - Définit les entités `TextBlock` et `ImageBlock` et l'union `Block` (discriminant `type`).
 * - Typage strict via unions fermées provenant de `constants.ts` (aucune magic string).
 * - Expose des guards (`isTextBlock`, `isImageBlock`) pour sécuriser les adapters/DTOs.
 * @remarks
 */

import type { BlockAlignment, BlockType } from "@/core/domain/blocks/constants";
import type { BlockId } from "@/core/domain/ids/schema";

// ───────────────────────────────────────────────────────────────────────────────
// Base commune des blocs
// - Discriminant `type` ∈ BlockType (union fermée).
// - `id` est un identifiant métier (BlockId) — jamais un simple `string` arbitraire.
// - `align` reste optionnel et contraint par BlockAlignment.
// ───────────────────────────────────────────────────────────────────────────────
export interface BlockBase<T extends BlockType = BlockType> {
  id: BlockId;
  type: T;
  align?: BlockAlignment;
}

// ───────────────────────────────────────────────────────────────────────────────
// Blocs V1
// - Étendre ici AVANT de modifier les schémas Zod ou l'UI.
// - Garder la structure minimale, les détails de rendu restent dans la couche UI.
// ───────────────────────────────────────────────────────────────────────────────

export interface TextBlock extends BlockBase<"text"> {
  // Contenu textuel brut (pas de markup riche au niveau domaine).
  text: string;
}

export interface ImageBlock extends BlockBase<"image"> {
  // URL de la ressource (normalisée en amont par les normalizers si nécessaire).
  src: string;
  // Texte alternatif (accessibilité) : requis au niveau domaine pour ne pas déléguer à l'UI.
  alt: string;
  // Dimensions optionnelles — les contraintes UI (ratio, cover/contain) se gèrent en présentation.
  width?: number;
  height?: number;
}

// Union discriminée consommée par les use-cases et l'UI.
export type Block = TextBlock | ImageBlock;

// ───────────────────────────────────────────────────────────────────────────────
// Type guards — préférer ces gardes à des tests ad hoc dans les adapters.
// ───────────────────────────────────────────────────────────────────────────────
export function isTextBlock(b: Block): b is TextBlock {
  // Le discriminant `type` garantit une séparation sûre sans introspection coûteuse.
  return b.type === "text";
}

export function isImageBlock(b: Block): b is ImageBlock {
  return b.type === "image";
}
