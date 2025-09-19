/**
 * @file src/core/domain/ids/schema.ts
 * @intro Schémas d’ID (préfixes + tailles)
 * @description
 * Source of truth des schémas d’ID (préfixes + tailles).
 * - Les types dérivent des préfixes (Template Literal Types).
 * - Aucune génération ici (pas d’I/O).
 * @layer domain/constants
 */

export const ID_SCHEMAS = {
  list: { prefix: "lst_", size: 12 }, // tes listes (ex- LIST_UID_*)
  page: { prefix: "pg_", size: 24 },
  menu: { prefix: "mnu_", size: 16 },
  block: { prefix: "blk_", size: 16 },
  site: { prefix: "site_", size: 12 },
} as const;

export type IdSchemaName = keyof typeof ID_SCHEMAS;
export type IdPrefix<N extends IdSchemaName> = (typeof ID_SCHEMAS)[N]["prefix"];

/** Type utilitaire: ID = `${prefix}${string}` */
export type PrefixedId<P extends string> = `${P}${string}`;

/** Alias pratiques, optionnels */
export type ListId = PrefixedId<(typeof ID_SCHEMAS)["list"]["prefix"]>;
export type PageId = PrefixedId<(typeof ID_SCHEMAS)["page"]["prefix"]>;
export type MenuId = PrefixedId<(typeof ID_SCHEMAS)["menu"]["prefix"]>;
export type BlockId = PrefixedId<(typeof ID_SCHEMAS)["block"]["prefix"]>;
export type SiteId = PrefixedId<(typeof ID_SCHEMAS)["site"]["prefix"]>;

export const getIdSchema = <N extends IdSchemaName>(name: N) =>
  ID_SCHEMAS[name];
