import type { EntityKind } from "@/core/domain/entities/constants";
import {
  MESSAGES,
  DEFAULT_LOCALE,
  createTSafe,
  type TFunc,
} from "@/i18n";
import { entityLabel as entityLabelFactory } from "@/i18n/factories/admin/entities";

const tDefault: TFunc = createTSafe(
  MESSAGES[DEFAULT_LOCALE],
  MESSAGES[DEFAULT_LOCALE]
);

export function entityLabel(
  key: EntityKind,
  t: TFunc = tDefault
): string {
  return entityLabelFactory(t, key);
}
