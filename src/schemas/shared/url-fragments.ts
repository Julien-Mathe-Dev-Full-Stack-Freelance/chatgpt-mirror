/**
 * @file src/schemas/shared/url-fragments.ts
 * @intro Schémas de validation des fragments d’URL.
 */

import { MAX_URL_LENGTH } from "@/constants/shared/limits";
import { isAbsoluteHttpProtocol, isRelativeUrl } from "@/constants/shared/web";
import { defaultT } from "@/i18n/default";
import { z } from "zod";

const t = defaultT;

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
  .brand<"AbsHttpUrlString">();

export const RelativeUrlSchema = z
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
  .refine((s) => isRelativeUrl(s), {
    message: t("validation.url.relative.invalid"), // ⚠️ nouvelle clé i18n
  })
  .brand<"RelUrlString">();

export const AssetUrlSchema = z.union([
  AbsoluteHttpUrlSchema,
  RelativeUrlSchema,
]);
export type AssetUrlInput = z.input<typeof AssetUrlSchema>;
