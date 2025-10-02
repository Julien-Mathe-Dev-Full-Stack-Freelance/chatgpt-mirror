/**
 * @file src/i18n/factories/admin/seo.ts
 * @intro i18n — factories admin (seo)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-factories.md
 */
import {
  TWITTER_CARD_TYPES,
  type TwitterCardType,
} from "@/core/domain/site/seo/constants";
import type { TFunc } from "@/i18n";
import { makeLabeledOptions, type LabeledOption } from "./options";

export type SerpPreviewTexts = {
  heading: string;
  placeholderTitle: string;
  placeholderDescription: string;
};

export function makeSerpPreviewTexts(t: TFunc): SerpPreviewTexts {
  return {
    heading: t("admin.seo.preview.heading"),
    placeholderTitle: t("admin.seo.preview.placeholder.title"),
    placeholderDescription: t("admin.seo.preview.placeholder.description"),
  };
}

/** Options de type de carte Twitter (summary / summary_large_image). */
export function makeTwitterCardTypeOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<TwitterCardType>> {
  return makeLabeledOptions(t, "admin.seo.twitterCardType", TWITTER_CARD_TYPES);
}
