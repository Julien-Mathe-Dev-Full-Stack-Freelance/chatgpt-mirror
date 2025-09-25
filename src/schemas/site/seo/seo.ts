/**
 * @file src/schemas/site/seo/seo.ts
 * @intro Schéma Zod pour la configuration SEO du site.
 * @description
 * Source de vérité côté validation/DTO (frontière de **forme**, sans valeurs par défaut).
 * Les valeurs par défaut et la normalisation (ex. fallback d’OG image, clamp de titres)
 * se gèrent côté domaine/use-cases (ex. `DEFAULT_SEO_SETTINGS`), pas dans ce schéma.
 * @remarks
 * - `baseUrl` est optionnelle pour autoriser les environnements de dev/preview.
 * - `.strict()` est déjà appliqué : les propriétés inconnues sont refusées.
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
import {
  nonEmptyTrimmedString,
  titleTemplateWithPlaceholder,
} from "@/schemas/builders";
import {
  AbsoluteHttpUrlSchema,
  AssetUrlSchema,
  TwitterHandleSchema,
} from "@/schemas/site/common";
import { defaultT } from "@/i18n/default";
import { z } from "zod";

const t = defaultT;
const REQUIRE_BASEURL_HTTPS = process.env.NODE_ENV === "production";

/** Bloc Open Graph (MVP). */
const OpenGraphSchema = z
  .object({
    /** Image par défaut pour le partage (OG). */
    defaultImageUrl: AssetUrlSchema.optional(),
  })
  .strict();

/** Bloc Twitter/X (MVP). */
const TwitterSchema = z
  .object({
    /** Type de carte Twitter. */
    card: z.enum(TWITTER_CARD_TYPES),
    /** Compte du site (optionnel), avec ou sans '@'. */
    site: TwitterHandleSchema.optional(),
    /** Auteur/créateur (optionnel), avec ou sans '@'. */
    creator: TwitterHandleSchema.optional(),
  })
  .strict();

/** Schéma principal SEO. */
export const SeoSettingsSchema = z
  .object({
    /** Base absolue du site (ex: https://exemple.com). Optionnelle en dev/preview. */
    baseUrl: AbsoluteHttpUrlSchema.optional().superRefine((v, ctx) => {
      if (!v) return;
      if (!REQUIRE_BASEURL_HTTPS) return;
      try {
        const { protocol } = new URL(v);
        if (protocol !== "https:") {
          ctx.addIssue({
            code: "custom",
            message: t("validation.url.httpsRequired"), // ajoute cette clé i18n
            path: [],
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          message: t("validation.url.absoluteHttp.invalid"),
          path: [],
        });
      }
    }),

    /** Titre par défaut (court, trimé, 1–60). */
    defaultTitle: nonEmptyTrimmedString(SEO_TITLE_MIN, SEO_TITLE_MAX, {
      tooShort: "validation.text.tooShort",
      tooLong: "validation.text.tooLong",
    }),

    /** Meta description (trimée, 50–160 recommandés). */
    defaultDescription: nonEmptyTrimmedString(
      SEO_DESCRIPTION_MIN,
      SEO_DESCRIPTION_MAX,
      {
        tooShort: "validation.text.tooShort",
        tooLong: "validation.text.tooLong",
      }
    ).optional(),

    /** Modèle de titre (doit contenir "%s", 3–120). */
    titleTemplate: titleTemplateWithPlaceholder(TITLE_PLACEHOLDER, {
      min: SEO_TITLE_TEMPLATE_MIN,
      max: SEO_TITLE_TEMPLATE_MAX,
    }).optional(),

    /** Paramètres Open Graph. */
    openGraph: OpenGraphSchema.optional(),

    /** Paramètres Twitter/X (forme cohérente). */
    twitter: TwitterSchema,
  })
  .strict();
