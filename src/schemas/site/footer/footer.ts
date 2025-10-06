/**
 * @file src/schemas/site/footer/footer.ts
 * @intro Schéma Zod pour la configuration du footer (V0.5)
 * @description
 * Frontière **forme** (DTO) — strictement alignée sur l'entité V0.5 :
 *   - copyright: string (trim, peut être vide)
 *   - showYear: boolean
 * Les valeurs par défaut restent côté domaine (DEFAULT_FOOTER_SETTINGS).
 */

import { z } from "zod";
// Optionnel si tu as une borne globale :
import { FOOTER_COPYRIGHT_MAX } from "@/core/domain/constants/limits";

export const FooterSettingsSchema = z
  .object({
    // Texte libre, trimé. Autorisé à être vide en V0.5.
    // Si tu n'as pas de constante, remplace par .max(200) p.ex.
    copyright: z
      .string()
      .trim()
      .max(FOOTER_COPYRIGHT_MAX, { message: "validation.text.tooLong" }),

    // Afficher l'année courante près du copyright.
    showYear: z.boolean(),
  })
  .strict();

export type FooterSettingsInput = z.input<typeof FooterSettingsSchema>;
