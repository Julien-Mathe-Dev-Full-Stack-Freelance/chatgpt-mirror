// src/core/domain/site/validators/identity.ts
/**
 * @file src/core/domain/site/validators/identity.ts
 * @intro Règle : titre requis si pas de logo (sur l’état final)
 * @layer domain/validators
 */

import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type { BlockingIssue } from "@/core/domain/errors/issue-types";
import type { IdentitySettings } from "@/core/domain/site/entities/identity";

/**
 * Valide la règle "titre requis si pas de logo" sur l'état **final**.
 * - Utilise l’**entité** IdentitySettings (champ `logo`, pas `logoUrl`).
 */
export function checkIdentityTitleRule(
  next: IdentitySettings
): ReadonlyArray<BlockingIssue> {
  const title = (next.title ?? "").trim();
  const hasLogo =
    typeof next.logoUrl === "string" && next.logoUrl.trim().length > 0;

  if (!hasLogo && title.length === 0) {
    return [
      {
        code: EC.IDENTITY_TITLE_REQUIRED_WHEN_NO_LOGO,
        path: ["title"],
      },
    ];
  }
  return [];
}
