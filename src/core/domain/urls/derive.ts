/**
 * @file src/core/domain/urls/derive.ts
 * @intro Helpers pour dériver des URLs (Zod) à partir de champs.
 */

import { abs, rel, type AssetUrlOrNull } from "@/core/domain/urls/href";

/** Convertit une string validée (Zod) en AssetUrl brandé. */
export function asAssetUrl(input: string) {
  const s = input.trim();
  return s.startsWith("http://") || s.startsWith("https://") ? abs(s) : rel(s);
}

/** Détermine si une string (déjà trim/validée) est http(s) absolue. */
export function isExternalHttp(input: string): boolean {
  const s = input.trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

/** Variante “safe clear” : "" reste "", sinon brand. */
export function asAssetUrlOrNull(
  input: string | null | undefined
): AssetUrlOrNull {
  if (input == null) return null;
  const s = input.trim();
  if (s === "") return null;
  return s.startsWith("http://") || s.startsWith("https://") ? abs(s) : rel(s);
}
