/**
 * @file src/core/domain/pages/defaults/page.ts
 * @intro Defaults — layout de page
 * @layer domain/defaults
 * @remarks
 * - Les valeurs proviennent de la SoT layout : `src/constants/shared/layout.ts`
 *   (cf. docs/bible/domain/constants-layout.md).
 * - Typage strict via les unions (pas de littéraux “hors domaine”).
 * - Immutabilité **runtime** : `deepFreeze`.
 */

import {
  H_ALIGNMENT_VALUES,
  V_ALIGNMENT_VALUES,
  type HorizontalAlignment,
  type SpacingStep,
} from "@/core/domain/constants/layout";
import {
  CONTAINER_VALUES,
  type ContainerKey,
} from "@/core/domain/constants/theme";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Shape minimale d’un layout de page. */
export type PageLayout = Readonly<{
  maxWidth: ContainerKey;
  spacingY: SpacingStep;
  align: HorizontalAlignment;
}>;

/** Defaults canoniques (réutilisables individuellement). */
export const DEFAULT_PAGE_MAX_WIDTH: ContainerKey = "normal";
export const DEFAULT_PAGE_SPACING_Y: SpacingStep = "lg";
export const DEFAULT_PAGE_ALIGN_X: HorizontalAlignment = "start";

/** Default complet (gelé au runtime). */
export const DEFAULT_PAGE_LAYOUT: PageLayout = deepFreeze({
  maxWidth: DEFAULT_PAGE_MAX_WIDTH,
  spacingY: DEFAULT_PAGE_SPACING_Y,
  align: DEFAULT_PAGE_ALIGN_X,
});

/* Dev-only: garde de parité avec la SoT (utile si les tuples évoluent). */
if (process.env.NODE_ENV !== "production") {
  const inSet = <T extends string>(value: T, set: readonly string[]) =>
    set.includes(value);

  if (!inSet(DEFAULT_PAGE_MAX_WIDTH, CONTAINER_VALUES)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults] maxWidth inconnu: ${DEFAULT_PAGE_MAX_WIDTH}`,
    });
  }

  if (!inSet(DEFAULT_PAGE_SPACING_Y, H_ALIGNMENT_VALUES)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults] spacingY inconnu: ${DEFAULT_PAGE_SPACING_Y}`,
    });
  }

  if (!inSet(DEFAULT_PAGE_ALIGN_X, V_ALIGNMENT_VALUES)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults] align inconnu: ${DEFAULT_PAGE_ALIGN_X}`,
    });
  }
}
