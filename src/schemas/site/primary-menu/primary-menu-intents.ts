/**
 * @file src/schemas/site/primary-menu/primary-menu-intents.ts
 * @intro Schémas Zod des intentions API pour les “Menu settings”.
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/site/menu (types, min/max).
 * - La normalisation/consolidation métier reste côté use-case/adapters.
 * @remarks
 * - `withOptionalState` applique déjà `.strict()` : les props inconnues sont rejetées.
 * - La valeur par défaut de `state` (ex. "draft") est gérée au niveau route/use-case.
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { PrimaryMenuSettingsSchema } from "@/schemas/site/primary-menu/primary-menu";

/** Intention PATCH des réglages menu (tous les champs optionnels + `state?`). */
export const UpdatePrimaryMenuSettingsSchema = withOptionalState(
  PrimaryMenuSettingsSchema
);

/** DTO d’intention pour PATCH menu (côté API). */
