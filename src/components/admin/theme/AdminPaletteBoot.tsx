"use client";

import { DOM_SELECTORS, STORAGE_KEYS } from "@/infrastructure/ui/runtime";
import type { AdminPalette } from "@/infrastructure/ui/theme";
import { applyThemePalette } from "@/infrastructure/ui/theme-apply";
import { useEffect } from "react";

const SUPPORTED = new Set(["gray", "red", "purple", "blue", "green"]);

export function AdminPaletteBoot() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.adminPalette);
      const palette = saved && SUPPORTED.has(saved) ? saved : "gray";
      applyThemePalette(palette as AdminPalette, DOM_SELECTORS.adminThemeScope);
    } catch {
      applyThemePalette("gray", DOM_SELECTORS.adminThemeScope);
    }
  }, []);
  return null;
}
