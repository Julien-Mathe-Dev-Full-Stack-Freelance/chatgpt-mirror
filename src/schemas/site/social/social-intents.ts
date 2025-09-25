/**
 * @file src/schemas/site/social/social-intents.ts
 * @intro Schémas Zod des intentions API pour les “Social settings”.
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/site/social (types, min/max).
 * - La normalisation/consolidation métier reste côté use-case/adapters.
 * @remarks
 * - Les propriétés inconnues sont déjà rejetées (`withOptionalState` applique `.strict()`).
 * - La valeur par défaut de `state` (ex. "draft") est gérée au niveau route/use-case.
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { SocialSettingsSchema } from "@/schemas/site/social/social";

/** Intention PATCH des réglages sociaux (tous les champs optionnels + `state?`). */
export const UpdateSocialSettingsSchema =
  withOptionalState(SocialSettingsSchema);

/** DTO d’intention pour PATCH social (côté API). */
