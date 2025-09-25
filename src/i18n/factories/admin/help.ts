/**
 * @file src/i18n/factories/admin/help.ts
 * @intro i18n — factories admin (help)
 */

import type { TFunc } from "@/i18n";
import {
  SEO_TITLE_MAX,
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_TEMPLATE_MIN,
  SEO_TITLE_TEMPLATE_MAX,
  MENU_ITEM_MAX,
} from "@/core/domain/constants/limits";

export function makeSeoHelpTexts(t: TFunc) {
  return {
    titleMax: t("admin.seo.help.titleMax", { max: SEO_TITLE_MAX }),
    descriptionMax: t("admin.seo.help.descriptionMax", {
      max: SEO_DESCRIPTION_MAX,
    }),
    templateRange: t("admin.seo.help.templateRange", {
      min: SEO_TITLE_TEMPLATE_MIN,
      max: SEO_TITLE_TEMPLATE_MAX,
    }),
  } as const;
}

export function makeMenuHelpTexts(t: TFunc) {
  return {
    maxItems: t("admin.menu.help.maxItems", { max: MENU_ITEM_MAX }),
  } as const;
}
