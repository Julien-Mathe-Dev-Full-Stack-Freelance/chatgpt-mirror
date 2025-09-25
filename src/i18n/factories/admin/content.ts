/**
 * @file src/i18n/factories/admin/content.ts
 * @intro i18n — factories admin (états de contenu)
 * @layer i18n/core
 */
import type { TFunc } from "@/i18n";
import {
  CONTENT_STATES,
  type ContentState,
} from "@/core/domain/constants/common";
import { asI18nKey, makeLabeledOptions, type LabeledOption } from "./options";

/** Label i18n d’un état de contenu. */
export function contentStateLabel(t: TFunc, state: ContentState): string {
  return t(asI18nKey("admin.content.state", state));
}

/** Options typées pour un select/badge. */
export function makeContentStateOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<ContentState>> {
  return makeLabeledOptions(t, "admin.content.state", CONTENT_STATES);
}
