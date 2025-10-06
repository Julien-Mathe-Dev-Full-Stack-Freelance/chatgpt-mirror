/**
 * @file src/lib/guards.ts
 * @intro Guards pour les éléments de l’interface admin.
 */

// Génère une clé stable en fallback (utile dans les listes)
export function toStableKey(
  parts: Array<string | number | undefined>,
  i: number
) {
  const filtered = parts.filter(
    (value): value is string | number => value !== undefined
  );
  const p = filtered.join("|");
  return p ? `${p}:${i}` : String(i);
}

/** Vérifie la présence d'un identifiant `id: string` sur un objet inconnu. */
export function hasStringId(value: unknown): value is { id: string } {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate["id"] === "string";
}
