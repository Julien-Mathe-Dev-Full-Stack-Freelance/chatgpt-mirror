/**
 * @file src/core/domain/ids/tools.ts
 * @intro Générateur d’ID préfixés (list, page, menu, block, site)
 * @layer domain/utils
 */

import { genId } from "@/core/domain/ids/generator";
import {
  ID_SCHEMAS,
  type BlockId,
  type IdSchemaName,
  type ListId,
  type MenuId,
  type PageId,
  type SiteId,
} from "@/core/domain/ids/schema";

const ESC = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ID_CHARCLASS = "[A-Za-z0-9_-]";

type Tools<P extends string, Id extends `${P}${string}`> = {
  readonly prefix: P;
  readonly size: number;
  readonly re: RegExp;
  gen(): Id;
  is(id: string): id is Id;
  hasPrefix(id: string): boolean;
};

function baseTools<P extends string, Id extends `${P}${string}`>(
  prefix: P,
  size: number
): Tools<P, Id> {
  const re = new RegExp(`^${ESC(prefix)}${ID_CHARCLASS}{${size}}$`);
  return {
    prefix,
    size,
    re,
    gen: () => `${prefix}${genId(size)}` as Id,
    is: (id: string): id is Id => re.test(id),
    hasPrefix: (id: string) => id.startsWith(prefix),
  };
}

/* ---------- Overloads pour typer précisément chaque famille ---------- */
export function makeIdTools(name: "list"): Tools<"lst_", ListId>;
export function makeIdTools(name: "page"): Tools<"pg_", PageId>;
export function makeIdTools(name: "menu"): Tools<"mnu_", MenuId>;
export function makeIdTools(name: "block"): Tools<"blk_", BlockId>;
export function makeIdTools(name: "site"): Tools<"site_", SiteId>;
export function makeIdTools(name: IdSchemaName): Tools<string, string> {
  const { prefix, size } = ID_SCHEMAS[name];
  return baseTools(prefix, size);
}

/* ---------- Toolkits spécialisés ---------- */
export const ListIdTools = makeIdTools("list");
export const PageIdTools = makeIdTools("page");
export const MenuIdTools = makeIdTools("menu");
export const BlockIdTools = makeIdTools("block");
export const SiteIdTools = makeIdTools("site");

/* ---------- Helpers pratiques ---------- */
export const genPageId = (): PageId => PageIdTools.gen();
export const isPageId = (id: string): id is PageId => PageIdTools.is(id);
