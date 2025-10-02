/**
 * @file src/schemas/site/theme/theme.ts
 * @intro Schéma Zod pour les réglages de thème du site.
 * @description
 * Source de vérité côté validation/DTO (frontière de **forme**, sans valeurs par défaut).
 * Les valeurs par défaut et la normalisation (ex. fallback palette/mode) se gèrent
 * côté domaine/use-cases (ex. `DEFAULT_THEME_SETTINGS`), pas dans ce schéma.
 * @remarks
 * - Les domaines de valeurs sont issus des constantes `THEME_MODES` et `PALETTES`.
 * - `.strict()` est déjà appliqué : les propriétés inconnues sont rejetées.
 * @layer schemas
 */

import { PALETTES, THEME_MODES } from "@/core/domain/constants/theme";
import { z } from "zod";

/**
 * Réglages de thème (MVP).
 * - `themeMode`    : mode d’affichage (clair/sombre/système).
 * - `themePalette` : palette de marque (nom logique mappé aux tokens CSS).
 */
export const ThemeSettingsSchema = z
  .object({
    /** Mode de thème global : "light" | "dark" | "system". */
    themeMode: z.enum(THEME_MODES),
    /** Palette de marque : ex. "neutral" | "ocean" | "violet" | "forest". */
    themePalette: z.enum(PALETTES),
  })
  .strict();

/** Type DTO dérivé du schéma `ThemeSettingsSchema` (source de vérité côté frontière). */
