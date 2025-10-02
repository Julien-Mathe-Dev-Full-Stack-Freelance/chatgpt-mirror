/**
 * @file src/lib/merge.ts
 * @intro Helpers de merge génériques.
 * @description
 * Fournit des utilitaires de fusion shallow utilisés par différents modules.
 * Les valeurs par défaut/normalisations sont gérées par les couches appelantes.
 * @layer lib
 */

/**
 * fonction qui permet de faire un merge superficiel (shallow) de deux objets et de retourner les clés modifiées
 * @param base - objet de base
 * @param patch - object contenant les valeurs modifiées
 * @returns
 */
export function shallowMergeWithChangedKeys<T extends object>(
  base: Readonly<T>,
  patch: Readonly<Partial<T>>
): { next: T; changedKeys: (keyof T)[] } {
  const baseRec = base as unknown as Record<string, unknown>;
  const patchRec = patch as unknown as Record<string, unknown>;

  const nextRec: Record<string, unknown> = { ...baseRec };
  const changedKeys: (keyof T)[] = [];

  for (const k of Object.keys(patchRec)) {
    const key = k as keyof T & string;
    const v = patchRec[key];
    if (v === undefined) continue;
    if (!Object.is(baseRec[key], v)) changedKeys.push(key as keyof T);
    nextRec[key] = v;
  }

  return { next: nextRec as T, changedKeys };
}

/** Petit utilitaire compagnon : test d'égalité shallow. */
export function isShallowEqual<T extends object>(
  a: Readonly<T>,
  b: Readonly<T>
): boolean {
  if (a === b) return true;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    const key = k as keyof T;
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
}
