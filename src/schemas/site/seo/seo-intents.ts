/**
 * @file src/schemas/site/seo/seo-intents.ts
 * @intro Schémas Zod des intentions API pour les “SEO settings”.
 * @description
 * - Frontière API : valide la **forme** du payload PATCH /api/admin/site/seo (types, min/max).
 * - La normalisation/consolidation métier reste côté use-case/adapters.
 * @remarks
 * - Les propriétés inconnues sont déjà rejetées (`withOptionalState` utilise `.strict()`).
 * - La valeur par défaut de `state` (ex. "draft") est gérée au niveau route/use-case.
 * @layer schemas
 */

import { withOptionalState } from "@/schemas/builders";
import { SeoSettingsSchema } from "@/schemas/site/seo/seo";

/** Intention PATCH des réglages SEO (tous les champs optionnels + `state?`). */
export const UpdateSeoSettingsSchema = withOptionalState(SeoSettingsSchema);

/** DTO d’intention pour PATCH SEO (côté API). */
