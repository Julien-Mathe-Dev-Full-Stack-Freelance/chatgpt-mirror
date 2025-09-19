/**
 * @file src/core/domain/site/defaults/site-settings.ts
 * @intro Defaults pour les réglages du site (source unique de vérité côté frontière)
 */

import { DEFAULT_ADMIN_SETTINGS } from "@/core/domain/site/defaults/admin";
import { DEFAULT_FOOTER_SETTINGS } from "@/core/domain/site/defaults/footer";
import { DEFAULT_HEADER_SETTINGS } from "@/core/domain/site/defaults/header";
import { DEFAULT_IDENTITY_SETTINGS } from "@/core/domain/site/defaults/identity";
import { DEFAULT_LEGAL_MENU_SETTINGS } from "@/core/domain/site/defaults/legal-menu";
import { DEFAULT_PRIMARY_MENU_SETTINGS } from "@/core/domain/site/defaults/primary-menu";
import { DEFAULT_SEO_SETTINGS } from "@/core/domain/site/defaults/seo";
import { DEFAULT_SOCIAL_SETTINGS } from "@/core/domain/site/defaults/social";
import { DEFAULT_THEME_SETTINGS } from "@/core/domain/site/defaults/theme";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

export const DEFAULT_SITE_SETTINGS: SiteSettings = deepFreeze({
  header: DEFAULT_HEADER_SETTINGS,
  footer: DEFAULT_FOOTER_SETTINGS,
  primaryMenu: DEFAULT_PRIMARY_MENU_SETTINGS,
  legalMenu: DEFAULT_LEGAL_MENU_SETTINGS,
  social: DEFAULT_SOCIAL_SETTINGS,
  identity: DEFAULT_IDENTITY_SETTINGS,
  seo: DEFAULT_SEO_SETTINGS,
  theme: DEFAULT_THEME_SETTINGS,
  admin: DEFAULT_ADMIN_SETTINGS,
} satisfies SiteSettings);
