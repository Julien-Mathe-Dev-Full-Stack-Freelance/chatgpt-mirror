/**
 * @file src/schemas/site/primary-menu/primary-menu-intents.ts
 * @intro Intent PATCH pour Primary menu
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import {
  PrimaryMenuSettingsSchema,
  type PrimaryMenuItemInput,
} from "@/schemas/site/primary-menu/primary-menu";
import { z } from "zod";

/** Intention PATCH (tous champs optionnels + state?) */
export const UpdatePrimaryMenuSettingsIntentSchema = withOptionalState(
  PrimaryMenuSettingsSchema
);

/** Types d’intention (API) */
export type UpdatePrimaryMenuSettingsIntentDTO = z.infer<
  typeof UpdatePrimaryMenuSettingsIntentSchema
>;

/**
 * Patch DTO pour l’adapter (sans `state`, sans index signature) :
 * on ne permet QUE les clés réellement patchables.
 */
export type UpdatePrimaryMenuSettingsPatchDTO = {
  items?: Array<PrimaryMenuItemInput>;
};
