/**
 * @file src/i18n/factories/admin/tabs.ts
 * @intro i18n — factories admin (onglets)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-factories.md
 */

import type { TFunc } from "@/i18n";
import type { LabeledOption } from "./options";
import { makeLabeledOptions } from "./options";

export const ADMIN_TABS = [
  "overview",
  "identity",
  "menu",
  "social",
  "header",
  "footer",
  "pages",
  "blocks",
  "seo",
] as const;
export type AdminTab = (typeof ADMIN_TABS)[number];

/** Options d’onglets admin `{ value: AdminTab, label }`. */
export function makeTabsOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<AdminTab>> {
  return makeLabeledOptions(t, "admin.tabs", ADMIN_TABS);
}
