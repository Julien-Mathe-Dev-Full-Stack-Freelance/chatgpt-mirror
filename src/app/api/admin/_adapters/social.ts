/**
 * @file src/app/api/admin/_adapters/social.ts
 * @intro Adapter API → Domaine pour Social settings
 * @layer api/adapters
 */

import type {
  SocialItem,
  SocialSettings,
} from "@/core/domain/site/entities/social";
import { asBrandedHref } from "@/core/domain/urls/tools";
import type { UpdateSocialSettingsPatchDTO } from "@/schemas/site/social/social-intents";

/** Adaptation d’un item social (DTO → domaine) */
function adaptSocialItem(dto: {
  kind: SocialItem["kind"];
  href: string;
}): SocialItem {
  return {
    kind: dto.kind,
    href: asBrandedHref(dto.href),
  };
}

/** Adaptation patch Social (DTO → Partial<Domaine>) */
export function adaptUpdateSocialPatch(
  dto: UpdateSocialSettingsPatchDTO
): Partial<SocialSettings> {
  const out: Partial<SocialSettings> = {};
  if (Array.isArray(dto.items)) {
    out.items = dto.items.map(adaptSocialItem);
  }
  return out;
}
