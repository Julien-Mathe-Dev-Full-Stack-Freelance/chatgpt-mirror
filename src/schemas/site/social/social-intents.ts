/**
 * @file src/schemas/site/social/social-intents.ts
 * @intro Intent PATCH pour Social settings
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import {
  SocialSettingsSchema,
  type SocialItemInput,
} from "@/schemas/site/social/social";
import { z } from "zod";

/** Intention PATCH (tous champs optionnels + state?) */
export const UpdateSocialSettingsIntentSchema =
  withOptionalState(SocialSettingsSchema);

/** Types d’intention (API) */
export type UpdateSocialSettingsIntentDTO = z.infer<
  typeof UpdateSocialSettingsIntentSchema
>;

/** Patch DTO pour l’adapter (sans `state`, sans index signature) */
export type UpdateSocialSettingsPatchDTO = {
  items?: Array<SocialItemInput>;
};
