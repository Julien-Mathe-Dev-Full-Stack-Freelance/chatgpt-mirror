/**
 * @file src/core/domain/slug/utils.ts
 * @intro Slugs — normalisation (ASCII, tirets)
 * @layer domain/utils
 * @remarks
 * Pipeline :
 * - trim → lowercase
 * - NFD + suppression diacritiques
 * - remplace non [a-z0-9] par "-"
 * - collapse des "-" → un seul
 * - trim des "-" en bord
 * - optionnel : tronque à `maxLen` proprement (sans tiret final)
 */
import { RESERVED_SLUGS, SLUG_FINAL_RE } from "@/core/domain/slug/constants";
export function normalizeSlug(input: string, maxLen?: number): string {
  if (!input) return "";
  let s = input.trim().toLowerCase();

  // retire les diacritiques (é → e)
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // remplace tout ce qui n'est pas a-z0-9 par "-"
  s = s.replace(/[^a-z0-9]+/g, "-");

  // collapse des tirets
  s = s.replace(/-+/g, "-");

  // retire tirets de début/fin
  s = s.replace(/^-+|-+$/g, "");

  if (maxLen && s.length > maxLen) {
    s = s.slice(0, maxLen).replace(/-+$/g, "");
  }
  return s;
}

export function isValidSlug(s: string): boolean {
  return SLUG_FINAL_RE.test(s);
}

const RESERVED_SET = new Set<string>(RESERVED_SLUGS);
/** Vrai si `slug` est réservé (normalisation insensible à la casse). */
export function isReservedSlug(slug: string): boolean {
  const normalized = normalizeSlug(slug);
  if (!normalized) return false;
  return RESERVED_SET.has(normalized);
}

/** "post-12" → { root:"post", n:12 } ; "post" → { root:"post", n:null } */
// export function splitNumericSuffix(slug: string): {
//   root: string;
//   n: number | null;
// } {
//   const m = slug.match(/^(.*?)-(\d+)$/);
//   return m ? { root: m[1], n: Number(m[2]) } : { root: slug, n: null };
// }
