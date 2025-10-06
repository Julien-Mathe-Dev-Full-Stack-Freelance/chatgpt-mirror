/**
 * @file src/core/domain/site/validators/social.ts
 * @intro Invariants métier — Social (SoT)
 * @layer core/domain
 */

import { isAbsoluteHttpUrlStrict } from "@/core/domain/constants/web";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type {
  SocialItem,
  SocialSettings,
} from "@/core/domain/site/entities/social";
import { SOCIAL_KIND_EMAIL } from "@/core/domain/site/social/constants";
import { isMailtoHref } from "@/core/domain/urls/tools";

/** Invariants pour un item. Jette DomainError si non conforme. */
function assertSocialItem(it: SocialItem): void {
  const { kind, href } = it;

  if (kind === SOCIAL_KIND_EMAIL) {
    // email -> mailto: obligatoire
    if (!isMailtoHref(href)) {
      throw new DomainError({
        code: ERROR_CODES.SOCIAL_INVALID_FOR_PLATFORM,
        message: `Social "${kind}" expects a mailto: href.`,
        details: { kind, path: ["social", kind, "href"], value: href },
      });
    }
    return;
  }

  // Non-email -> jamais mailto:
  if (isMailtoHref(href)) {
    throw new DomainError({
      code: ERROR_CODES.SOCIAL_INVALID_FOR_PLATFORM,
      message: `Social "${kind}" must not use mailto:.`,
      details: { kind, path: ["social", kind, "href"], value: href },
    });
  }

  // autres kinds : http(s) absolu obligatoire
  if (!isAbsoluteHttpUrlStrict(href)) {
    throw new DomainError({
      code: ERROR_CODES.SOCIAL_ABSOLUTE_REQUIRED,
      message: `Social "${kind}" must be an absolute http(s) URL.`,
      details: { kind, path: ["social", kind, "href"], value: href },
    });
  }
}

/** Invariants globaux (unicité + items valides). */
export function assertSocialSettings(s: SocialSettings): void {
  const seen = new Set<string>();
  for (const it of s.items) {
    if (seen.has(it.kind)) {
      throw new DomainError({
        code: ERROR_CODES.SOCIAL_DUPLICATE_KIND,
        message: `Duplicate social kind: "${it.kind}".`,
        details: { kind: it.kind, path: ["social", it.kind] },
      });
    }
    seen.add(it.kind);

    assertSocialItem(it);
  }
}
