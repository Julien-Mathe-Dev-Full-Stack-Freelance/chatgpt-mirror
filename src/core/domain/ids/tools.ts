/**
 * @file src/core/domain/ids/tools.ts
 * @intro Outils typés pour générer/valider des IDs préfixés (list, page, menu, block, site)
 * @layer domain/utils
 * @sot docs/bible/domain/ids/README.md#tools
 * @description
 * - Expose un *toolkit* par famille d’ID (prefix + taille + RegExp + helpers).
 * - S’aligne strictement sur `ID_SCHEMAS` (SoT) : préfixes & tailles = source de vérité.
 * - Garantit des IDs **URL-safe** (voir alphabet dans `generator.ts`).
 * - Typage fort via overloads (Template Literal Types) + garde de type `is()`.
 * @remarks
 * - Les Template Literal Types ne contraignent pas la **taille** au compile-time → la RegExp `re` fait foi au runtime.
 * - `gen()` délègue à `genId(size)` (crypto-first) ; voir la politique de fallback dans `generator.ts`.
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

// Échappe un préfixe pour usage sûr dans une RegExp (préfixes « littéraux »).
const ESC = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Charclass autorisée (cf. alphabet documenté dans `generator.ts`).
// Invariant: doit rester cohérente avec ID_ALPHABET pour garder la propriété "URL-safe".
const ID_CHARCLASS = "[A-Za-z0-9_-]";

type Tools<P extends string, Id extends `${P}${string}`> = {
  /** Préfixe d’ID, ex. `"pg_"`. */
  readonly prefix: P;
  /** Taille du suffixe aléatoire (hors préfixe). */
  readonly size: number;
  /** RegExp runtime qui impose préfixe + taille + alphabet. */
  readonly re: RegExp;
  /** Génère un ID conforme au schéma (crypto-first via `genId`). */
  gen(): Id;
  /** Garde de type : vrai si `id` respecte exactement `re`. */
  is(id: string): id is Id;
  /** Vérifie uniquement le préfixe (sans valider la taille). */
  hasPrefix(id: string): boolean;
};

function baseTools<P extends string, Id extends `${P}${string}`>(
  prefix: P,
  size: number
): Tools<P, Id> {
  // RegExp stricte: ^<prefixe><charclass>{size}$
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
// Note: ces signatures assurent un typage fort par famille tout en déléguant à l’implémentation générique.
function makeIdTools(name: "list"): Tools<"lst_", ListId>;
function makeIdTools(name: "page"): Tools<"pg_", PageId>;
function makeIdTools(name: "menu"): Tools<"mnu_", MenuId>;
function makeIdTools(name: "block"): Tools<"blk_", BlockId>;
function makeIdTools(name: "site"): Tools<"site_", SiteId>;
function makeIdTools(name: IdSchemaName): Tools<string, string> {
  // SoT: utilise le préfixe et la taille depuis `ID_SCHEMAS`.
  const { prefix, size } = ID_SCHEMAS[name];
  return baseTools(prefix, size);
}

/* ---------- Toolkits spécialisés (API conviviale et uniforme) ---------- */
export const ListIdTools = makeIdTools("list");
export const PageIdTools = makeIdTools("page");
export const MenuIdTools = makeIdTools("menu");
export const BlockIdTools = makeIdTools("block");
export const SiteIdTools = makeIdTools("site");

/* ---------- Helpers pratiques (exemples ciblés) ---------- */
// Note: exposés ici à titre d’exemple; on peut étendre à d’autres familles si besoin.
export const genPageId = (): PageId => PageIdTools.gen();
export const isPageId = (id: string): id is PageId => PageIdTools.is(id);
