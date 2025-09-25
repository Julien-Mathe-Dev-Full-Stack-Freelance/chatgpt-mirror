/**
 * @file src/i18n/factories/admin/social.ts
 * @intro i18n — factories admin (réseaux sociaux)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-factories.md
 */

import type { SocialKind } from "@/core/domain/site/social/constants";
import { SOCIAL_KINDS } from "@/core/domain/site/social/constants";
import type { TFunc } from "@/i18n";
import { makeLabeledOptions, type LabeledOption } from "./options";

/** Options typées pour SocialKind (labels i18n). */
export function makeSocialKindOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<SocialKind>> {
  return makeLabeledOptions(t, "admin.social.kind", SOCIAL_KINDS);
}
