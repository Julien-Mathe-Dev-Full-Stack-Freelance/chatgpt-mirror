/**
 * @file src/core/domain/site/defaults/footer.ts
 * @intro Defaults — footer (conteneur, logo, copyright)
 * @layer domain/defaults
 * @remarks
 * - Domaine des valeurs : `CONTAINERS` (src/constants/shared/theme.ts)
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standard : `withDefaults*`.
 */

import type {
  ContainerKey,
  HeaderFooterHeight,
} from "@/core/domain/constants/theme";
import {
  CONTAINERS,
  HEADER_FOOTER_HEIGHTS,
} from "@/core/domain/constants/theme";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";
import type { FooterSettings } from "@/core/domain/site/entities/footer";

/** Defaults canoniques (réutilisables individuellement). */
export const DEFAULT_FOOTER_HEIGHT: HeaderFooterHeight = "medium" as const;
export const DEFAULT_FOOTER_CONTAINER: ContainerKey = "normal" as const;

/** Default complet (gelé au runtime). */
export const DEFAULT_FOOTER_SETTINGS: FooterSettings = deepFreeze({
  height: DEFAULT_FOOTER_HEIGHT,
  container: DEFAULT_FOOTER_CONTAINER,
} satisfies FooterSettings);

/* Dev-only: garde de parité (évolutions des tuples) */
if (process.env.NODE_ENV !== "production") {
  const inSet = (v: string, set: readonly string[]) => set.includes(v);
  if (!inSet(DEFAULT_FOOTER_CONTAINER, CONTAINERS as readonly string[])) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/footer] container inconnu: ${DEFAULT_FOOTER_CONTAINER}`,
    });
  }
  if (
    !inSet(DEFAULT_FOOTER_HEIGHT, HEADER_FOOTER_HEIGHTS as readonly string[])
  ) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults/footer] height inconnu: ${DEFAULT_FOOTER_HEIGHT}`,
    });
  }
}
