"use client";
/**
 * @file src/infrastructure/ui/theme-apply.ts
 * @intro Application DOM des thèmes (palette + mode)
 */
import { DOM_SELECTORS } from "@/infrastructure/ui/runtime";
import { type AdminPalette } from "@/infrastructure/ui/theme";

/** Applique la palette Radix via l’attribut data-theme sur le scope admin. */
export function applyThemePalette(
  palette: AdminPalette,
  scopeSelector: string = DOM_SELECTORS.adminThemeScope
): void {
  const scope =
    typeof document !== "undefined"
      ? document.querySelector<HTMLElement>(scopeSelector)
      : null;
  if (!scope) return;
  scope.setAttribute("data-theme", palette);
}

/** Applique le mode en ajoutant/enlevant .dark sur <html> (ou “system”). */
// export function applyThemeMode(mode: ThemeMode) {
//   if (typeof document === "undefined" || typeof window === "undefined") return;
//   const root = document.documentElement;
//   const setDark = (on: boolean) => root.classList.toggle(DARK_CLASS, on);

//   if (mode === "light") return setDark(false);
//   if (mode === "dark") return setDark(true);

//   const mq = window.matchMedia("(prefers-color-scheme: dark)");
//   setDark(mq.matches);
//   const listener = (e: MediaQueryListEvent) => setDark(e.matches);
//   mq.addEventListener?.("change", listener);
// }
