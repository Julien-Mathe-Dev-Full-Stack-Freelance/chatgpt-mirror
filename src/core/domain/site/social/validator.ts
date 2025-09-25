// src/core/domain/site/validators/social.ts
/**
 * @file src/core/domain/site/validators/social.ts
 * @intro Social — erreurs bloquantes (href par kind) + contrat homogène
 * @layer domain/validators
 */

import {
  isAbsoluteHttpProtocol,
  isRelativeUrl,
} from "@/core/domain/constants/web";
import { ERROR_CODES as EC, type ErrorCode } from "@/core/domain/errors/codes";
import type { SocialSettings } from "@/core/domain/site/entities";
import { isMailtoHref } from "@/core/domain/urls/mailto";

// ⚠️ Si ces codes n'existent pas encore, ajoute-les à ERROR_CODES.
// - SOCIAL_INVALID_FOR_PLATFORM
// - SOCIAL_ABSOLUTE_REQUIRED
// - SOCIAL_INVALID_HREF

export type SocialIssue = {
  code: ErrorCode;
  path: (string | number)[];
  meta?: Record<string, unknown>;
};

function isHttpAbsolute(href: string): boolean {
  try {
    const u = new URL(href);
    return isAbsoluteHttpProtocol(u.protocol) && !!u.hostname;
  } catch {
    return false;
  }
}

/**
 * Politique :
 * - kind === "email"   -> mailto: obligatoire
 * - kind === "website" -> relatif OU http(s) absolu
 * - sinon               -> http(s) absolu obligatoire
 */
export function checkSocialRules(settings: SocialSettings): SocialIssue[] {
  const issues: SocialIssue[] = [];

  settings.items.forEach((it, idx) => {
    const href = String(it.href ?? "").trim();

    // Rien fourni -> on laisse cette règle à un autre validateur si besoin
    if (!href) return;

    if (it.kind === "email") {
      if (!isMailtoHref(href)) {
        issues.push({
          code: EC.SOCIAL_INVALID_FOR_PLATFORM, // "email" doit être mailto:
          path: ["items", idx, "href"],
          meta: { kind: it.kind, required: "mailto" },
        });
      }
      return;
    }

    if (it.kind === "website") {
      const isRel = isRelativeUrl(href);
      const isAbs = isHttpAbsolute(href);
      if (!isRel && !isAbs) {
        issues.push({
          code: EC.SOCIAL_INVALID_HREF, // ni relatif, ni http(s)
          path: ["items", idx, "href"],
          meta: { kind: it.kind, expected: "relative|http(s)" },
        });
      }
      return;
    }

    // Tous les autres kinds : http(s) absolu requis
    if (isMailtoHref(href)) {
      issues.push({
        code: EC.SOCIAL_INVALID_FOR_PLATFORM, // mailto interdit hors "email"
        path: ["items", idx, "href"],
        meta: { kind: it.kind, forbidden: "mailto" },
      });
      return;
    }
    if (!isHttpAbsolute(href)) {
      issues.push({
        code: EC.SOCIAL_ABSOLUTE_REQUIRED, // relatif interdit
        path: ["items", idx, "href"],
        meta: { kind: it.kind, required: "http(s)" },
      });
    }
  });

  return issues;
}
