// "use client";
// /**
//  * @file src/hooks/_shared/list/useArrayField.ts
//  * @intro Helpers liés à un champ tableau d’un settings (items)
//  * @layer hooks/shared
//  * @remarks
//  * - Évite de ré-écrire add/update/remove/move dans chaque hook.
//  * - S’appuie sur list.ts (insertAt/updateAt/removeAt/moveItem).
//  */

// import { useCallback, useMemo } from "react";
// import {
//   insertAt,
//   moveItem as moveIdx,
//   removeAt as removeIdx,
//   updateAt as updateIdx,
// } from "@/hooks/_shared/list/list";

// /** Déduit le type d’élément d’un S[K] si c’est un tableau. */
// type ElemOf<A> = A extends ReadonlyArray<infer T> ? T : never;

// const EMPTY_ITEMS: ReadonlyArray<unknown> = [];

// export function useArrayField<
//   S extends Record<string, unknown>,
//   K extends keyof S
// >(params: {
//   /** Snapshot courant du settings (immut.) */
//   settings: S;
//   /** Clé du champ qui est un tableau (ex: "items") */
//   key: K;
//   /** Patcheur du settings (ex: (p) => setSettings(prev => ({ ...prev, ...p }))) */
//   patch: (partial: Partial<S>) => void;
//   /** (Optionnel) Fabrique d’un nouvel item par défaut */
//   create?: () => ElemOf<S[K]>;
// }) {
//   type T = ElemOf<S[K]>;
//   const { settings, key, patch, create } = params;

//   const items = useMemo<ReadonlyArray<T>>(() => {
//     const value = settings[key];
//     return Array.isArray(value)
//       ? (value as ReadonlyArray<T>)
//       : (EMPTY_ITEMS as ReadonlyArray<T>);
//   }, [settings, key]);

//   const setItems = useCallback(
//     (next: T[]) => {
//       patch({ [key]: next } as Partial<S>);
//     },
//     [patch, key]
//   );

//   const api = useMemo(() => {
//     return {
//       /** Ajoute un item (ou item par défaut) à la fin ou à l’index donné. */
//       add(item?: T, index?: number) {
//         const value = item ?? (create ? create() : undefined);
//         if (value === undefined) return; // pas de create fourni → no-op
//         const next =
//           typeof index === "number"
//             ? insertAt(items, index, value)
//             : [...items, value];
//         setItems(next);
//       },
//       /** MAJ d’un item via valeur ou updater. */
//       update(index: number, next: T | ((prev: T) => T)) {
//         setItems(updateIdx(items, index, next));
//       },
//       /** Supprime l’item à l’index. */
//       remove(index: number) {
//         setItems(removeIdx(items, index));
//       },
//       /** Déplace l’item (from → to). */
//       move(from: number, to: number) {
//         setItems(moveIdx(items, from, to));
//       },
//       /** Expose le tableau courant (lecture seule). */
//       items,
//       /** Expose la fabrique d’item si fournie (utile pour composer des defaults). */
//       create,
//     } as const;
//   }, [items, setItems, create]);

//   return api;
// }
