/**
 * @file src/schemas/pages/page-intents.ts
 * @intro Schémas Zod des intentions API pour Page (V0.5)
 * @description
 * - CreatePageIntentSchema : payload POST /api/admin/pages
 * - UpdatePageIntentSchema : payload PATCH /api/admin/pages/[slug]
 * Règles :
 * - **Forme uniquement** (Zod). Slugify/collisions → use-cases.
 * - Pas de `layout` en V0.5. Ajout du bloc `sitemap` minimal.
 * @layer schemas
 */

import { PAGE_TITLE_MAX, PAGE_TITLE_MIN } from "@/core/domain/constants/limits";
import { defaultT } from "@/i18n/default";
import { PageSitemapSchema, SlugSchema } from "@/schemas/pages/page";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { z } from "zod";

const t = defaultT;

/** Intention de création (POST). */
export const CreatePageIntentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(
        PAGE_TITLE_MIN,
        t("validation.text.tooShort", { min: PAGE_TITLE_MIN })
      )
      .max(
        PAGE_TITLE_MAX,
        t("validation.text.tooLong", { max: PAGE_TITLE_MAX })
      ),
    slug: SlugSchema.optional(),
    /** State logique draft/published (défaut appliqué côté route/use-case). */
    state: ContentStateSchema.optional(),
    /** Bloc sitemap partiel autorisé (defaults appliqués côté domaine). */
    sitemap: PageSitemapSchema.partial().optional(),
  })
  .strict();

export type CreatePageIntentDTO = z.input<typeof CreatePageIntentSchema>;

/** Intention de mise à jour (PATCH). */
export const UpdatePageIntentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(
        PAGE_TITLE_MIN,
        t("validation.text.tooShort", { min: PAGE_TITLE_MIN })
      )
      .max(
        PAGE_TITLE_MAX,
        t("validation.text.tooLong", { max: PAGE_TITLE_MAX })
      )
      .optional(),
    slug: SlugSchema.optional(),
    state: ContentStateSchema.optional(),
    sitemap: PageSitemapSchema.partial().optional(),
  })
  .strict();

export type UpdatePageIntentDTO = z.input<typeof UpdatePageIntentSchema>;

export const DeletePageIntentSchema = z
  .object({
    slug: SlugSchema,
    state: ContentStateSchema.optional(),
  })
  .strict();

export type DeletePageIntentDTO = z.input<typeof DeletePageIntentSchema>;
