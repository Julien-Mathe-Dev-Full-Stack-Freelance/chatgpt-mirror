/**
 * @file src/schemas/site/publish/publish.ts
 * @intro Schéma Zod du résultat de la publication (“publish site”).
 * @description
 * Source de vérité pour la **réponse** de POST /api/admin/site/publish.
 * Garantit la forme des données renvoyées après l’opération de copie/synchronisation.
 * @remarks
 * - `.strict()` est déjà appliqué : toute propriété inconnue est rejetée.
 * @layer schemas
 */

import {
  MIN_PAGES_COPIED,
  PUBLISH_WARNING_MAX,
  PUBLISH_WARNING_MIN,
} from "@/core/domain/constants/limits";
import { nonEmptyTrimmedString } from "@/schemas/builders";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { z } from "zod";

/**
 * Résultat de l’opération de publication.
 * - `pagesCopied`    : nombre de pages copiées du `from` vers `to` (≥ 0).
 * - `settingsCopied` : indique si les réglages (header/footer/menu/identity/…) ont été copiés.
 * - `warnings`       : messages non bloquants (ex. éléments ignorés), pour information.
 * - `from` / `to`    : états logiques de source et de destination (ex. draft → published).
 */
export const PublishSiteResultSchema = z
  .object({
    /** Nombre de pages copiées pendant la publication (entier ≥ 0). */
    pagesCopied: z.number().int().min(MIN_PAGES_COPIED),
    /** Indique si les réglages du site ont été copiés. */
    settingsCopied: z.boolean(),
    /** Liste de messages d’avertissement (non bloquants). */
    warnings: z.array(
      nonEmptyTrimmedString(PUBLISH_WARNING_MIN, PUBLISH_WARNING_MAX, {
        tooShort: "validation.title.required",
        tooLong: "validation.text.tooLong",
      })
    ),
    /** Espace logique source (ex. "draft"). */
    from: ContentStateSchema,
    /** Espace logique cible (ex. "published"). */
    to: ContentStateSchema,
  })
  .strict();

/** DTO de réponse pour la publication. */
