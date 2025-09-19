/**
 * @file src/schemas/site/legal-menu/legal-menu-intents.ts
 * @intro Schémas Zod des intentions API pour « Legal menu settings »
 * @description
 * Frontière API : valide la **forme** du patch accepté par
 * PATCH /api/admin/site/legal-menu (types, min/max).
 * La normalisation potentielle reste côté use-case.
 *
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { LegalMenuSettingsSchema } from "@/schemas/site/legal-menu/legal-menu";

/** Intention PATCH des réglages legal-menu (tous les champs optionnels + `state?`). */
export const UpdateLegalMenuSettingsSchema = withOptionalState(
  LegalMenuSettingsSchema
);

/** DTO d’intention pour PATCH legal-menu (côté API) */
