/**
 * @file src/schemas/pages/page.ts
 * @intro Schémas Zod pour la validation des entités Page.
 * @description
 * - Valide la structure et les règles de forme avant persistance/exposition.
 * - Sert de source de vérité pour générer les types (via `z.infer`).
 *
 * @layer schemas
 */

import { SLUG_FINAL_RE } from "@/core/domain/slug/constants";
import { isReservedSlug } from "@/core/domain/slug/utils";
import { IsoDateStringSchema } from "@/schemas/date";
import { z } from "zod";

import { H_ALIGNMENTS, SPACING_STEPS } from "@/core/domain/constants/layout";
import {
  PAGE_TITLE_MAX,
  PAGE_TITLE_MIN,
  SLUG_MIN,
} from "@/core/domain/constants/limits";
import { CONTAINER_VALUES } from "@/core/domain/constants/theme";
import { PageIdTools } from "@/core/domain/ids/tools";
import { defaultT } from "@/i18n/default";
import { BlockSchema } from "@/schemas/blocks/blocks";

const t = defaultT;

const PAGE_ID_REGEX = new RegExp(
  `^${PageIdTools.prefix}[A-Za-z0-9_-]{${PageIdTools.size}}$`
);

/**
 * Options de layout d’une page.
 * Valide uniquement la **forme** ; les valeurs par défaut sont appliquées côté domaine.
 * @todo Externaliser vers un système de thèmes/config globale.
 */
export const PageLayoutSchema = z
  .object({
    /** Largeur max du contenu. */
    maxWidth: z.enum(CONTAINER_VALUES).optional(),
    /** Espacement vertical entre les blocs. */
    spacingY: z.enum(SPACING_STEPS).optional(),
    /** Alignement horizontal du contenu. */
    align: z.enum(H_ALIGNMENTS).optional(),
  })
  .strict();

/**
 * Slug kebab-case strict.
 * - Doit respecter `[a-z0-9]+(-[a-z0-9]+)*`.
 * - Ne doit pas être vide.
 * - Ne doit pas appartenir aux slugs réservés (admin, api, draft…).
 * Remarque : la normalisation (slugify) reste côté use-case.
 */
export const SlugSchema = z
  .string()
  .regex(SLUG_FINAL_RE, t("validation.slug.formatInvalid"))
  .min(SLUG_MIN, t("validation.slug.required"))
  .refine((s) => !isReservedSlug(s), t("validation.slug.reserved"));

/**
 * Schéma complet d’une Page.
 * - `id` : string non vide (ex. nanoid).
 * - `slug` : validé via `SlugSchema`.
 * - `title` : trim + borne [2, 80].
 * - `layout` : options validées via `PageLayoutSchema`.
 * - `blocks` : liste de blocs versionnés validée via `BlockSchema` (union discriminée).
 * - `meta` : timestamps ISO requis.
 */
export const PageSchema = z
  .object({
    id: z
      .string()
      .trim()
      .refine((value) => PAGE_ID_REGEX.test(value), {
        message: t("validation.id.invalid"),
      }),
    slug: SlugSchema,
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
    layout: PageLayoutSchema,
    // blocs versionnés (union discriminée)
    blocks: z.array(BlockSchema),
    meta: z.object({
      createdAt: IsoDateStringSchema,
      updatedAt: IsoDateStringSchema,
    }),
  })
  .strict();
