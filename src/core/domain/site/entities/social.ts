/**
 * @file src/core/domain/site/entities/social.ts
 * @intro DTO de réglages des réseaux sociaux (liste ordonnée d’items)
 */

import type { SocialKind } from "@/core/domain/site/social/constants";
import type { BrandedHref } from "@/core/domain/urls/tools";

export interface SocialItem {
  kind: SocialKind;
  href: BrandedHref;
}

export interface SocialSettings {
  items: ReadonlyArray<SocialItem>;
}
