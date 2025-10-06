/**
 * @file src/core/domain/urls/href.ts
 * @intro Hrefs typés (relative | http(s) absolu | mailto)
 * @layer domain/utils
 *
 * - Use-case/domaine → utilisez les fonctions strictes: rel/abs/mail/href.
 * - UI (formulaires) → coerceHrefUI (tolérant, ne jette pas).
 */

import {
  isAbsoluteHttpProtocol,
  isRelativeUrl,
} from "@/core/domain/constants/web";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import { isMailtoHref } from "@/core/domain/urls/mailto";

// Brands compatibles Zod (type-only)
type Brand<K extends string> = { readonly __brand: K };

type RelativeUrl = string & Brand<"RelativeUrl">;
type AbsoluteHttpUrl = string & Brand<"AbsoluteHttpUrl">;
type MailtoUrl = string & Brand<"MailtoUrl">;

export type AssetUrl = RelativeUrl | AbsoluteHttpUrl;

export type AssetUrlOrNull = AssetUrl | null;

export type BrandedHref = RelativeUrl | AbsoluteHttpUrl | MailtoUrl;

/** Relative strict (dev: jette si invalide) */
export function rel(s: string): RelativeUrl {
  if (process.env.NODE_ENV !== "production") {
    if (!isRelativeUrl(s)) {
      throw new DomainError({
        code: ERROR_CODES.INTERNAL,
        message: `Invalid RelativeUrl: ${s}`,
      });
    }
  }
  return s as RelativeUrl;
}

/** Absolu http(s) strict (dev: jette si invalide) */
export function abs(s: string): AbsoluteHttpUrl {
  if (process.env.NODE_ENV !== "production") {
    try {
      const u = new URL(s);
      if (!isAbsoluteHttpProtocol(u.protocol) || !u.hostname) {
        throw new DomainError({
          code: ERROR_CODES.INTERNAL,
          message: `Invalid AbsoluteHttpUrl: ${s}`,
        });
      }
    } catch (error) {
      throw new DomainError({
        code: ERROR_CODES.INTERNAL,
        message: `Invalid AbsoluteHttpUrl: ${s}`,
        cause: error,
      });
    }
  }
  return s as AbsoluteHttpUrl;
}

/** mailto: strict (dev: jette si invalide) */
function mail(s: string): MailtoUrl {
  if (process.env.NODE_ENV !== "production") {
    if (!isMailtoHref(s)) {
      throw new DomainError({
        code: ERROR_CODES.INTERNAL,
        message: `Invalid MailtoUrl: ${s}`,
      });
    }
  }
  return s as MailtoUrl;
}

/** Détecte et brande automatiquement. */
export function asBrandedHref(s: string): BrandedHref {
  const i = s.indexOf(":");
  if (i > 0) {
    const proto = s.slice(0, i + 1).toLowerCase();
    if (proto === "http:" || proto === "https:") return abs(s);
    if (proto === "mailto:") return mail(s);
  }
  return rel(s);
}

/** UI-friendly: tente de “brander” sans jeter ; sinon conserve la valeur précédente. */
function brandHrefSafe(
  input: unknown,
  prev?: BrandedHref
): BrandedHref | undefined {
  if (typeof input !== "string") return prev;
  const s = input.trim();
  if (!s) return prev;

  // Détecte le protocole s'il est présent
  const i = s.indexOf(":");
  if (i > 0) {
    const proto = s.slice(0, i + 1).toLowerCase();

    // mailto:
    if (proto === "mailto:") {
      return isMailtoHref(s) ? (mail(s) as BrandedHref) : prev;
    }

    // http(s):
    if (proto === "http:" || proto === "https:") {
      try {
        const u = new URL(s);
        if (isAbsoluteHttpProtocol(u.protocol) && !!u.hostname) {
          return abs(s);
        }
      } catch {
        // tombe sur prev
      }
      return prev;
    }
  }

  // Relatif (pas de protocole)
  return isRelativeUrl(s) ? (rel(s) as BrandedHref) : prev;
}

export function brandAssetUrlSafe(
  input: unknown,
  prev?: AssetUrl
): AssetUrl | undefined {
  const v = brandHrefSafe(input, prev);
  if (!v) return prev;
  if (isMailHref(v)) return prev;
  return v;
}

function isMailHref(href: BrandedHref): href is MailtoUrl {
  return href.startsWith("mailto:");
}

export function isAbsoluteAssetUrl(u: AssetUrl): u is AbsoluteHttpUrl {
  // À ce stade, `u` est déjà brandé correctement.
  return u.startsWith("http://") || u.startsWith("https://");
}

export function isRelativeAssetUrl(u: AssetUrl): u is RelativeUrl {
  return u.startsWith("/");
}
