/**
 * @file src/schemas/site/admin/admin.ts
 * @intro Schémas Zod des réglages Admin (thème).
 * @description
 * - `AdminThemeSchema` : modèle de thème local (UI) avec `{ mode, palette }`.
 * - `AdminSettingsSchema` : forme normalisée côté Admin (API/persistance) avec `{ themeMode, themePalette }`.
 * - Les validations portent uniquement sur la **forme** (enums issues des constantes).
 * - Les valeurs par défaut, migrations et normalisations se gèrent côté use-cases/adapters.
 * @remarks
 * - Nommage volontairement distinct entre les deux schémas (UI vs settings normalisés).
 * - `.strict()` peut être activé ultérieurement si l’on souhaite refuser les propriétés inconnues.
 * @layer schemas
 */

import { PALETTES, THEME_MODES } from "@/core/domain/constants/theme";
import { z } from "zod";

/**
 * Thème côté Admin (état UI / preview).
 * - `mode` : mode de thème (clair/sombre/système) via `THEME_MODES`.
 * - `palette` : identifiant de palette via `PALETTES`.
 */
// export const AdminThemeSchema = z
//   .object({
//     mode: z.enum(THEME_MODES),
//     palette: z.enum(PALETTES),
//   })
//   .strict();
/** DTO utilitaire (source de vérité côté frontière). */

/**
 * Réglages Admin normalisés (API/persistance).
 * - `themeMode` et `themePalette` reprennent les mêmes domaines de valeurs.
 * - Pas de valeurs par défaut ici : elles sont injectées en amont (use-case/adapter).
 */
export const AdminSettingsSchema = z
  .object({
    themeMode: z.enum(THEME_MODES),
    themePalette: z.enum(PALETTES),
  })
  .strict();

/** Type DTO dérivé du schéma `AdminSettingsSchema` (source de vérité côté frontière). */
