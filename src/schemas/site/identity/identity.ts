/**
 * @file src/schemas/site/identity/identity.ts
 * @intro Schéma Zod pour l'identité du site.
 * @description
 * Source de vérité côté validation/DTO (frontière de **forme**, sans valeurs par défaut).
 * Les valeurs par défaut et la normalisation (ex. fallback de titre/logo) se gèrent
 * côté domaine/use-cases (ex. `DEFAULT_IDENTITY_SETTINGS`), pas dans ce schéma.
 * @remarks
 * - `.strict()` est déjà en vigueur : les propriétés inconnues sont refusées.
 * @layer schemas
 */

import {
  IDENTITY_TITLE_MAX,
  IDENTITY_TITLE_MIN,
  LOGO_ALT_MAX,
  TAGLINE_MAX,
} from "@/constants/shared/limits";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { AssetUrlSchema } from "@/schemas/shared/url-fragments";
import { z } from "zod";

/**
 * Schéma d'identité du site :
 * - `title`          : requis (forme).
 * - `tagline`        : optionnelle, bornée en longueur.
 * - `logoLightUrl`   : optionnelle (absolue/relative).
 * - `logoDarkUrl`    : optionnelle (absolue/relative).
 * - `logoAlt`        : requis (forme).
 * - `faviconLightUrl`: optionnelle (absolue/relative).
 * - `faviconDarkUrl` : optionnelle (absolue/relative).
 */
export const IdentitySettingsSchema = z
  .object({
    /** Titre du site — chaîne non vide (validation de forme). */
    title: nonEmptyTrimmedString(IDENTITY_TITLE_MIN, IDENTITY_TITLE_MAX, {
      tooShort: "validation.title.required",
      tooLong: "validation.text.tooLong",
    }),

    /** Baseline — optionnelle, seulement bornée en longueur. */
    tagline: z
      .string()
      .trim()
      .max(TAGLINE_MAX, { message: "validation.tagline.tooLong" })
      .optional(),

    /** Logos (assets relatifs/absolus) */
    logoLightUrl: AssetUrlSchema.optional(),
    logoDarkUrl: AssetUrlSchema.optional(),

    /** Alt du logo — requis, borné en longueur. */
    logoAlt: nonEmptyTrimmedString(1, LOGO_ALT_MAX, {
      tooShort: "validation.logoAlt.required",
      tooLong: "validation.logoAlt.tooLong",
    }),

    /** Favicons (assets relatifs/absolus) */
    faviconLightUrl: AssetUrlSchema.optional(),
    faviconDarkUrl: AssetUrlSchema.optional(),
  })
  .strict();

export type IdentitySettingsInput = z.input<typeof IdentitySettingsSchema>;
