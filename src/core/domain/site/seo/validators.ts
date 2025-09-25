/**
 * @file src/core/domain/site/seo/validators.ts
 * @intro Règles métier SEO (baseUrl valide, longueurs max).
 * @layer domain/validators
 */
import {
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  SEO_TITLE_TEMPLATE_MAX,
} from "@/core/domain/constants/limits";
import { isAbsoluteHttpProtocol } from "@/core/domain/constants/web";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type { BlockingIssue } from "@/core/domain/errors/issue-types";
import type { SeoSettings } from "@/core/domain/site/entities";
import { TITLE_PLACEHOLDER_RE } from "@/core/domain/site/seo/constants";

export type SeoIssue = BlockingIssue;

export function checkSeoRules(seo: SeoSettings): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const requireHttps = process.env.NODE_ENV === "production";

  // baseUrl: doit être http(s) absolu
  if (seo.baseUrl) {
    try {
      const u = new URL(seo.baseUrl);
      const okProto = requireHttps
        ? u.protocol === "https:"
        : isAbsoluteHttpProtocol(u.protocol);
      if (!okProto || !u.hostname) {
        issues.push({ code: EC.SEO_INVALID_BASE_URL, path: ["baseUrl"] });
      }
    } catch {
      issues.push({ code: EC.SEO_INVALID_BASE_URL, path: ["baseUrl"] });
    }
  }

  // Titres trop longs (si fournis)
  if (seo.defaultTitle && seo.defaultTitle.length > SEO_TITLE_MAX) {
    issues.push({ code: EC.SEO_TITLE_TOO_LONG, path: ["defaultTitle"] });
  }
  if (seo.titleTemplate && seo.titleTemplate.length > SEO_TITLE_TEMPLATE_MAX) {
    issues.push({
      code: EC.SEO_TITLE_TEMPLATE_TOO_LONG,
      path: ["titleTemplate"],
    });
  }

  // Title template : placeholder "%s" requis
  if (seo.titleTemplate && !TITLE_PLACEHOLDER_RE.test(seo.titleTemplate)) {
    issues.push({
      code: EC.SEO_TITLE_TEMPLATE_MISSING_PLACEHOLDER,
      path: ["titleTemplate"],
    });
  }

  // Description trop longue (si fournie)
  if (
    seo.defaultDescription &&
    seo.defaultDescription.length > SEO_DESCRIPTION_MAX
  ) {
    issues.push({
      code: EC.SEO_DESCRIPTION_TOO_LONG,
      path: ["defaultDescription"],
    });
  }

  return issues;
}
