/**
 * @file src/app/api/admin/_adapters/pages.ts
 * @intro Adapters API → Domaine pour Pages (create/update payloads)
 * @layer api/adapters
 *
 * Règles :
 * - Ne retourne PAS `state` (géré par la route, comme pour les settings).
 * - Trim des strings (title/slug).
 * - Laisse `sitemap` tel quel (déjà validé en forme par Zod ; defaults = domaine).
 */

import type {
  CreatePageIntentDTO,
  UpdatePageIntentDTO,
} from "@/schemas/pages/page-intents";

export function adaptCreatePagePayload(dto: CreatePageIntentDTO) {
  const out: {
    title: string;
    slug?: string;
    sitemap?: NonNullable<CreatePageIntentDTO["sitemap"]>;
  } = {
    title: dto.title.trim(),
  };

  if (typeof dto.slug === "string") out.slug = dto.slug.trim();
  if (dto.sitemap) out.sitemap = dto.sitemap;

  return out;
}

export function adaptUpdatePagePayload(dto: UpdatePageIntentDTO) {
  const out: {
    title?: string;
    slug?: string;
    sitemap?: NonNullable<UpdatePageIntentDTO["sitemap"]>;
  } = {};

  if (typeof dto.title === "string") out.title = dto.title.trim();
  if (typeof dto.slug === "string") out.slug = dto.slug.trim();
  if (dto.sitemap) out.sitemap = dto.sitemap;

  return out;
}
