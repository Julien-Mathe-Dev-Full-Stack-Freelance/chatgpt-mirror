/**
 * @file src/schemas/pages/page-intents.ts
 * @intro Schémas Zod des intentions côté API pour la ressource Page.
 * @description
 * - CreatePageSchema : payload accepté par POST /api/admin/pages
 * - UpdatePageSchema : payload accepté par PATCH /api/admin/pages/[slug]
 *
 * Frontière :
 * - Les validations de **forme** (types, min/max, enum) se font ici.
 * - La normalisation métier (slugify, collisions…) reste dans les use-cases.
 *
 * @layer schemas
 */

import { PAGE_TITLE_MAX, PAGE_TITLE_MIN } from "@/core/domain/constants/limits";
import { defaultT } from "@/i18n/default";
import { PageLayoutSchema, SlugSchema } from "@/schemas/pages/page";
import { ContentStateSchema } from "@/schemas/site/common";
import { z } from "zod";

const t = defaultT;

/**
 * Intention de création de page.
 * - `title` requis (trim avant min/max).
 * - `slug` optionnel (forme validée, normalisation côté use-case).
 * - `layout` partiel/optionnel.
 * - `state` optionnel (défaut "draft" côté use-case/route).
 */
export const CreatePageSchema = z
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
    layout: PageLayoutSchema.partial().optional(),
    state: ContentStateSchema.optional(),
  })
  .strict();

/**
 * Intention de mise à jour (patch partiel).
 * - Tous les champs sont optionnels.
 * - `title` trimé si présent.
 * - `slug` validé (forme), normalisation côté use-case.
 * - `layout` partiel (fusion côté use-case).
 * - `state` optionnel (défaut "draft").
 */
export const UpdatePageSchema = z
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
    layout: PageLayoutSchema.partial().optional(),
    state: ContentStateSchema.optional(),
  })
  .strict();
