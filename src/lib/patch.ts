/**
 * @file src/lib/patch.ts
 * @intro Patcher des données pour l’interface admin.
 */

/**
 * Adapte une API de patch partiel `{...}` en API key/value.<K extends keyof T>(key, val)
 */
export function adaptPatchKV<T>(patchPartial: (p: Partial<T>) => void) {
  return <K extends keyof T>(key: K, val: T[K]) => {
    const partial: Partial<T> = {};
    (partial as Record<K, T[K]>)[key] = val; // clé sûre typée par K
    patchPartial(partial);
  };
}

// export function adaptPatchPartial<T>(
//   patchKV: <K extends keyof T>(k: K, v: T[K]) => void,
//   skipUndefined = true
// ) {
//   return (p: Partial<T>) => {
//     (Object.keys(p) as (keyof T)[]).forEach((k) => {
//       const v = p[k] as T[typeof k] | undefined;
//       if (skipUndefined && v === undefined) return;
//       patchKV(k, v as T[typeof k]); // relaie la valeur telle quelle
//     });
//   };
// }
