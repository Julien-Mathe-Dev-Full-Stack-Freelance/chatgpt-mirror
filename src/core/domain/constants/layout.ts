/**
 * @file src/core/domain/constants/layout.ts
 * @intro Constantes de layout métier : alignements (H/V) et échelons d’espacement.
 * @layer domain/constants
 * @sot docs/bible/domain/constants/README.md#layout
 * @description
 * - Source de vérité des unions fermées utilisées par les pages/sections (pas de magic strings).
 * - Expose des type-guards (`isHorizontalAlignment`, `isVerticalAlignment`, `isSpacingStep`).
 * - Domaine pur : aucune dépendance UI/infra, aucun side-effect.
 * @remarks
 * - Les valeurs d’alignement reflètent celles des blocs ("start" | "center" | "end").
 * - L’UI réalise le mapping vers les classes utilitaires (tokens centralisés).
 */

// ───────────────────────────────────────────────────────────────────────────────
// Alignements horizontaux / verticaux
// - Même sémantique que les blocs: "start" | "center" | "end".
// - L'UI traduit ces valeurs en classes utilitaires (tokens centralisés).
// ───────────────────────────────────────────────────────────────────────────────
const H_ALIGNMENTS = {
  START: "start",
  CENTER: "center",
  END: "end",
} as const;
export type HorizontalAlignment =
  (typeof H_ALIGNMENTS)[keyof typeof H_ALIGNMENTS];
// export const H_ALIGNMENT_VALUES = Object.values(
//   H_ALIGNMENTS
// ) as readonly HorizontalAlignment[];

// export const V_ALIGNMENTS = {
//   START: "start",
//   CENTER: "center",
//   END: "end",
// } as const;
// export type VerticalAlignment =
//   (typeof V_ALIGNMENTS)[keyof typeof V_ALIGNMENTS];
// export const V_ALIGNMENT_VALUES = Object.values(
//   V_ALIGNMENTS
// ) as readonly VerticalAlignment[];

// Défauts raisonnables pour une section standard.
// export const DEFAULT_H_ALIGN: HorizontalAlignment = H_ALIGNMENTS.START;
// export const DEFAULT_V_ALIGN: VerticalAlignment = V_ALIGNMENTS.START;

// /** Garde de type robuste (param `unknown`) */
// export function isHorizontalAlignment(v: unknown): v is HorizontalAlignment {
//   return (
//     typeof v === "string" &&
//     H_ALIGNMENT_VALUES.includes(v as HorizontalAlignment)
//   );
// }
// /** Garde de type robuste (param `unknown`) */
// export function isVerticalAlignment(v: unknown): v is VerticalAlignment {
//   return (
//     typeof v === "string" && V_ALIGNMENT_VALUES.includes(v as VerticalAlignment)
//   );
// }

// ───────────────────────────────────────────────────────────────────────────────
// Échelons d'espacement horizontal (rythme)

// ───────────────────────────────────────────────────────────────────────────────
// Échelons d'espacement vertical (rythme)
// - Permet de normaliser les "gaps" entre blocs/sections.
// - L'UI mappe les échelons → classes Tailwind via tokens infra UI.
// ───────────────────────────────────────────────────────────────────────────────
// export const SPACING_STEPS = {
//   NONE: "none",
//   XS: "xs",
//   SM: "sm",
//   MD: "md",
//   LG: "lg",
//   XL: "xl",
// } as const;
// export type SpacingStep = (typeof SPACING_STEPS)[keyof typeof SPACING_STEPS];
// export const SPACING_STEPS_VALUES = Object.values(
//   SPACING_STEPS
// ) as readonly SpacingStep[];

// export const DEFAULT_SPACING_STEP: SpacingStep = "md";

/** Garde de type robuste (param `unknown`) */
// export function isSpacingStep(v: unknown): v is SpacingStep {
//   return (
//     typeof v === "string" && SPACING_STEPS_VALUES.includes(v as SpacingStep)
//   );
// }
