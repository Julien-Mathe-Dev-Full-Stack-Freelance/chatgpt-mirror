/**
 * @file src/schemas/site/site-index.ts
 * @intro Schéma Zod pour l’entité SiteIndex (ordre de navigation).
 * @layer schemas
 */

import { PAGE_TITLE_MAX, PAGE_TITLE_MIN } from "@/core/domain/constants/limits";
import { PageIdTools } from "@/core/domain/ids/tools";
import { defaultT } from "@/i18n/default";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { IsoDateStringSchema } from "@/schemas/date";
import { SlugSchema } from "@/schemas/pages/page";
import { z } from "zod";

const t = defaultT;

const PAGE_ID_REGEX = new RegExp(
  `^${PageIdTools.prefix}[A-Za-z0-9_-]{${PageIdTools.size}}$`
);

/** Référence minimale à une page dans l’index. */
export const SiteIndexPageRefSchema = z
  .object({
    id: z
      .string()
      .trim()
      .refine((value) => PAGE_ID_REGEX.test(value), {
        message: t("validation.id.invalid"),
      }),
    slug: SlugSchema,
    title: nonEmptyTrimmedString(PAGE_TITLE_MIN, PAGE_TITLE_MAX, {
      tooShort: "validation.title.required",
      tooLong: "validation.text.tooLong",
    }),
  })
  .strict();

/** Schéma complet pour l’index du site. */
export const SiteIndexSchema = z
  .object({
    pages: z.array(SiteIndexPageRefSchema),
    updatedAt: IsoDateStringSchema,
  })
  .strict();

/** DTOs (forme persistée/retournée) */
export type SiteIndexDTO = z.infer<typeof SiteIndexSchema>;
export type PageRefDTO = z.infer<typeof SiteIndexPageRefSchema>;
