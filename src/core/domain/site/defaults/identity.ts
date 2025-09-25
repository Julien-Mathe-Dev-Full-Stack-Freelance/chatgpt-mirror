/**
 * @file src/core/domain/site/defaults/identity.ts
 * @intro Defaults — identité du site (titre, visuels)
 * @layer domain/defaults
 * @remarks
 * - Domain-driven : pas de dépendance aux DTO. Les schémas/DTO vivent côté infra.
 * - Les bornes de taille viennent de `src/core/domain/constants/limits.ts`.
 * - Immutabilité runtime : `deepFreeze`.
 * - Helper standard : `withDefaults*`.
 */

import {
  IDENTITY_TITLE_MAX,
  IDENTITY_TITLE_MIN,
} from "@/core/domain/constants/limits";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type { IdentitySettings } from "@/core/domain/site/entities/identity";
import { deepFreeze } from "@/core/domain/utils/deep-freeze";

/** Defaults canoniques unitaires (réutilisables) */
export const DEFAULT_IDENTITY_TITLE = "Mon site" as const;

/** Default complet (gelé au runtime) */
export const DEFAULT_IDENTITY_SETTINGS: IdentitySettings = deepFreeze({
  title: DEFAULT_IDENTITY_TITLE,
  // logoUrl: undefined,
  // faviconUrl: undefined,
} satisfies IdentitySettings);

/* Dev-only : garde de parité avec les SoT (limits) */
if (process.env.NODE_ENV !== "production") {
  const len = DEFAULT_IDENTITY_SETTINGS.title.length;
  if (len < IDENTITY_TITLE_MIN || len > IDENTITY_TITLE_MAX) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message:
        `[defaults/identity] title length ${len} out of bounds (min=${IDENTITY_TITLE_MIN}, max=${IDENTITY_TITLE_MAX})`,
    });
  }
}
