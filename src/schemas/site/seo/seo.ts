/**
 * @file src/schemas/site/seo/seo.ts
 * @intro Schéma Zod pour la configuration SEO du site.
 * @description
 * Source de vérité côté validation/DTO (frontière de **forme**, sans valeurs par défaut).
 * Les valeurs par défaut et la normalisation (fallback OG image, clamp titres)
 * se gèrent côté domaine/use-cases (`DEFAULT_SEO_SETTINGS`).
 * @remarks
 * - `baseUrl` est optionnelle (utile pour dev/preview).
 * - `.strict()` → props inconnues refusées.
 * @layer schemas
 */

import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_TITLE_MAX,
  SEO_TITLE_MIN,
  SEO_TITLE_TEMPLATE_MAX,
  SEO_TITLE_TEMPLATE_MIN,
} from "@/core/domain/constants/limits";
import {
  TITLE_PLACEHOLDER,
  TWITTER_CARD_TYPES,
} from "@/core/domain/site/seo/constants";
import { defaultT } from "@/i18n/default";
import {
  nonEmptyTrimmedString,
  titleTemplateWithPlaceholder,
} from "@/schemas/builders";
import {
  AbsoluteHttpUrlSchema,
  AssetUrlSchema,
} from "@/schemas/shared/url-fragments";
import { z } from "zod";

const t = defaultT;
const REQUIRE_BASEURL_HTTPS = process.env.NODE_ENV === "production";

/** Bloc Open Graph (V0.5). */
const OpenGraphSchema = z
  .object({
    title: z.string().trim().max(SEO_TITLE_MAX).optional(),
    description: z.string().trim().max(SEO_DESCRIPTION_MAX).optional(),
    defaultImageUrl: AssetUrlSchema.optional(),
    imageAlt: z.string().trim().max(100).optional(),
  })
  .strict();

const TwitterHandleSchema = z
  .string()
  .trim()
  .refine((s) => /^@?[A-Za-z0-9_]{1,15}$/.test(s), {
    message: t("validation.twitter.handle.invalid"),
  });

/** Bloc Twitter (V0.5). */
const TwitterSchema = z
  .object({
    card: z.enum(TWITTER_CARD_TYPES),
    site: TwitterHandleSchema.optional(),
    creator: TwitterHandleSchema.optional(),
  })
  .strict();

/** Schéma principal SEO. */
export const SeoSettingsSchema = z
  .object({
    baseUrl: AbsoluteHttpUrlSchema.optional().superRefine((v, ctx) => {
      if (!v) return;
      if (!REQUIRE_BASEURL_HTTPS) return;
      try {
        const { protocol } = new URL(v);
        if (protocol !== "https:") {
          ctx.addIssue({
            code: "custom",
            message: t("validation.url.httpsRequired"),
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          message: t("validation.url.absoluteHttp.invalid"),
        });
      }
    }),

    defaultTitle: nonEmptyTrimmedString(SEO_TITLE_MIN, SEO_TITLE_MAX, {
      tooShort: "validation.text.tooShort",
      tooLong: "validation.text.tooLong",
    }),

    defaultDescription: nonEmptyTrimmedString(
      SEO_DESCRIPTION_MIN,
      SEO_DESCRIPTION_MAX,
      {
        tooShort: "validation.text.tooShort",
        tooLong: "validation.text.tooLong",
      }
    ).optional(),

    titleTemplate: titleTemplateWithPlaceholder(TITLE_PLACEHOLDER, {
      min: SEO_TITLE_TEMPLATE_MIN,
      max: SEO_TITLE_TEMPLATE_MAX,
    }).optional(),

    canonicalUrl: AbsoluteHttpUrlSchema.optional(),

    robots: z.string().trim().max(50).optional(),

    openGraph: OpenGraphSchema.optional(),

    twitter: TwitterSchema,

    structuredDataEnabled: z.boolean().optional(),
  })
  .strict();

export type SeoSettingsInput = z.input<typeof SeoSettingsSchema>;
