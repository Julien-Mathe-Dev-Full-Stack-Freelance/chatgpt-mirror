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
export const UpdateSocialSettingsSchema =
  withOptionalState(SocialSettingsSchema);

/** Types d’intention (API) */
export type UpdateSocialSettingsDTO = z.infer<
  typeof UpdateSocialSettingsSchema
>;

/** Patch DTO pour l’adapter (sans `state`, sans index signature) */
export type UpdateSocialSettingsPatchDTO = {
  items?: Array<SocialItemInput>;
};
