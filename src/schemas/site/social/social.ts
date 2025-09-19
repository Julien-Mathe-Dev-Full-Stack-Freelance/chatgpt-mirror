/**
 * @file src/schemas/site/social/social.ts
 * @intro Schéma Zod pour la configuration des liens sociaux.
 * @description
 * Source de vérité côté validation/DTO (frontière de **forme**, sans valeurs par défaut côté domaine).
 * Liste ordonnée d’items `{ kind, href }`. La normalisation (ex. adaptation des liens) reste hors schéma.
 * @remarks
 * - `href` accepte `http(s)://`, une URL relative commençant par `/`, ou `mailto:`.
 * - `.strict()` est déjà appliqué : les props inconnues sont rejetées.
 * @todo Affiner `href` : imposer `mailto:` quand `kind="email"` et `https?://` pour les autres plateformes.
 * @layer schemas
 */

import { SOCIAL_ITEM_MAX } from "@/core/domain/constants/limits";
import { isMailtoHref } from "@/core/domain/urls/mailto";
import {
  SOCIAL_KIND_EMAIL,
  SOCIAL_KINDS,
} from "@/core/domain/site/social/constants";
import { defaultT } from "@/i18n/default";
import {
  AbsoluteHttpUrlSchema,
  RelativeUrlSchema,
} from "@/schemas/site/common";
import { z } from "zod";

const t = defaultT;

/** Plateformes supportées (MVP). */
export const SocialKindSchema = z.enum(SOCIAL_KINDS);

/**
 * URL mailto: valide (adresse email + query string optionnelle).
 * Ex.: mailto:user@example.com, mailto:user@example.com?subject=Hi&body=...
 */
const MailtoHrefSchema = z
  .string()
  .trim()
  .refine(isMailtoHref, t("validation.mailto.invalid"));

/** URL de lien social autorisée (http(s), relative “/”, ou mailto). */
export const SocialHrefSchema = z.union([
  AbsoluteHttpUrlSchema,
  RelativeUrlSchema,
  MailtoHrefSchema,
]);

/** Un lien social (MVP). */
export const SocialItemSchema = z
  .object({
    /** Plateforme cible (mappée vers l’icône côté UI/public). */
    kind: SocialKindSchema,
    /** URL absolue/relative ou mailto (validation fine ci-dessous). */
    href: SocialHrefSchema,
  })
  .strict()
  .superRefine((val, ctx) => {
    const { kind, href } = val;
    const isMailto = MailtoHrefSchema.safeParse(href).success;
    const isAbsolute = AbsoluteHttpUrlSchema.safeParse(href).success;
    const isRelative = RelativeUrlSchema.safeParse(href).success;

    if (kind === SOCIAL_KIND_EMAIL) {
      // exiger un mailto:
      if (!isMailto) {
        ctx.addIssue({
          code: "custom",
          path: ["href"],
          message: t("validation.social.href.mailtoRequired"),
        });
      }
      return;
    }

    // Pour TOUTES les autres plateformes : http(s) absolu UNIQUEMENT
    if (isMailto) {
      ctx.addIssue({
        code: "custom",
        path: ["href"],
        message: t("validation.social.href.mailtoForbidden"),
      });
      return;
    }

    if (!isAbsolute) {
      // Message plus clair si l’utilisateur a mis un lien relatif
      if (isRelative) {
        ctx.addIssue({
          code: "custom",
          path: ["href"],
          message: t("validation.social.href.absoluteRequired"),
        });
      } else {
        ctx.addIssue({
          code: "custom",
          path: ["href"],
          message: t("validation.social.href.invalidForPlatform"),
        });
      }
    }
  });

/** Schéma de configuration SocialLinks (liste ordonnée d’items). */
export const SocialSettingsSchema = z
  .object({
    items: z.array(SocialItemSchema).max(SOCIAL_ITEM_MAX),
  })
  .strict();

/** Type DTO dérivé du schéma `SocialSettingsSchema` (source de vérité côté frontière).*/
