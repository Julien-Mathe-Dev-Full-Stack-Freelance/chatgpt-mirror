"use client";

/**
 * @file src/i18n/LanguageSwitcher.tsx
 * @intro Sélecteur de langue (consomme SUPPORTED_LOCALES/Locale depuis @/i18n)
 * @layer ui/i18n
 * @remarks
 * - A11y : <label> associé, focus visible, texte du label accessible.
 * - Zéro redéclaration : importe `SUPPORTED_LOCALES`, `Locale`, `isLocale` depuis `@/i18n`.
 */

import { useI18n } from "@/i18n/context";
import { useCallback, type ChangeEvent } from "react";
import { SUPPORTED_LOCALES, isLocale, type Locale } from ".";

export type LanguageSwitcherProps = {
  label?: string; // Texte du label (visible ou sr-only)
  srOnlyLabel?: boolean; // Cache visuellement le label tout en le gardant accessible
  id?: string; // id pour associer <label htmlFor=…>
  className?: string; // classes utilitaires sur <select>
};

/** Retourne un label humain pour un code locale (ex.: "fr" → "Français"). */
function getLocaleLabel(code: Locale): string {
  try {
    const dn = new Intl.DisplayNames([code], { type: "language" });
    return dn.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export function LanguageSwitcher({
  label,
  srOnlyLabel = false,
  id = "language-switcher",
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  // Label par défaut i18n si non fourni
  const labelText = label ?? t("admin.header.language");

  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value;
      if (isLocale(next)) setLocale(next);
    },
    [setLocale]
  );

  return (
    <div className="inline-flex items-center gap-2">
      <label
        htmlFor={id}
        className={srOnlyLabel ? "sr-only" : "text-sm font-medium"}
      >
        {labelText}
      </label>

      <select
        id={id}
        aria-label={srOnlyLabel ? labelText : undefined}
        className={
          className ??
          "min-w-[9rem] rounded-md border px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        }
        value={locale}
        onChange={onChange}
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {getLocaleLabel(code)}
          </option>
        ))}
      </select>
    </div>
  );
}

LanguageSwitcher.displayName = "LanguageSwitcher";
