/**
 * @file src/schemas/site/footer/footer-intents.ts
 * @intro Schémas Zod des intentions API pour “Footer settings” (V0.5)
 * @description
 * - PATCH /api/admin/site/footer : tous champs optionnels + `state?`
 * - `withOptionalState` applique `.strict()` (props inconnues rejetées)
 */

import { withOptionalState } from "@/schemas/builders";
import {
  FooterSettingsSchema,
  type FooterSettingsInput,
} from "@/schemas/site/footer/footer";
import { z } from "zod";

/** Intention PATCH (tous champs optionnels + state?) */
export const UpdateFooterSettingsIntentSchema =
  withOptionalState(FooterSettingsSchema);

/** DTO d’intention (côté API) */
export type UpdateFooterSettingsIntentDTO = z.input<
  typeof UpdateFooterSettingsIntentSchema
>;

/** Patch DTO pour l’adapter (sans `state`) */
export type UpdateFooterSettingsPatchDTO = Partial<FooterSettingsInput>;
