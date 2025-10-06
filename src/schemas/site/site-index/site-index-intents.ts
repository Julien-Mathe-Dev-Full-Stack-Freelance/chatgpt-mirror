/**
 * @file src/schemas/site/site-index-intents.ts
 * @intro Schémas Zod des intentions API pour l’index du site
 * @description
 * - Union discriminée par `type`: "ensurePageListed" | "removeBySlug"
 * - `state?` au même niveau que dans les autres intents (Create/Update/Delete Page)
 * - `position?` pour allow "append" / "prepend" / {beforeId} / {afterId}
 * @layer schemas
 */

import { PageIdTools } from "@/core/domain/ids/tools";
import { SlugSchema } from "@/schemas/pages/page";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { SiteIndexPageRefSchema } from "@/schemas/site/site-index/site-index";
import { z } from "zod";

/** Discriminants des actions (cf. SoT domaine) */
export const SiteIndexActionTypeSchema = z.enum([
  "ensurePageListed",
  "removeBySlug",
]);
export type SiteIndexActionTypeIntentDTO = z.infer<
  typeof SiteIndexActionTypeSchema
>;

/** Validation d'ID de page (alignée sur le toolkit) */
const PAGE_ID_REGEX = new RegExp(
  `^${PageIdTools.prefix}[A-Za-z0-9_-]{${PageIdTools.size}}$`
);
const PageIdSchema = z.string().regex(PAGE_ID_REGEX);

/** Position: "append" | "prepend" | { beforeId } | { afterId } */
export const PositionSpecifierSchema = z.union([
  z.literal("append"),
  z.literal("prepend"),
  z.object({ beforeId: PageIdSchema }).strict(),
  z.object({ afterId: PageIdSchema }).strict(),
]);

/** Intent: ensurePageListed */
export const EnsurePageListedIntentSchema = z
  .object({
    type: z.literal("ensurePageListed"),
    ref: SiteIndexPageRefSchema, // { id, slug, title }
    position: PositionSpecifierSchema.optional(),
    state: ContentStateSchema.optional(),
  })
  .strict();

/** Intent: removeBySlug */
export const RemoveBySlugIntentSchema = z
  .object({
    type: z.literal("removeBySlug"),
    slug: SlugSchema,
    state: ContentStateSchema.optional(),
  })
  .strict();

/** Union discriminée des intents */
export const UpdateSiteIndexIntentSchema = z.discriminatedUnion("type", [
  EnsurePageListedIntentSchema,
  RemoveBySlugIntentSchema,
]);

/** DTOs d’intentions */
export type EnsurePageListedIntentDTO = z.input<
  typeof EnsurePageListedIntentSchema
>;

export type RemoveBySlugIntentDTO = z.input<typeof RemoveBySlugIntentSchema>;

export type UpdateSiteIndexIntentDTO = z.input<
  typeof UpdateSiteIndexIntentSchema
>;
