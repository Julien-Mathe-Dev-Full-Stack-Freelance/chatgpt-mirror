/**
 * @file src/infrastructure/ui/theme.ts
 * @intro Adapters UI — mapping palette/mode → classes CSS
 * @layer infra/ui
 * @remarks
 * - Pur mapping (aucun accès DOM ici).
 * - L’application (DOM) est gérée dans ./theme-apply.ts (client).
 */
import type { ThemeMode, ThemePalette } from "@/core/domain/constants/theme";

/** Stratégie Tailwind "class" : on utilise la classe 'dark' au root. */
export const DARK_CLASS = "dark" as const;

/** Mapping palette → classe (doit exister dans ton CSS : .theme-neutral, etc.). */
const PALETTE_CLASS: Record<ThemePalette, string> = {
  neutral: "theme-neutral",
  ocean: "theme-ocean",
  violet: "theme-violet",
  forest: "theme-forest",
} as const;

export function paletteClass(p: ThemePalette): string {
  return PALETTE_CLASS[p];
}

/** Retourne la classe à ajouter/supprimer pour un mode donné. */
export function modeClass(m: ThemeMode): string | "" {
  if (m === "dark") return DARK_CLASS;
  // "light" = aucune classe ; "system" sera résolu côté client
  return "";
}
