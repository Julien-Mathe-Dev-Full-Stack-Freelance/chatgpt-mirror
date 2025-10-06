/**
 * @file src/core/domain/constants/common.ts
 * @intro Constantes métier transverses : états de contenu & positions d’insertion.
 * @layer domain/constants
 * @sot docs/bible/domain/constants/README.md#common
 * @description
 * - Source de vérité pour l’état de contenu (`draft` | `published`) et les positions d’insertion.
 * - Expose des unions fermées + type-guards (`isContentState`, `isInsertPosition`) pour éviter les magic strings.
 * - Domaine pur : aucune dépendance UI/infra, aucun side-effect.
 * @remarks
 * - Étendre les unions **ici d’abord**, puis synchroniser schémas Zod, DTO, use-cases et routes.
 */

// ───────────────────────────────────────────────────────────────────────────────
// Positions d’insertion dans une liste (agnostiques de l’orientation)
// - Permet d’exprimer prepend/insert/append de façon stable et testable.
// - L’UI mappe ces valeurs vers des opérations concrètes de réordonnancement.
// ───────────────────────────────────────────────────────────────────────────────
export const POS_PREPEND = "prepend" as const;
//const POS_INSERT = "insert" as const;
export const POS_APPEND = "append" as const;

// const INSERT_POSITIONS = [POS_PREPEND, POS_INSERT, POS_APPEND] as const;

// type InsertPosition = (typeof INSERT_POSITIONS)[number];

/** Garde de type : sécurise les adapters/DTOs contre des valeurs inattendues. */
// export function isInsertPosition(v: unknown): v is InsertPosition {
//   return (
//     typeof v === "string" && (INSERT_POSITIONS as readonly string[]).includes(v)
//   );
// }

// ───────────────────────────────────────────────────────────────────────────────
// États de contenu (union fermée)
// - Étendre ici AVANT d’impacter les use-cases / schémas Zod.
// - Consommé par les routes et use-cases (ex. création/publication de page).
// ───────────────────────────────────────────────────────────────────────────────
export const DEFAULT_CONTENT_STATE = "draft" as const;
export const PUBLISHED_CONTENT_STATE = "published" as const;

export const CONTENT_STATES = [
  DEFAULT_CONTENT_STATE,
  PUBLISHED_CONTENT_STATE,
] as const;

export type ContentState = (typeof CONTENT_STATES)[number];

// /** Garde de type : préférer cette vérification d’union à des tests ad hoc. */
// export function isContentState(v: unknown): v is ContentState {
//   return (
//     typeof v === "string" && (CONTENT_STATES as readonly string[]).includes(v)
//   );
// }
