/**
 * @file src/schemas/site/legal-menu/legal-menu.ts
 * @intro Schéma Zod pour le menu légal (réutilise le schéma « menu »)
 * @description
 * Alias explicites des schémas `menu` pour conserver une sémantique métier
 * propre et permettre de diverger plus tard sans casser l’API.
 *
 * @layer schemas
 */

import {
  PrimaryMenuItemSchema,
  PrimaryMenuSettingsSchema,
} from "@/schemas/site/primary-menu/primary-menu";

/** Alias explicite pour le menu légal (réutilise le schéma « menu »). */
export const LegalMenuItemSchema = PrimaryMenuItemSchema;
export const LegalMenuSettingsSchema = PrimaryMenuSettingsSchema;

/** Alias explicite pour le menu légal (réutilise le schéma « menu »). */
