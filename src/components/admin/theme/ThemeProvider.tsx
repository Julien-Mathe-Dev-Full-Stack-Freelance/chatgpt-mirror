"use client";

/**
 * @file src/components/admin/theme/ThemeProvider.tsx
 * @intro Provider de thème pour l’admin (wrapper `next-themes`)
 * @layer ui/theme
 */

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  /** Sous-arbre React à thématiser. */
  children: ReactNode;
}

/**
 * Provider de thème basé sur `next-themes` pour l’admin.
 * @returns Contexte de thème appliquant les classes `light`/`dark` au document.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
