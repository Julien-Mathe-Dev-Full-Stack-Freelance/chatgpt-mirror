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
} from "@/core/domain/constants/limits";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { AssetUrlSchema } from "@/schemas/site/common";
import { z } from "zod";

/**
 * Schéma d'identité du site (MVP).
 * - `title`      : titre du site (requis).
 * - `logoUrl`    : URL absolue/relative du logo (optionnel).
 * - `faviconUrl` : URL de l'icône du site (optionnel).
 */
export const IdentitySettingsSchema = z
  .object({
    /** Titre du site — chaîne non vide (validation de forme). */
    title: nonEmptyTrimmedString(IDENTITY_TITLE_MIN, IDENTITY_TITLE_MAX, {
      tooShort: "validation.title.required",
      tooLong: "validation.text.tooLong",
    }),
    /** URL du logo — accepte absolu et relatif (voir `AssetUrlSchema`). */
    logoUrl: AssetUrlSchema.optional(),
    /** URL de la favicon — accepte absolu et relatif (voir `AssetUrlSchema`). */
    faviconUrl: AssetUrlSchema.optional(),
  })
  .strict();

// Type DTO dérivé du schéma `IdentitySettingsSchema` (source de vérité côté frontière).
