/**
 * @file src/core/domain/blocks/constants.ts
 * @intro Source de vérité des types de blocs supportés et de leurs contraintes d'alignement.
 * @layer domaine
 * @sot docs/bible/domain/blocks/README.md
 * @description
 * - Expose l'union fermée `BlockType` (ex. "text" | "image") et les ensembles d'alignements autorisés.
 * - Fournit des helpers de garde (ex. `isBlockType`, `isBlockAlignment`) pour sécuriser les adapters/DTOs.
 * - Ne contient aucune logique UI/infra ; pas de side-effects.
 * @remarks
 */

// ───────────────────────────────────────────────────────────────────────────────
// Types de blocs supportés (union fermée).
// Étendre ici AVANT de modifier `model.ts` ou les schémas `src/schemas/blocks/**`.
// ───────────────────────────────────────────────────────────────────────────────
export const BLOCK_TYPES = ["text", "image"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

// ───────────────────────────────────────────────────────────────────────────────
// Alignements autorisés (génériques au niveau bloc).
// Union fermée → mapping exhaustif côté UI (pas de magic strings).
// Si un bloc nécessite un set dédié (ex. image), introduire un `IMAGE_ALIGNMENTS` séparé.
// ───────────────────────────────────────────────────────────────────────────────
export const BLOCK_ALIGNMENTS = ["start", "center", "end"] as const;
export type BlockAlignment = (typeof BLOCK_ALIGNMENTS)[number];

// ───────────────────────────────────────────────────────────────────────────────
// Type guards compacts pour sécuriser les adapters/DTOs.
// Préférer ces gardes à des regex/transformations fragiles.
// ───────────────────────────────────────────────────────────────────────────────
export function isBlockType(v: unknown): v is BlockType {
  return (
    typeof v === "string" && (BLOCK_TYPES as readonly string[]).includes(v)
  );
}

export function isBlockAlignment(v: unknown): v is BlockAlignment {
  return (
    typeof v === "string" && (BLOCK_ALIGNMENTS as readonly string[]).includes(v)
  );
}
