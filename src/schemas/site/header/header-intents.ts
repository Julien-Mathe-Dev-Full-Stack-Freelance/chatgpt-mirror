/**
 * @file src/schemas/site/header/header-intents.ts
 * @intro Schémas Zod des intentions API pour les “Header settings”.
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/settings/header (types, enums, min/max).
 * - La normalisation/consolidation métier reste côté use-case/adapters.
 * @remarks
 * - `withOptionalState` applique déjà `.strict()` : les props inconnues sont rejetées.
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { HeaderSettingsSchema } from "@/schemas/site/header/header";

/** Intention PATCH des réglages header (tous les champs optionnels + `state?`). */
export const UpdateHeaderSettingsSchema =
  withOptionalState(HeaderSettingsSchema);

/** DTO d’intention pour PATCH header (côté API). */
