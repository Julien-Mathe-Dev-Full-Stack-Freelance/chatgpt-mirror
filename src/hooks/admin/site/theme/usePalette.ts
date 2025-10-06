// src/hooks/admin/site/theme/usePalette.ts
"use client";
import { STORAGE_KEYS } from "@/infrastructure/ui/runtime";
import type { AdminPalette } from "@/infrastructure/ui/theme";
import { applyThemePalette } from "@/infrastructure/ui/theme-apply";
import { useEffect, useState } from "react";

const SUPPORTED: AdminPalette[] = ["gray", "red", "purple", "blue", "green"];

type Palette = AdminPalette;

export function usePalette() {
  const [palette, setPalette] = useState<Palette>("gray");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEYS.adminPalette
      ) as Palette | null;
      const p = saved && SUPPORTED.includes(saved) ? saved : "gray";
      setPalette(p);
      applyThemePalette(p);
    } catch {
      applyThemePalette("gray");
    }
  }, []);

  return {
    palette,
    palettes: SUPPORTED,
    setPalette: (p: Palette) => {
      setPalette(p);
      try {
        localStorage.setItem(STORAGE_KEYS.adminPalette, p);
      } catch {}
      applyThemePalette(p);
    },
  };
}
