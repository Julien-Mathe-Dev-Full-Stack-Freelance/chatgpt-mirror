/**
 * @file src/schemas/site/primary-menu/primary-menu.ts
 * @intro Schéma Zod pour le menu principal (jusqu’à 2 niveaux)
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

/** Base commune (sans children) */
const PrimaryMenuItemBaseSchema = z
  .object({
    /** Libellé visible (bouton/texte du lien) */
    label: nonEmptyTrimmedString(MENU_LABEL_MIN, MENU_LABEL_MAX, {
      tooShort: "validation.title.required",
      tooLong: "validation.text.tooLong",
    }),
    /** Lien absolu (http/https) ou relatif */
    href: AssetUrlSchema,
    /** Ouvrir dans un nouvel onglet */
    newTab: z.boolean(),
    isExternal: z.boolean(),
  })
  .strict();

/**
 * Child = **aucun** sous-niveau (on borne la profondeur à 2)
 * → les enfants sont de type "base", sans children.
 */
const PrimaryMenuChildSchema = PrimaryMenuItemBaseSchema;

/**
 * Item de niveau 1 : peut avoir des enfants "base"
 * → profondeur maximale = 2 niveaux.
 */
const PrimaryMenuItemSchema = PrimaryMenuItemBaseSchema.extend({
  children: z.array(PrimaryMenuChildSchema).optional(),
}).strict();

/** Schéma de configuration du menu (liste ordonnée d’items) */
export const PrimaryMenuSettingsSchema = z
  .object({
    items: z.array(PrimaryMenuItemSchema).max(MENU_ITEM_MAX),
  })
  .strict();

export type PrimaryMenuItemChildInput = z.input<typeof PrimaryMenuChildSchema>;
export type PrimaryMenuItemInput = z.input<typeof PrimaryMenuItemSchema>;
export type PrimaryMenuSettingsInput = z.input<
  typeof PrimaryMenuSettingsSchema
>;
