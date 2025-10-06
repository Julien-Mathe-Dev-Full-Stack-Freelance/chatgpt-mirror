/**
 * @file src/core/domain/site/validators/identity.ts
 * @intro Invariants métier — Identity (SoT)
 * @layer core/domain
 * @description
 * Valide les règles *bloquantes* pour l’Identity lors de la publication.
 * - title : non vide (trim)
 * - logoAlt : non vide (trim)
 *
 * Lève DomainError en cas d’incohérence.
 */

import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type { IdentitySettings } from "@/core/domain/site/entities/identity";

/** Invariants pour Identity. Jette DomainError si non conforme. */
export function assertIdentitySettings(identity: IdentitySettings): void {
  const title = identity.title?.trim() ?? "";
  if (title.length === 0) {
    throw new DomainError({
      code: ERROR_CODES.IDENTITY_TITLE_REQUIRED,
      message: `Identity.title is required to publish the site.`,
      details: { path: ["identity", "title"] },
    });
  }

  const logoAlt = identity.logoAlt?.trim() ?? "";
  if (logoAlt.length === 0) {
    throw new DomainError({
      code: ERROR_CODES.IDENTITY_LOGO_ALT_REQUIRED,
      message: `Identity.logoAlt is required to publish the site.`,
      details: { path: ["identity", "logoAlt"] },
    });
  }
}
