/**
 * @file src/hooks/_shared/validate-helpers.ts
 * @intro Helpers de validation (non-bloquantes) partagés (UI)
 * @layer ui/hooks/shared
 * @description
 * Conserve uniquement les helpers *vraiment* génériques non liés aux URLs.
 * Les helpers d’URL sont centralisés dans:
 * - UI: `src/lib/normalize.ts`
 */

/** Détection de doublons sur une liste de clés normalisées (stable/performant). */
export function hasDuplicates(keys: string[]): boolean {
  const seen = new Set<string>();
  for (const k of keys) {
    if (seen.has(k)) return true;
    seen.add(k);
  }
  return false;
}
