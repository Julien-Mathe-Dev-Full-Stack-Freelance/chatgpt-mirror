/**
 * @file src/schemas/site/admin/admin-intents.ts
 * @intro Schémas Zod des intentions API pour la mise à jour des réglages Admin.
 * @description
 * - `UpdateAdminSettingsSchema` : payload **partiel** accepté côté Admin (PATCH).
 * - Les validations de **forme** (types, enum, min/max) se font ici.
 * - La normalisation métier et les validations **contextuelles** restent dans les use-cases.
 * @remarks
 * - `withOptionalState` applique déjà `.strict()` en interne : les props inconnues sont rejetées.
 *   (adapter si l’API doit tolérer des champs additionnels à l’avenir.)
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { AdminSettingsSchema } from "@/schemas/site/admin/admin";

/**
 * Intention de mise à jour des réglages Admin (patch partiel).
 * - Tous les champs de `AdminSettingsSchema` deviennent optionnels.
 * - `state` est optionnel ; la valeur par défaut (ex: `"draft"`) est gérée côté use-case/route.
 * - La validation couvre la **forme** du payload ; la consolidation/merge et les invariants métier
 *   (ex. transitions d'état, collisions) sont traités hors schéma.
 */
export const UpdateAdminSettingsSchema = withOptionalState(AdminSettingsSchema);

/** Type DTO dérivé du schéma `UpdateAdminSettingsSchema` (frontière API Admin). */
