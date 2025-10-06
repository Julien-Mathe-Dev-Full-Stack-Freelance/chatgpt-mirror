/**
 * @file src/core/domain/site/validators/seo.ts
 * @intro Invariants métier — SEO (SoT)
 * @layer core/domain
 * @description
 * Valide les règles *bloquantes* pour le SEO lors de la publication :
 * - defaultTitle : non vide
 * - titleTemplate : doit contenir "%s"
 * - baseUrl : si défini et en prod, doit être https
 *
 * Lève DomainError en cas d’incohérence.
 * Les recommandations (description courte, OG image manquante, robots etc.)
 * seront traitées en warnings côté UI ou logs.
 */

import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type { SeoSettings } from "@/core/domain/site/entities/seo";
import { TITLE_PLACEHOLDER } from "@/core/domain/site/seo/constants";

/** Invariants SEO. Jette DomainError si non conforme. */
export function assertSeoSettings(seo: SeoSettings): void {
  const defaultTitle = seo.defaultTitle?.trim() ?? "";
  if (defaultTitle.length === 0) {
    throw new DomainError({
      code: ERROR_CODES.SEO_TITLE_REQUIRED,
      message: `SEO.defaultTitle is required to publish the site.`,
      details: { path: ["seo", "defaultTitle"] },
    });
  }

  if (seo.titleTemplate) {
    if (!seo.titleTemplate.includes(TITLE_PLACEHOLDER)) {
      throw new DomainError({
        code: ERROR_CODES.SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER,
        message: `SEO.titleTemplate must contain "${TITLE_PLACEHOLDER}".`,
        details: { path: ["seo", "titleTemplate"] },
      });
    }
  }

  if (seo.baseUrl) {
    try {
      const u = new URL(seo.baseUrl);
      if (process.env.NODE_ENV === "production" && u.protocol !== "https:") {
        throw new DomainError({
          code: ERROR_CODES.SEO_BASEURL_HTTPS_REQUIRED,
          message: `SEO.baseUrl must use https in production.`,
          details: { path: ["seo", "baseUrl"], value: seo.baseUrl },
        });
      }
    } catch {
      throw new DomainError({
        code: ERROR_CODES.SEO_BASEURL_INVALID,
        message: `SEO.baseUrl is not a valid absolute URL.`,
        details: { path: ["seo", "baseUrl"], value: seo.baseUrl },
      });
    }
  }
}
