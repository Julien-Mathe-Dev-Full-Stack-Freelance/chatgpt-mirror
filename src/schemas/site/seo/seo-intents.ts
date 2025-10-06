/**
 * @file src/schemas/site/seo/seo-intents.ts
 * @intro Intent PATCH pour SEO settings
 * @description
 * - PATCH /api/admin/site/seo : tous champs optionnels + `state?`
 * - `.strict()` → props inconnues rejetées
 * - Pas de valeurs par défaut ici (domaine only).
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import {
  SeoSettingsSchema,
  type SeoSettingsInput,
} from "@/schemas/site/seo/seo";
import { z } from "zod";

/** Intention PATCH (tout optionnel + state?). */
export const UpdateSeoSettingsIntentSchema =
  withOptionalState(SeoSettingsSchema);

/** DTO complet pour API (entrées utilisateur) */
export type UpdateSeoSettingsIntentDTO = z.input<
  typeof UpdateSeoSettingsIntentSchema
>;

/** Patch DTO adapté (pas de state, pas d’index signature). */
export type UpdateSeoSettingsPatchDTO = Partial<SeoSettingsInput>;
