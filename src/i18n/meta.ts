/**
 * @file src/i18n/meta.ts
 * @intro i18n — métadonnées de locales (SoT code)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-catalogue.md
 * @remarks
 * - Liste canonique des locales supportées + DEFAULT_LOCALE.
 * - `Locale` dérivé de SUPPORTED_LOCALES (zéro duplication).
 * - `isLocale` = garde légère (dev & runtime).
 */
export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(input: unknown): input is Locale {
  return (
    typeof input === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(input)
  );
}
