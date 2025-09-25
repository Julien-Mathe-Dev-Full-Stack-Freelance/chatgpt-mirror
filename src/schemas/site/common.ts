/**
 * @file src/schemas/site/common.ts
 * @intro Schémas Zod partagés (états, URLs d’assets, tailles UI).
 * @description
 * Valeurs communes entre les schémas de configuration du site.
 * Valident uniquement la forme ; la normalisation reste côté use-cases/adapters.
 * @layer schemas
 */

import { CONTENT_STATES } from "@/core/domain/constants/common";
import { MAX_URL_LENGTH } from "@/core/domain/constants/limits";
import {
  CONTAINERS,
  HEADER_FOOTER_HEIGHTS,
} from "@/core/domain/constants/theme";
import {
  isAbsoluteHttpProtocol,
  RELATIVE_URL_RE,
} from "@/core/domain/constants/web";
import type {
  AbsoluteHttpUrl,
  RelativeUrl,
} from "@/core/domain/urls/href";
import { defaultT } from "@/i18n/default";
import { z } from "zod";

const t = defaultT;
/**
 * Espace logique de contenu (workflow de publication).
 * - draft     : brouillon (édition en cours)
 * - published : version publiée (runtime public)
 */
export const ContentStateSchema = z.enum(CONTENT_STATES);

/**
 * URL absolue http(s) stricte.
 * - trim ; pas d'espaces internes
 * - new URL() doit réussir
 * - protocole http/https uniquement
 * - hostname requis
 * - longueur ≤ 2048
 */
export const AbsoluteHttpUrlSchema = z
  .string()
  .trim()
  .refine((s) => s.length > 0, { message: t("validation.url.required") })
  .refine((s) => !/\s/.test(s), { message: t("validation.url.noSpaces") })
  .refine((s) => !s.includes("\\"), {
    message: t("validation.url.backslash.forbidden"),
  })
  .refine((s) => s.length <= MAX_URL_LENGTH, {
    message: t("validation.url.tooLong", { max: MAX_URL_LENGTH }),
  })
  .refine(
    (s) => {
      try {
        const u = new URL(s);
        return isAbsoluteHttpProtocol(u.protocol) && !!u.hostname;
      } catch {
        return false;
      }
    },
    { message: t("validation.url.absoluteHttp.invalid") }
  )
  .brand<"AbsoluteHttpUrl">();

export const RelativeUrlSchema = z
  .string()
  .trim()
  .refine((s) => s.length > 0, { message: t("validation.url.required") })
  .refine((s) => !/\s/.test(s), { message: t("validation.url.noSpaces") })
  .refine((s) => !s.includes("\\"), {
    message: t("validation.url.backslash.forbidden"),
  })
  .refine((s) => RELATIVE_URL_RE.test(s), {
    message: t("validation.url.relative.invalid"),
  })
  .brand<"RelativeUrl">();

/**
 * URL d’asset autorisée (absolue http(s) OU relative).
 */
export const AssetUrlSchema = z.union([
  AbsoluteHttpUrlSchema,
  RelativeUrlSchema,
]);

/**
 * Identifiant X/Twitter (avec ou sans '@'), 1–15 caractères [A-Za-z0-9_].
 * Exemples acceptés: "@julien_dev", "julien_dev"
 *
 * ⚠️ Validation **sans normalisation** (pas de .transform ici).
 * La normalisation (ex. forcer le '@') reste côté use-case/adapters.
 */
export const TwitterHandleSchema = z
  .string()
  .trim()
  .refine((s) => /^@?[A-Za-z0-9_]{1,15}$/.test(s), {
    message: t("validation.twitter.handle.invalid"),
  });

/**
 * Hauteur visuelle standardisée pour header/footer (pilote le padding vertical).
 * - sm | md | lg
 */
export const HeaderFooterHeightSchema = z.enum(HEADER_FOOTER_HEIGHTS);

/**
 * Largeur de conteneur interne (contrôle la max-width).
 * - full | xl | 2xl
 */
export const ContainerWidthSchema = z.enum(CONTAINERS);

/** Helper de confort pour les gardes de type. */
export function isAbsoluteHttpUrl(v: unknown): v is AbsoluteHttpUrl {
  return AbsoluteHttpUrlSchema.safeParse(v).success;
}

export function isRelativeUrl(v: unknown): v is RelativeUrl {
  return RelativeUrlSchema.safeParse(v).success;
}
