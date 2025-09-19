/**
 * @file src/schemas/site/theme/theme-intents.ts
 * @intro Schémas Zod des intentions API pour les réglages de thème.
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/site/theme (types, enums, min/max).
 * - La normalisation/consolidation métier et les valeurs par défaut se gèrent côté use-case/adapters.
 * @remarks
 * - La valeur par défaut de `state` (ex. "draft") est appliquée au niveau route/use-case, pas ici.
 * - `withOptionalState` applique déjà `.strict()` : les propriétés inconnues sont rejetées.
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { ThemeSettingsSchema } from "./theme";

/** Intention PATCH des réglages de thème (tous les champs optionnels). */
export const UpdateThemeSettingsSchema = withOptionalState(ThemeSettingsSchema);

/** DTO d’intention pour PATCH thème (côté API). */
