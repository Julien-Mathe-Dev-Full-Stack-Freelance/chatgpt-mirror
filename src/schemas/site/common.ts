/**
 * @file src/schemas/site/common.ts
 * @intro Schémas Zod partagés (états, URLs d’assets, tailles UI).
 * @description
 * Valeurs communes entre les schémas de configuration du site.
 * Valident uniquement la forme ; la normalisation reste côté use-cases/adapters.
 * @layer schemas
 */

import {
  CONTAINERS,
  HEADER_FOOTER_HEIGHTS,
} from "@/core/domain/constants/theme";
import { defaultT } from "@/i18n/default";
import { z } from "zod";

const t = defaultT;

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
