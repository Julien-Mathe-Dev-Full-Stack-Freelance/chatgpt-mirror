"use client";

/**
 * @file src/i18n/context.tsx
 * @intro i18n — Provider & hook (UI)
 * @layer ui/i18n
 * @sot docs/bible/ui/i18n-catalogue.md
 * @description
 * - Stocke la locale (localStorage) et applique <html lang="…">.
 * - `t()` fallback : locale → DEFAULT_LOCALE → (dev) ⟨key⟩ + warn / (prod) "".
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_LOCALE,
  getMsg,
  interpolate,
  isLocale,
  type Locale,
} from "@/i18n/";
import { MESSAGES } from "@/i18n/locales"; // relatif (anti-cycle)
import { log } from "@/lib/log";

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (
    key: string,
    params?: Readonly<Record<string, string | number>>
  ) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);
I18nContext.displayName = "I18nContext";

const STORAGE_KEY = "ui-locale";

type I18nProviderProps = {
  defaultLocale?: Locale;
  children: ReactNode;
};

export function I18nProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return defaultLocale;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : defaultLocale;
  });

  // A11y : <html lang="…"> suit la locale
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale]);

  // Change la locale + persiste (best effort)
  const setLocale = useCallback((l: Locale) => {
    if (!isLocale(l)) return;
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* no-op */
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", l);
    }
  }, []);

  // t() avec fallback sûr (évite fuite de clé brute en prod)
  const t = useCallback(
    (key: string, params?: Readonly<Record<string, string | number>>) => {
      const primary = getMsg(MESSAGES[locale], key);
      if (typeof primary === "string") return interpolate(primary, params);

      const fb = getMsg(MESSAGES[DEFAULT_LOCALE], key);
      if (typeof fb === "string") return interpolate(fb, params);

      if (process.env.NODE_ENV !== "production") {
        log.warn("i18n.missingMessage", { key, locale });
        return `⟨${key}⟩`;
      }
      return "";
    },
    [locale]
  );

  const value = useMemo<I18nCtx>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n doit être utilisé dans <I18nProvider />");
  return ctx;
}

// export { I18nContext };

// export type Translator = ReturnType<typeof useI18n>["t"];
