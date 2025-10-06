/**
 * @file src/schemas/site/legal-menu/legal-menu-intents.ts
 * @intro Intent PATCH pour Legal menu
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import {
  LegalMenuSettingsSchema,
  type LegalMenuItemInput,
} from "@/schemas/site/legal-menu/legal-menu";
import { z } from "zod";

/** Intention PATCH (tous champs optionnels + state?) */
export const UpdateLegalMenuSettingsIntentSchema = withOptionalState(
  LegalMenuSettingsSchema
);

/** Types d’intention (API) */
export type UpdateLegalMenuSettingsIntentDTO = z.infer<
  typeof UpdateLegalMenuSettingsIntentSchema
>;

/**
 * Patch DTO pour l’adapter (sans `state`, sans index signature) :
 * on ne permet QUE les clés réellement patchables.
 */
export type UpdateLegalMenuSettingsPatchDTO = {
  items?: Array<LegalMenuItemInput>;
};
