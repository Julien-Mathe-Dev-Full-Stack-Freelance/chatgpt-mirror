/**
 * @file src/schemas/site/footer/footer-intents.ts
 * @intro Schémas Zod des intentions API pour les “Footer settings”.
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/settings/footer (types, enums, min/max).
 * - La normalisation/consolidation métier reste côté use-case/adapters.
 * @remarks
 * - `withOptionalState` applique déjà `.strict()` : toute propriété inconnue est rejetée.
 * @layer schemas
 * @todo Centraliser `ContentStateSchema` dans `schemas/site/common.ts`
 *       afin d’éviter les imports croisés dispersés.
 */

import { withOptionalState } from "@/schemas/builders";
import { FooterSettingsSchema } from "@/schemas/site/footer/footer";

/** Intention PATCH des réglages footer (tous les champs optionnels). */
export const UpdateFooterSettingsSchema =
  withOptionalState(FooterSettingsSchema);

/** DTO d’intention pour PATCH footer (côté API). */
