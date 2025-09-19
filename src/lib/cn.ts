/**
 * @file src/lib/cn.ts
 * @intro Utilitaires de classes CSS (Tailwind-friendly)
 * @description
 * `cn` combine **clsx** (conditions lisibles) et **tailwind-merge** (résolution des
 * conflits Tailwind) afin de produire une chaîne de classes propre et cohérente.
 *
 * Atouts :
 * - Résout les conflits (`"p-2 p-4"` → `"p-4"`).
 * - Accepte valeurs hétérogènes (string, array, object, falsy).
 * - Idéal pour composer des `className` conditionnels dans les composants.
 *
 * @layer lib/cn
 * @remarks
 * - Isomorphe (SSR/CSR) : pas de `use client` requis.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Concatène et fusionne des classes utilitaires compatibles Tailwind.
 *
 * @param inputs Liste de fragments de classes :
 *  - `string` | `number` | `null` | `undefined` | `false`
 *  - tableaux imbriqués
 *  - objets `{ className: boolean }`
 * @returns Chaîne de classes normalisée (conflits Tailwind résolus).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}
