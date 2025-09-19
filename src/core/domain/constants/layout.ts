/**
 * @file src/core/domain/constants/layout.ts
 * @intro Constantes de layout métier (largeurs de conteneur, alignements, espacements).
 * @layer domaine
 * @sot docs/bible/domain/constants/README.md
 * @description
 * - Source de vérité des unions fermées utilisées par les pages/sections (pas de magic strings).
 * - Fournit des gardes de type pour sécuriser adapters/DTOs et éviter les validations ad hoc.
 * - Domaine pur : aucune dépendance UI/infra, aucun side-effect.
 * @remarks
 */

// ───────────────────────────────────────────────────────────────────────────────
// Alignements horizontaux / verticaux
// - On aligne sur la même sémantique que les blocs: "start" | "center" | "end".
// - L'UI traduit ces valeurs en classes utilitaires (tokens centralisés).
// ───────────────────────────────────────────────────────────────────────────────
export const H_ALIGNMENTS = ["start", "center", "end"] as const;
export type HorizontalAlignment = (typeof H_ALIGNMENTS)[number];

export const V_ALIGNMENTS = ["start", "center", "end"] as const;
export type VerticalAlignment = (typeof V_ALIGNMENTS)[number];

// Défauts raisonnables pour une section standard.
export const DEFAULT_H_ALIGN: HorizontalAlignment = "start";
export const DEFAULT_V_ALIGN: VerticalAlignment = "start";

export function isHorizontalAlignment(v: string): v is HorizontalAlignment {
  return (H_ALIGNMENTS as readonly string[]).includes(v);
}
export function isVerticalAlignment(v: string): v is VerticalAlignment {
  return (V_ALIGNMENTS as readonly string[]).includes(v);
}

// ───────────────────────────────────────────────────────────────────────────────
// Échelons d'espacement vertical (rythme)
// - Permet de normaliser les "gaps" entre blocs/sections.
// - L'UI mappe les échelons → classes Tailwind via tokens infra UI.
// ───────────────────────────────────────────────────────────────────────────────
export const SPACING_STEPS = ["none", "xs", "sm", "md", "lg", "xl"] as const;
export type SpacingStep = (typeof SPACING_STEPS)[number];

export const DEFAULT_SPACING_STEP: SpacingStep = "md";

export function isSpacingStep(v: string): v is SpacingStep {
  return (SPACING_STEPS as readonly string[]).includes(v);
}
