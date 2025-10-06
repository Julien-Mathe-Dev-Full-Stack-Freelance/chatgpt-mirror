/**
 * @file src/schemas/site/legal-menu/legal-menu.ts
 * @intro Schéma Zod pour le menu légal (1 niveau)
 * @layer schemas
 */

import {
  MENU_ITEM_MAX,
  MENU_LABEL_MAX,
  MENU_LABEL_MIN,
} from "@/core/domain/constants/limits";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { AssetUrlSchema } from "@/schemas/shared/url-fragments";
import { z } from "zod";

/** Un item de menu légal (pas de children) */
const LegalMenuItemSchema = z
  .object({
    label: nonEmptyTrimmedString(MENU_LABEL_MIN, MENU_LABEL_MAX, {
      tooShort: "validation.title.required",
      tooLong: "validation.text.tooLong",
    }),
    href: AssetUrlSchema,
    newTab: z.boolean(),
    isExternal: z.boolean(),
  })
  .strict();

/** Schéma de configuration du menu légal (liste plate) */
export const LegalMenuSettingsSchema = z
  .object({
    items: z.array(LegalMenuItemSchema).max(MENU_ITEM_MAX),
  })
  .strict();

export type LegalMenuItemInput = z.input<typeof LegalMenuItemSchema>;
export type LegalMenuSettingsInput = z.input<typeof LegalMenuSettingsSchema>;
