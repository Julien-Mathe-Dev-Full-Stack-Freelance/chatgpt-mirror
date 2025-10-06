"use client";

/**
 * @file src/components/shared/theme/PublicThemeScope.tsx
 * @intro Portée d’affichage du **thème public** (mode + palette)
 * @description
 * Encapsule un sous-arbre UI dans le thème **public** en appliquant :
 * - la classe `dark` selon le mode (light/dark/system via `next-themes`),
 * - l’attribut `data-theme` pour la palette (neutral/ocean/violet/forest).
 *
 * Observabilité :
 * - Aucune (présentation pure, pas de logs).
 *
 * @layer ui/shared
 * @remarks
 * - Zéro fetch : toutes les données viennent des props.
 * - Pensé pour l’aperçu dans l’admin : isole visuellement du shell admin
 *   via `bg-background text-foreground` pour éviter toute “fuite” de couleurs.
 * - Compatible SSR/CSR : la résolution du mode s’appuie sur `next-themes`.
 */

import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import { cn } from "@/lib/cn";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

type PublicThemeScopeProps = {
  /** Réglages du thème public (mode + palette). */
  theme: ThemeSettingsDTO;
  /** Classes utilitaires additionnelles sur le conteneur racine (optionnel). */
  className?: string;
  /** Contenu à thématiser. */
  children: ReactNode;
};

/**
 * Conteneur de thème public.
 * Applique `dark` selon le mode et définit `data-theme` pour la palette.
 * @returns Un `<div>` isolant visuellement son contenu avec le thème public.
 */
export function PublicThemeScope({
  theme,
  className,
  children,
}: PublicThemeScopeProps) {
  const { systemTheme } = useTheme();

  const isDark =
    theme.themeMode === "dark" ||
    (theme.themeMode === "system" && systemTheme === "dark");

  return (
    <div
      className={cn(
        "site-theme",
        isDark && "dark",
        // Empêche les couleurs du shell admin d’affecter l’aperçu.
        "bg-background text-foreground",
        className
      )}
      data-theme={theme.themePalette}
    >
      {children}
    </div>
  );
}
