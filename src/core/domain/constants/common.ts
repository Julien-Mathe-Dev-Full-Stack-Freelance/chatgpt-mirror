/**
 * @file src/core/domain/constants/common.ts
 * @intro Constantes métier (états de contenu, positions d'insertion).
 * @layer domaine
 * @sot docs/bible/domain/constants/README.md
 * @description
 * - Source de vérité pour l'état du contenu (`draft`/`published`) et les positions d'insertion génériques.
 * - Fournit des gardes de type pour sécuriser les adapters/DTOs (évite les magic strings).
 * - Domaine pur : aucun accès UI/infra, aucun side-effect.
 * @remarks
 */

// ───────────────────────────────────────────────────────────────────────────────
// États de contenu (union fermée)
// - Étendre ici avant d'impacter les use-cases / schémas Zod.
// - Consommé par les routes et use-cases (ex. création de page).
// ───────────────────────────────────────────────────────────────────────────────
export const DEFAULT_CONTENT_STATE = "draft" as const;
export const PUBLISHED_CONTENT_STATE = "published" as const;

export const CONTENT_STATES = [
  DEFAULT_CONTENT_STATE,
  PUBLISHED_CONTENT_STATE,
] as const;

export type ContentState = (typeof CONTENT_STATES)[number];

// Garde de type : préférer cette vérification d'union à des tests ad hoc.
export function isContentState(v: string): v is ContentState {
  return (CONTENT_STATES as readonly string[]).includes(v);
}

// ───────────────────────────────────────────────────────────────────────────────
// Positions d'insertion dans une liste (agnostiques de la direction)
// - Permet d'exprimer prepend/insert/append de façon stable et testable.
// - L'UI mappe ces valeurs vers les opérations de réordonnancement concrètes.
// ───────────────────────────────────────────────────────────────────────────────
export const POS_PREPEND = "prepend" as const;
export const POS_INSERT = "insert" as const;
export const POS_APPEND = "append" as const;

export const INSERT_POSITIONS = [POS_PREPEND, POS_INSERT, POS_APPEND] as const;

export type InsertPosition = (typeof INSERT_POSITIONS)[number];

// Garde de type : sécurise les adapters/DTOs contre des valeurs inattendues.
export function isInsertPosition(v: string): v is InsertPosition {
  return (INSERT_POSITIONS as readonly string[]).includes(v);
}
