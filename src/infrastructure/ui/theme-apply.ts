"use client";
/**
 * @file src/infrastructure/ui/theme-apply.ts
 * @intro Application des adapters thème sur le DOM (client-only)
 * @layer infra/ui
 */
import type { ThemeMode, ThemePalette } from "@/core/domain/constants/theme";
import { DOM_SELECTORS } from "@/infrastructure/ui/runtime";
import { DARK_CLASS, paletteClass } from "./theme";

/** Applique la palette (ajoute la classe sur le scope admin). */
export function applyThemePalette(
  palette: ThemePalette,
  scopeSelector: string = DOM_SELECTORS.adminThemeScope
): void {
  const scope =
    typeof document !== "undefined"
      ? document.querySelector<HTMLElement>(scopeSelector)
      : null;
  if (!scope) return;

  // Retire d'abord les anciennes classes 'theme-*'
  scope.classList.forEach((cls) => {
    if (cls.startsWith("theme-")) scope.classList.remove(cls);
  });

  scope.classList.add(paletteClass(palette));
}

/**
 * Applique le mode de thème au <html>.
 * - light: supprime .dark
 * - dark: ajoute .dark
 * - system: suit prefers-color-scheme
 */
export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const root = document.documentElement;

  const setDark = (on: boolean) => {
    root.classList.toggle(DARK_CLASS, on);
  };

  if (mode === "light") {
    setDark(false);
    return;
  }
  if (mode === "dark") {
    setDark(true);
    return;
  }

  // system: écoute le media query
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  setDark(mq.matches);

  const listener = (e: MediaQueryListEvent) => setDark(e.matches);
  mq.addEventListener?.("change", listener);
  // Conseil UX: si tu changes plusieurs fois, garde une ref pour removeEventListener plus tard
}
