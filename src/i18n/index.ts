/**
 * @file src/i18n/index.ts
 * @intro i18n — barrel & helpers purs
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-catalogue.md
 * @description
 * - SoT des locales (SUPPORTED_LOCALES, DEFAULT_LOCALE, isLocale, type Locale).
 * - Helpers agnostiques de React : getMsg, interpolate.
 * - Deux fabriques `t()` :
 *   - `createT` (simple) → fallback = clé brute (usage contrôlé).
 *   - `createTSafe` (recommandé) → fallback sûr (dev chevrons, prod vide).
 */

export { DEFAULT_LOCALE, isLocale, SUPPORTED_LOCALES } from "@/i18n/meta";
export type { Locale } from "@/i18n/meta";

export { MESSAGES } from "@/i18n/locales";
import {
  ERROR_MESSAGES as __ERROR_MESSAGES,
  MESSAGES as __MESSAGES,
} from "@/i18n/locales";
import type { Locale } from "@/i18n/meta";
import { DEFAULT_LOCALE } from "@/i18n/meta";
import type { MessagesTree } from "@/i18n/types";

import type { ErrorCode } from "@/core/domain/errors/codes";
import { log } from "@/lib/log";

/** Clé i18n générique pour fallback des erreurs. */
const ERRORS_GENERIC_KEY = "errors.generic" as const;

/** Accès sûr aux clés "a.b.c" (lecture seule). */
export function getMsg(dict: MessagesTree, path: string): string | undefined {
  return path.split(".").reduce<unknown>((acc, k) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[k];
  }, dict) as string | undefined;
}

/** Interpolation {name} (tolère {{name}}). */
export function interpolate(
  s: string,
  params?: Readonly<Record<string, string | number>>
): string {
  if (!params) return s;
  let out = s;
  for (const [k, v] of Object.entries(params)) {
    out = out.replace(new RegExp(`\\{\\{?${k}\\}?\\}`, "g"), String(v));
  }
  return out;
}

/** Signature d’une fonction de traduction. */
export type TFunc = (
  key: string,
  params?: Readonly<Record<string, string | number>>
) => string;

/** Fabrique `t()` *simple* (fallback = clé brute). */
// export function createT(dict: MessagesTree): TFunc {
//   return (key, params) => interpolate(getMsg(dict, key) ?? key, params);
// }

/** Fabrique `t()` *safe* (fallback sûr). */
export function createTSafe(
  primary: MessagesTree,
  fallback: MessagesTree
): TFunc {
  return (key, params) => {
    const a = getMsg(primary, key);
    if (typeof a === "string") return interpolate(a, params);

    const b = getMsg(fallback, key);
    if (typeof b === "string") return interpolate(b, params);

    if (process.env.NODE_ENV !== "production") {
      log.warn("i18n.missingMessage", { key });
      return `⟨${key}⟩`;
    }
    return "";
  };
}

/**
 * Récupère un message d’erreur localisé avec **fallback formalisé**.
 * Fallback : locale → DEFAULT_LOCALE → `errors.generic` → `opts.fallbackText` → (dev) chevrons + warn / (prod) "".
 */
export function getErrorMsgSafe(
  locale: Locale,
  code: ErrorCode,
  opts?: { fallbackText?: string }
): string {
  // 1) Recherche stricte dans la locale courante, puis DEFAULT_LOCALE
  const direct =
    __ERROR_MESSAGES[locale]?.[code] ??
    __ERROR_MESSAGES[DEFAULT_LOCALE]?.[code];
  if (typeof direct === "string") return direct;

  // 2) Fallback générique via clé i18n `errors.generic`
  const generic =
    getMsg(__MESSAGES[locale], ERRORS_GENERIC_KEY) ??
    getMsg(__MESSAGES[DEFAULT_LOCALE], ERRORS_GENERIC_KEY);
  if (typeof generic === "string") return generic;

  // 3) Fallback explicite fourni par l’appelant (optionnel)
  if (opts?.fallbackText) return opts.fallbackText;

  // 4) Dernier recours : dev = chevrons + warn / prod = vide
  if (process.env.NODE_ENV !== "production") {
    log.warn("i18n.missingErrorMessage", { code, locale });
    return `⟨error.${String(code)}⟩`;
  }
  return "";
}
