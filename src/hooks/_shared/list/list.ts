// /**
//  * @file src/hooks/_shared/list/list.ts
//  * @intro Opérations immuables sur des listes (insert/update/remove/move)
//  * @layer hooks/shared
//  * @remarks
//  * - Clamp les index pour éviter les erreurs.
//  * - Évite les mutations ; retourne toujours un nouveau tableau.
//  */

// function clamp(n: number, min: number, max: number): number {
//   return Math.max(min, Math.min(max, n));
// }

// /** Insère `item` à `index` (clampé). */
// export function insertAt<T>(
//   arr: ReadonlyArray<T>,
//   index: number,
//   item: T
// ): T[] {
//   const i = clamp(index, 0, arr.length);
//   return [...arr.slice(0, i), item, ...arr.slice(i)];
// }

// /** Met à jour l’item à `index` via valeur ou updater (si index hors bornes → identique). */
// export function updateAt<T>(
//   arr: ReadonlyArray<T>,
//   index: number,
//   next: T | ((prev: T) => T)
// ): T[] {
//   if (index < 0 || index >= arr.length) return arr as T[];
//   const current = arr[index];
//   const value =
//     typeof next === "function" ? (next as (p: T) => T)(current) : next;
//   if (Object.is(value, current)) return arr as T[];
//   return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
// }

// /** Supprime l’item à `index` (si hors bornes → identique). */
// export function removeAt<T>(arr: ReadonlyArray<T>, index: number): T[] {
//   if (index < 0 || index >= arr.length) return arr as T[];
//   return [...arr.slice(0, index), ...arr.slice(index + 1)];
// }

// /** Déplace l’item de `from` vers `to` (clampé). */
// export function moveItem<T>(
//   arr: ReadonlyArray<T>,
//   from: number,
//   to: number
// ): T[] {
//   if (from < 0 || from >= arr.length) return arr as T[];
//   if (from === to) return arr as T[];
//   if (arr.length <= 1) return arr as T[];
//   const out = [...arr];
//   const [item] = out.splice(from, 1);
//   const i = clamp(to, 0, out.length);
//   if (i === from) return arr as T[];
//   out.splice(i, 0, item);
//   return out;
// }

// /**
//  * Patch partiel d’un item objet — **shallow merge** : les sous-objets sont remplacés
//  * tels quels. Pour un merge profond, utiliser un helper dédié avant appel.
//  */
// export function mergeAt<T extends object>(
//   arr: ReadonlyArray<T>,
//   index: number,
//   patch: Partial<T>
// ): T[] {
//   if (index < 0 || index >= arr.length) return arr as T[];
//   if (!patch || Object.keys(patch).length === 0) return arr as T[];

//   const current = arr[index];
//   const entries = Object.entries(patch) as Array<[keyof T, T[keyof T]]>;
//   const hasChange = entries.some(([key, value]) => !Object.is(current[key], value));
//   if (!hasChange) return arr as T[];

//   const next = { ...current, ...patch };
//   return updateAt(arr, index, next);
// }
