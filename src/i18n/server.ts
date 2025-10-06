/**
 * @file src/i18n/server.ts
 * @intro Helpers i18n spécifiques aux requêtes (environnement serveur)
 * @layer i18n/server
 */

import { headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  MESSAGES,
  SUPPORTED_LOCALES,
  createTSafe,
  type Locale,
  type TFunc,
} from "@/i18n";

/** Résout la locale à partir de l’en-tête `Accept-Language` (fallback DEFAULT_LOCALE). */
export async function resolveRequestLocale(): Promise<Locale> {
  const headerList = await headers();
  const header = headerList.get("accept-language");
  if (!header) return DEFAULT_LOCALE;

  const preferred = header
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase());

  for (const tag of preferred) {
    const base = tag.split("-")[0] as Locale;
    if (SUPPORTED_LOCALES.includes(base)) {
      return base;
    }
  }

  return DEFAULT_LOCALE;
}

/** Retourne un translateur (`t`) pour la requête courante. */
export async function getRequestT(): Promise<TFunc> {
  const locale = await resolveRequestLocale();
  const primaryDict = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
  return createTSafe(primaryDict, MESSAGES[DEFAULT_LOCALE]);
}
