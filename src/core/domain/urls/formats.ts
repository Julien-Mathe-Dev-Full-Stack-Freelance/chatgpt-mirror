/**
 * @file src/core/domain/urls/format.ts
 * @intro Helpers de formatage d’URL (strip/join/canonical)
 * @layer domain/utils
 * @description
 * Utilitaires agnostiques (zéro I/O) pour manipuler les URLs de façon cohérente :
 * - stripTrailingSlashes : normalise les "/" finaux
 * - joinUrl              : concatène base + chemin (un seul "/")
 * - canonicalFromBase    : construit une canonique (base + slug)
 */

/** Supprime les "/" finaux pour éviter les doubles slashes lors du concat. */
export function stripTrailingSlashes(u?: string): string | undefined {
  return u ? u.replace(/\/+$/, "") : u;
}

/** Concatène `base` et `path` avec un seul "/" séparateur. */
export function joinUrl(
  base: string | undefined,
  path: string
): string | undefined {
  const b = stripTrailingSlashes(base);
  if (!b) return undefined;
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

/** Canonique simple : baseUrl + "/" + slug (sans créer de "//"). */
export function canonicalFromBase(
  baseUrl: string | undefined,
  slug: string
): string | undefined {
  return joinUrl(baseUrl, slug);
}
