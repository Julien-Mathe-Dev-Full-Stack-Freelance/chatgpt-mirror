/**
 * @file src/schemas/site/header/header-intents.ts
 * @intro Schémas Zod des intentions API pour “Header settings” (V0.5)
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/site/header (types booleans).
 * - La normalisation/consolidation métier reste côté use-case/adapters.
 * @remarks
 * - `withOptionalState` applique déjà `.strict()` : props inconnues rejetées.
 * - PATCH = tous les champs optionnels + `state?`.
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import {
  HeaderSettingsSchema,
  type HeaderSettingsInput,
} from "@/schemas/site/header/header";
import { z } from "zod";

/** Intention PATCH des réglages header (tous les champs optionnels + `state?`). */
export const UpdateHeaderSettingsIntentSchema =
  withOptionalState(HeaderSettingsSchema);

/** DTO d’intention pour PATCH header (côté API). */
export type UpdateHeaderSettingsIntentDTO = z.input<
  typeof UpdateHeaderSettingsIntentSchema
>;

/** Patch DTO pour l’adapter (sans `state`, sans index signature). */
export type UpdateHeaderSettingsPatchDTO = Partial<HeaderSettingsInput>;
