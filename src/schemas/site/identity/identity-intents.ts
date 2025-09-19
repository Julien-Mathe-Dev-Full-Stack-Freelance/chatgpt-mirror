/**
 * @file src/schemas/site/identity/identity-intents.ts
 * @intro Schémas Zod des intentions API pour les “Identity settings”.
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/site/identity (types, min/max).
 * - La normalisation/consolidation métier reste côté use-case/adapters.
 * @remarks
 * - `withOptionalState` applique déjà `.strict()` : les props inconnues sont rejetées.
 * - La valeur par défaut de `state` (ex. "draft") est gérée au niveau route/use-case.
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { IdentitySettingsSchema } from "@/schemas/site/identity/identity";

/** Intention PATCH des réglages d'identité (tous les champs optionnels + `state?`). */
export const UpdateIdentitySettingsSchema = withOptionalState(
  IdentitySettingsSchema
);

/** DTO d’intention pour PATCH identité (côté API). */
