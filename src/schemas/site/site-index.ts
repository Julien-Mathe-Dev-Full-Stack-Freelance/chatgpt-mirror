/**
 * @file src/schemas/site/site-index.ts
 * @intro Schéma Zod pour l’entité SiteIndex (ordre de navigation).
 * @description
 * - Valide la structure JSON représentant l’index du site.
 * - Sécurise lecture/écriture côté persistance (FS, DB…).
 * - Garantit que chaque page référencée a bien un id, un slug et un titre.
 * @remarks
 * - Frontière de **forme** uniquement : les invariants transverses (unicité id/slug,
 *   existence réelle des pages dans le même état draft/published) sont vérifiés côté
 *   use-cases/repository.
 * - Les objets sont déjà `.strict()` : toute propriété inconnue est rejetée par défaut.
 * - L’ordre de `pages[]` est significatif et sert de source de vérité pour la navigation.
 * @layer schemas
 */

import {
  PAGE_TITLE_MAX,
  PAGE_TITLE_MIN,
} from "@/core/domain/constants/limits";
import { PageIdTools } from "@/core/domain/ids/tools";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { SlugSchema } from "@/schemas/pages/page";
import { defaultT } from "@/i18n/default";
import { IsoDateStringSchema } from "@/schemas/date";
import { z } from "zod";

const t = defaultT;

const PAGE_ID_REGEX = new RegExp(
  `^${PageIdTools.prefix}[A-Za-z0-9_-]{${PageIdTools.size}}$`
);
/**
 * Référence minimale à une page dans l’index.
 * Correspond à un sous-ensemble de `Page` (id, slug, title).
 */
export const SiteIndexPageRefSchema = z
  .object({
    /** Identifiant technique de la page (ex: nanoid). */
    id: z
      .string()
      .trim()
      .refine((value) => PAGE_ID_REGEX.test(value), {
        message: t("validation.id.invalid"),
      }),
    /** Slug validé et cohérent avec le schéma `Page`. */
    slug: SlugSchema, // DRY : réutilise la même validation que pour Page
    /** Titre humain lisible affiché dans la navigation. */
    title: nonEmptyTrimmedString(PAGE_TITLE_MIN, PAGE_TITLE_MAX, {
      tooShort: "validation.title.required",
      tooLong: "validation.text.tooLong",
    }),
  })
  .strict();

/**
 * Schéma complet pour l’index du site.
 * - `title` : nom global du site.
 * - `pages` : liste ordonnée des pages (l’ordre fait foi pour la nav).
 */
export const SiteIndexSchema = z
  .object({
    /** Références de pages dans l’ordre souhaité pour la navigation. */
    pages: z.array(SiteIndexPageRefSchema),
    /** Timestamp ISO de mise à jour. */
    updatedAt: IsoDateStringSchema,
  })
  .strict();
