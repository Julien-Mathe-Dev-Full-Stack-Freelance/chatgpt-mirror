/**
 * @file src/core/domain/site/defaults/header.ts
 * @intro Defaults — header (sticky, blur, height, container)
 * @layer domain/defaults
 * @remarks
 * - Domain-driven : types et valeurs proviennent des SoT `src/constants/shared/theme.ts`.
 * - AUCUNE dépendance aux DTO ici (les DTO vivent côté infra et mappent ⇄ domain).
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standard : `withDefaults*`.
 */

import {
  type ContainerKey,
  CONTAINERS,
  HEADER_FOOTER_HEIGHTS,
  type HeaderFooterHeight,
} from "@/core/domain/constants/theme";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";
import type { HeaderSettings } from "@/core/domain/site/entities/header";

/** Defaults canoniques (réutilisables individuellement). */
export const DEFAULT_HEADER_STICKY = false;
export const DEFAULT_HEADER_BLUR = false;
export const DEFAULT_HEADER_HEIGHT: HeaderFooterHeight = "medium" as const;
export const DEFAULT_HEADER_CONTAINER: ContainerKey = "normal" as const;

/** Default complet (gelé au runtime). */
export const DEFAULT_HEADER_SETTINGS: HeaderSettings = deepFreeze({
  sticky: DEFAULT_HEADER_STICKY,
  blur: DEFAULT_HEADER_BLUR,
  height: DEFAULT_HEADER_HEIGHT,
  container: DEFAULT_HEADER_CONTAINER,
} satisfies HeaderSettings);

/* Dev-only: garde de parité avec les SoT si les tuples évoluent. */
if (process.env.NODE_ENV !== "production") {
  const inSet = (v: string, set: readonly string[]) => set.includes(v);
  if (!inSet(DEFAULT_HEADER_HEIGHT, HEADER_FOOTER_HEIGHTS as readonly string[])) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/header] height inconnu: ${DEFAULT_HEADER_HEIGHT}`,
    });
  }
  if (!inSet(DEFAULT_HEADER_CONTAINER, CONTAINERS as readonly string[])) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/header] container inconnu: ${DEFAULT_HEADER_CONTAINER}`,
    });
  }
}
