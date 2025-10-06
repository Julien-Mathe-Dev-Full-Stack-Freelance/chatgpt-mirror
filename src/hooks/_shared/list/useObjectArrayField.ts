// "use client";
// /**
//  * @file src/hooks/_shared/list/useObjectArrayField.ts
//  * @intro Hook pour un champ tableau d’objets (items)
//  * @layer hooks/shared
//  * @remarks
//  * - Étend useArrayField avec un `merge(index, patchObj)` typé pour objets.
//  */

// import { mergeAt } from "@/hooks/_shared/list/list";
// import { useArrayField } from "@/hooks/_shared/list/useArrayField";
// import { useCallback, useMemo } from "react";

// /** Déduit le type d’élément d’un S[K] si c’est un tableau. */
// type ElemOf<A> = A extends ReadonlyArray<infer T> ? T : never;

// export function useObjectArrayField<
//   S extends Record<string, unknown>,
//   K extends keyof S,
//   T extends object
// >(params: {
//   settings: S;
//   key: K;
//   patch: (partial: Partial<S>) => void;
//   create?: () => T;
// }) {
//   const base = useArrayField<S, K>({
//     settings: params.settings,
//     key: params.key,
//     patch: params.patch,
//     create: params.create as (() => ElemOf<S[K]>) | undefined,
//   });

//   // items typés objet
//   const items = base.items as unknown as ReadonlyArray<T>;
//   const { key, patch } = params;

//   // merge typé objet (pas d’accès à un setItems interne : on patch le champ directement)
//   const merge = useCallback(
//     (index: number, patchObj: Partial<T>) => {
//       const next = mergeAt(items, index, patchObj);
//       patch({ [key]: next } as Partial<S>);
//     },
//     [items, key, patch]
//   );

//   return useMemo(() => {
//     return {
//       add: base.add,
//       update: base.update,
//       remove: base.remove,
//       move: base.move,
//       items: items as ReadonlyArray<T>,
//       merge, // spécifique objets
//       create: base.create, // on ré-expose create (optionnelle)
//     } as const;
//   }, [base, items, merge]);
// }
