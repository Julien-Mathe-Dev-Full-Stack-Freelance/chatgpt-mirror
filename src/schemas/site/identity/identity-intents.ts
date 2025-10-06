/**
 * @file src/schemas/site/identity/identity-intents.ts
 * @intro Intent PATCH pour Identity (partial + state?) avec clearabilité des assets
 * @layer schemas
 *
 * - Homogène avec les autres sections : baseSchema -> withOptionalState(base)
 * - On *écrase* les 4 champs d’asset pour autoriser `"" | null` (clear)
 */

import { withOptionalState, type PatchFromBase } from "@/schemas/builders";
import { AssetUrlSchema } from "@/schemas/shared/url-fragments";
import {
  IdentitySettingsSchema,
  type IdentitySettingsInput,
} from "@/schemas/site/identity/identity";
import { z } from "zod";

/** Variante patchable des assets: AssetUrl | "" | null (clear) */
const AssetUrlPatchable = z.union([AssetUrlSchema, z.literal(""), z.null()]);

/**
 * Schéma d’intention PATCH:
 * - Rend tout le schéma base *optionnel* + ajoute `state?`
 * - Remplace les 4 champs d’asset par la variante *patchable* (clear)
 */
export const UpdateIdentitySettingsIntentSchema = withOptionalState(
  IdentitySettingsSchema
).extend({
  logoLightUrl: AssetUrlPatchable.optional(),
  logoDarkUrl: AssetUrlPatchable.optional(),
  faviconLightUrl: AssetUrlPatchable.optional(),
  faviconDarkUrl: AssetUrlPatchable.optional(),
});

/** Types d’intention (API) */
export type UpdateIdentitySettingsIntentDTO = z.input<
  typeof UpdateIdentitySettingsIntentSchema
>;

// Overrides "clearables" pour les 4 assets:
type IdentityAssetOverrides = {
  logoLightUrl: z.input<typeof AssetUrlPatchable>; // string | "" | null
  logoDarkUrl: z.input<typeof AssetUrlPatchable>;
  faviconLightUrl: z.input<typeof AssetUrlPatchable>;
  faviconDarkUrl: z.input<typeof AssetUrlPatchable>;
};

/** Patch DTO pour l’adapter (pas de state, pas d’index signature) */
export type UpdateIdentitySettingsPatchDTO = PatchFromBase<
  IdentitySettingsInput,
  IdentityAssetOverrides
>;
