/**
 * @file src/i18n/factories/admin/actions.ts
 * @intro i18n — factories admin (actions)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-factories.md
 */

import type { TFunc } from "@/i18n";
import { makeLabeledOptions, type LabeledOption } from "@/i18n/factories/admin";

export const ADMIN_ACTIONS = ["submit", "saving", "reset", "add"] as const;
export type AdminAction = (typeof ADMIN_ACTIONS)[number];

export function makeActionOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<AdminAction>> {
  return makeLabeledOptions(t, "admin.actions", ADMIN_ACTIONS);
}
