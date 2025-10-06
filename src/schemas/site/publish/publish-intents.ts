/**
 * @file src/schemas/site/publish/publish-intents.ts
 * @intro Schéma Zod de l’intention API pour la publication du site.
 * @description
 * - Frontière API : valide la **forme** du body POST /api/admin/site/publish.
 * - `from` / `to` sont optionnels ; leurs valeurs par défaut sont gérées au niveau route/use-case.
 * - `cleanOrphans` est ignoré en MVP.
 * @remarks
 * - Les propriétés inconnues sont déjà rejetées (`.strict()` via `z.object(...).strict()`).
 * @layer schemas
 */

import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { z } from "zod";

/** Intention POST pour publier le site. */
export const PublishSiteIntentSchema = z
  .object({
    from: ContentStateSchema.optional(), // défaut: "draft" (dans la route/use-case)
    to: ContentStateSchema.optional(), // défaut: "published" (dans la route/use-case)
    cleanOrphans: z.boolean().optional(), // ignoré en MVP
  })
  .strict();

/** DTO d’intention (côté API). */
