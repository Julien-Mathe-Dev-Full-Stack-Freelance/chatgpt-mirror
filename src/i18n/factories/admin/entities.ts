/**
 * @file src/i18n/factories/admin/entities.ts
 * @intro i18n — factories admin (entités)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-factories.md
 */

import type { TFunc } from "@/i18n";
import { makeLabeledOptions, asI18nKey, type LabeledOption } from "./options";
import {
  ENTITY_KINDS,
  type EntityKind,
} from "@/core/domain/entities/constants";

/** Label i18n pour une entité (fortement typé). */
export function entityLabel(t: TFunc, kind: EntityKind): string {
  return t(asI18nKey("admin.entities", kind));
}

/** Options typées pour <Select> etc. */
export function makeEntityKindOptions(
  t: TFunc
): ReadonlyArray<LabeledOption<EntityKind>> {
  return makeLabeledOptions(t, "admin.entities", ENTITY_KINDS);
}
