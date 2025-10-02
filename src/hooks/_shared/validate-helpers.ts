/**
 * @file src/hooks/_shared/validate-helpers.ts
 * @intro Helpers de validation (non-bloquantes) pour les Sections (Identité, Menus, Social)
 */

export function hasDuplicates(keys: string[]): boolean {
  const seen = new Set<string>();
  for (const k of keys) {
    if (seen.has(k)) return true;
    seen.add(k);
  }
  return false;
}

export function isIncompleteExternalPrefix(s: string): boolean {
  const v = s.trim().toLowerCase();
  return (
    v === "http" ||
    v === "https" ||
    v === "http:" ||
    v === "https:" ||
    v === "http:/" ||
    v === "https:/" ||
    v === "http://" ||
    v === "https://"
  );
}

export function isMailto(href: string): boolean {
  return href.trim().toLowerCase().startsWith("mailto:");
}

export function isHttpAbsolute(href: string): boolean {
  try {
    const u = new URL(href);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
