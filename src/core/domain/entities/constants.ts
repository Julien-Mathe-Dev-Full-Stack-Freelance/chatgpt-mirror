/**
 * @file src/core/domain/entities/constants.ts
 * @intro Constantes des entités métier (IDs stables)
 * @layer domain/constants
 * @remarks
 * - SoT des entités (IDs) — aucune i18n ici.
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

export const isEntityKind = (v: string): v is EntityKind =>
  (ENTITY_KINDS as readonly string[]).includes(v);
