/**
 * @file src/core/domain/ids/schema.ts
 * @intro Schémas d’ID (préfixes + tailles) — SoT typée, sans génération.
 * @layer domain/ids
 * @sot docs/bible/domain/ids/README.md#schema
 * @description
 * - Déclare les schémas d’ID canoniques : `{ prefix, size }` par entité.
 * - Types dérivés via Template Literal Types (ex. `PrefixedId<"pg_">`).
 * - Aucune génération ici (pas d’I/O) — voir `ids/generator.ts` pour `genId()`.
 * @remarks
 * - Invariant : un ID valide respecte **prefix + taille** exacts.
 */

export const ID_SCHEMAS = {
  list: { prefix: "lst_", size: 12 }, // Listes (ex. LIST_UID_*)
  page: { prefix: "pg_", size: 24 },
  menu: { prefix: "mnu_", size: 16 },
  block: { prefix: "blk_", size: 16 },
  site: { prefix: "site_", size: 12 },
} as const;

export type IdSchemaName = keyof typeof ID_SCHEMAS;
// ID utilitaire avec préfixe (au niveau type)
type PrefixedId<P extends string> = `${P}${string}`;

// 🔧 Manquant : extraire le prefix par nom de schéma
export type IdPrefix<N extends IdSchemaName> = (typeof ID_SCHEMAS)[N]["prefix"];

/** Alias pratiques (niveau type) */
export type ListId = PrefixedId<(typeof ID_SCHEMAS)["list"]["prefix"]>;
export type PageId = PrefixedId<(typeof ID_SCHEMAS)["page"]["prefix"]>;
export type MenuId = PrefixedId<(typeof ID_SCHEMAS)["menu"]["prefix"]>;
export type BlockId = PrefixedId<(typeof ID_SCHEMAS)["block"]["prefix"]>;
export type SiteId = PrefixedId<(typeof ID_SCHEMAS)["site"]["prefix"]>;

/** Récupère le schéma d’ID par nom. */
export const getIdSchema = <N extends IdSchemaName>(name: N) =>
  ID_SCHEMAS[name];

/** Vérifie qu’un ID correspond au schéma demandé (préfixe + taille). */
export function isIdOf<N extends IdSchemaName>(
  name: N,
  id: string
): id is PrefixedId<IdPrefix<N>> {
  const { prefix, size } = ID_SCHEMAS[name];
  return id.startsWith(prefix) && id.length === prefix.length + size;
}

// /** Détermine le schéma correspondant à un ID ; `null` si aucun ne matche. */
export function idSchemaFor(
  id: string
): { name: IdSchemaName; prefix: string; size: number } | null {
  for (const name of Object.keys(ID_SCHEMAS) as IdSchemaName[]) {
    const s = ID_SCHEMAS[name];
    if (id.startsWith(s.prefix) && id.length === s.prefix.length + s.size) {
      return { name, prefix: s.prefix, size: s.size };
    }
  }
  return null;
}
