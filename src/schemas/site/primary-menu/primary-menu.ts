/**
 * @file src/schemas/site/primary-menu/primary-menu.ts
 * @intro Schéma Zod pour la configuration du menu (nav)
 * @description
 * Source de vérité côté validation/DTO (sans valeurs par défaut côté domaine).
 * Le menu est une liste ordonnée d’éléments { label, href, newTab }.
 *
 * @layer schemas
 */

import {
  MENU_ITEM_MAX,
  MENU_LABEL_MAX,
  MENU_LABEL_MIN,
} from "@/core/domain/constants/limits";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { AssetUrlSchema } from "@/schemas/site/common";
import { z } from "zod";

/** Un item de menu (MVP, menu plat) */
export const PrimaryMenuItemSchema = z
  .object({
    /** Libellé visible (bouton/texte du lien) */
    label: nonEmptyTrimmedString(MENU_LABEL_MIN, MENU_LABEL_MAX, {
      tooShort: "validation.title.required",
      tooLong: "validation.text.tooLong",
    }),
    /** Lien absolu ou relatif */
    href: AssetUrlSchema,
    /** Ouvrir dans un nouvel onglet */
    newTab: z.boolean(),
  })
  .strict();

/** Schéma de configuration du menu (liste ordonnée d’items) */
export const PrimaryMenuSettingsSchema = z
  .object({
    items: z.array(PrimaryMenuItemSchema).max(MENU_ITEM_MAX),
  })
  .strict();
