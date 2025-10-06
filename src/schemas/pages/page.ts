/**
 * @file src/schemas/pages/page.ts
 * @intro Schémas Zod pour l’entité Page (V0.5, sans layout + sitemap)
 * @layer schemas
 * @description
 * - Valide la **forme** de Page/Slug/Sitemap/Meta côté frontière.
 * - Les defaults sont gérés côté domaine/use-cases.
 */

import {
  PAGE_TITLE_MAX,
  PAGE_TITLE_MIN,
  SLUG_MIN,
} from "@/core/domain/constants/limits";
import { ID_SCHEMAS } from "@/core/domain/ids/schema";
import { SLUG_FINAL_RE } from "@/core/domain/slug/constants";
import { isReservedSlug } from "@/core/domain/slug/utils";
import { defaultT } from "@/i18n/default";
import { IsoDateStringSchema } from "@/schemas/date";
import { z } from "zod";
// Si tu as déjà un schéma de blocs, décommente l'import ci-dessous :
// import { BlockSchema } from "@/schemas/blocks/blocks";

const t = defaultT;

/** ID page `pg_` + taille SoT (URL-safe). */
const { prefix: PAGE_ID_PREFIX, size: PAGE_ID_SIZE } = ID_SCHEMAS.page;
const ESC = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PAGE_ID_REGEX = new RegExp(
  `^${ESC(PAGE_ID_PREFIX)}[A-Za-z0-9_-]{${PAGE_ID_SIZE}}$`
);
export const PageIdSchema = z
  .string()
  .regex(PAGE_ID_REGEX, t("validation.id.invalid"));

/** Slug kebab-case strict + réservations. */
export const SlugSchema = z
  .string()
  .regex(SLUG_FINAL_RE, t("validation.slug.formatInvalid"))
  .min(SLUG_MIN, t("validation.slug.required"))
  .refine((s) => !isReservedSlug(s), t("validation.slug.reserved"));

/** Fréquences sitemap (SoT minimal). */
export const SitemapChangeFreqSchema = z.enum([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const);

/** Bloc sitemap (V0.5). */
export const PageSitemapSchema = z
  .object({
    include: z.boolean(),
    changefreq: SitemapChangeFreqSchema.optional(),
    priority: z.number().min(0).max(1).optional(),
  })
  .strict();

/** Schéma complet Page (forme). */
export const PageSchema = z
  .object({
    id: PageIdSchema,
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
    // V0.5 : blocs présents mais vides ; si tu as l’union, remets BlockSchema.
    // blocks: z.array(BlockSchema),
    blocks: z.array(z.unknown()),
    meta: z.object({
      createdAt: IsoDateStringSchema,
      updatedAt: IsoDateStringSchema,
    }),
    sitemap: PageSitemapSchema.optional(),
  })
  .strict();

export type PageInput = z.input<typeof PageSchema>;
