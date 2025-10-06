/**
 * @file src/schemas/site/social/social.ts
 * @intro Schéma Zod pour la configuration des liens sociaux.
 * @layer schemas
 */

import { SOCIAL_ITEM_MAX } from "@/core/domain/constants/limits";
import {
  SOCIAL_KIND_EMAIL,
  SOCIAL_KINDS,
} from "@/core/domain/site/social/constants";
import { isMailtoHref } from "@/core/domain/urls/tools";
import { defaultT } from "@/i18n/default";
import {
  AbsoluteHttpUrlSchema,
  RelativeUrlSchema,
} from "@/schemas/shared/url-fragments";
import { z } from "zod";

const t = defaultT;

/** Plateformes supportées (MVP). */
const SocialKindSchema = z.enum(SOCIAL_KINDS);

/**
 * URL mailto: valide (adresse email + query string optionnelle).
 */
const MailtoHrefSchema = z
  .string()
  .trim()
  .refine(isMailtoHref, t("validation.mailto.invalid"));

/** URL de lien social autorisée (http(s), relative “/”, ou mailto). */
const SocialHrefSchema = z.union([AbsoluteHttpUrlSchema, MailtoHrefSchema]);

/** Un lien social (MVP). */
const SocialItemSchema = z
  .object({
    kind: SocialKindSchema,
    href: SocialHrefSchema,
  })
  .strict()
  .superRefine((val, ctx) => {
    const { kind, href } = val;
    const isMailto = MailtoHrefSchema.safeParse(href).success;
    const isAbsolute = AbsoluteHttpUrlSchema.safeParse(href).success;
    const isRelative = RelativeUrlSchema.safeParse(href).success;

    if (kind === SOCIAL_KIND_EMAIL) {
      if (!isMailto) {
        ctx.addIssue({
          code: "custom",
          path: ["href"],
          message: t("validation.social.href.mailtoRequired"),
        });
      }
      return;
    }

    if (isMailto) {
      ctx.addIssue({
        code: "custom",
        path: ["href"],
        message: t("validation.social.href.mailtoForbidden"),
      });
      return;
    }

    if (!isAbsolute) {
      ctx.addIssue({
        code: "custom",
        path: ["href"],
        message: isRelative
          ? t("validation.social.href.absoluteRequired")
          : t("validation.social.href.invalidForPlatform"),
      });
    }
  });

/** Schéma de configuration SocialLinks (liste ordonnée d’items). */
export const SocialSettingsSchema = z
  .object({
    items: z.array(SocialItemSchema).max(SOCIAL_ITEM_MAX),
  })
  .strict();

export type SocialItemInput = z.input<typeof SocialItemSchema>;
export type SocialSettingsInput = z.input<typeof SocialSettingsSchema>;
