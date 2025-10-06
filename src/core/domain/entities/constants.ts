/**
 * @file src/core/domain/entities/constants.ts
 * @intro Constantes d’identification d’entités (IDs stables, non i18n).
 * @layer domain/constants
 * @sot docs/bible/domain/entities/README.md#kinds
 * @description
 * - Source de vérité des IDs d’entités (union fermée `EntityKind`).
 * - Expose un type-guard `isEntityKind` pour sécuriser DTO/adapters/use-cases.
 * - Domaine pur : aucune dépendance UI/infra, aucun side-effect.
 * @remarks
 * - Étendre la liste **ici d’abord**, puis synchroniser schémas Zod & mappings UI.
 */

export const ENTITY_KINDS = [
  "header",
  "identity",
  "menu",
  "primaryMenu",
  "legalMenu",
  "social",
  "page",
  "block",
  "footer",
  "theme",
  "seo",
] as const;

export type EntityKind = (typeof ENTITY_KINDS)[number];

/** Garde de type robuste (paramètre `unknown`). */
// export function isEntityKind(v: unknown): v is EntityKind {
//   return (
//     typeof v === "string" && (ENTITY_KINDS as readonly string[]).includes(v)
//   );
// }
