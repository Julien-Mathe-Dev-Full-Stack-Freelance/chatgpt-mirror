/**
 * @file src/i18n/factories/admin/seo.ts (WIP)
 * @intro i18n — factories admin (SEO)
 */

import type { TFunc } from "@/i18n";
import {
  TWITTER_CARD_TYPES,
  type TwitterCardType,
} from "@/core/domain/site/seo/constants";
import { makeLabeledOptions, type LabeledOption } from "./options";

export function makeTwitterCardOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<TwitterCardType>> {
  // clés i18n: "admin.seo.twitterCardType.summary", "admin.seo.twitterCardType.summary_large_image"
  return makeLabeledOptions(t, "admin.seo.twitterCardType", TWITTER_CARD_TYPES);
}
