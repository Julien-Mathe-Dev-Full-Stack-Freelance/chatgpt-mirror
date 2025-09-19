/**
 * @file src/lib/normalize.ts
 * @intro Normalise les données pour l’interface admin.
 */

import { normalizeSlug, isValidSlug } from "@/core/domain/slug/utils";
import { isAbsoluteHttpProtocol } from "@/core/domain/constants/web";

export function normalizeSlugInput(v: string) {
  const s = v.trim();
  if (!s) return "";
  const out = normalizeSlug(s);
  return isValidSlug(out) ? out : s; // garde l'entrée si non conforme (la validation pilotera l'UX)
}

export function normalizeBaseUrlInput(
  value: string,
  prev?: string
): string | undefined {
  const next = value.trim();
  if (!next) return undefined;

  try {
    const url = new URL(next);
    return isAbsoluteHttpProtocol(url.protocol) && url.hostname
      ? next
      : prev;
  } catch {
    return prev;
  }
}

export function normalizeTwitterHandle(v: string) {
  const s = v.trim();
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}
