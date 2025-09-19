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
  SECTION_ALIGN_X,
  SECTION_MAX_WIDTHS,
  SECTION_SPACING_Y,
  type SectionAlignX,
  type SectionMaxWidth,
  type SectionSpacingY,
} from "@/core/domain/constants/layout";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Shape minimale d’un layout de page. */
export type PageLayout = Readonly<{
  maxWidth: SectionMaxWidth;
  spacingY: SectionSpacingY;
  align: SectionAlignX;
}>;

/** Defaults canoniques (réutilisables individuellement). */
export const DEFAULT_PAGE_MAX_WIDTH: SectionMaxWidth = "normal";
export const DEFAULT_PAGE_SPACING_Y: SectionSpacingY = "medium";
export const DEFAULT_PAGE_ALIGN_X: SectionAlignX = "start";

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

  if (!inSet(DEFAULT_PAGE_MAX_WIDTH, SECTION_MAX_WIDTHS)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults] maxWidth inconnu: ${DEFAULT_PAGE_MAX_WIDTH}`,
    });
  }

  if (!inSet(DEFAULT_PAGE_SPACING_Y, SECTION_SPACING_Y)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults] spacingY inconnu: ${DEFAULT_PAGE_SPACING_Y}`,
    });
  }

  if (!inSet(DEFAULT_PAGE_ALIGN_X, SECTION_ALIGN_X)) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: `[defaults] align inconnu: ${DEFAULT_PAGE_ALIGN_X}`,
    });
  }
}
