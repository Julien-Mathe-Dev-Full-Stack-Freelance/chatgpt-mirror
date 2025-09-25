/**
 * @file src/core/domain/page/validators/slugs.ts
 * @intro Slug de page — erreurs métier (bloquantes) + warnings UI (non bloquants)
 * @layer domain/validators
 */

import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type {
  BlockingIssue,
  UiWarning,
} from "@/core/domain/errors/issue-types";
import { SLUG_FINAL_RE } from "@/core/domain/slug/constants";
import { isReservedSlug, normalizeSlug } from "@/core/domain/slug/utils";

/** Erreur “dure” (bloquante) — utilise les ErrorCode du domaine. */
export type SlugErrorIssue = BlockingIssue;

/** Warnings UI (non bloquants) — codes locaux (pas dans ERROR_CODES). */
export type SlugWarning = UiWarning<"SLUG_NORMALIZED_DIFFERENT">;

/**
 * Valide un slug “raw” et retourne les **erreurs bloquantes**.
 * - Ne renvoie PAS de warnings.
 */
export function validatePageSlugErrors(
  raw: string | undefined,
  path: (string | number)[] = ["slug"]
): SlugErrorIssue[] {
  const issues: SlugErrorIssue[] = [];
  const normalized = normalizeSlug(raw ?? "");

  if (!normalized) {
    issues.push({
      code: EC.PAGE_SLUG_REQUIRED,
      path,
      meta: { reason: "emptyAfterNormalization" },
    });
    return issues;
  }

  if (!SLUG_FINAL_RE.test(normalized)) {
    issues.push({
      code: EC.PAGE_SLUG_INVALID_FORMAT,
      path,
      meta: { normalized },
    });
    return issues;
  }

  if (isReservedSlug(normalized)) {
    issues.push({
      code: EC.PAGE_SLUG_RESERVED,
      path,
      meta: { normalized },
    });
    return issues;
  }

  return issues;
}

/**
 * Détecte les **warnings UI** (non bloquants) liés au slug.
 * - Aujourd’hui : “différent après normalisation” (utile pour proposer un autocorrect).
 */
export function findPageSlugWarnings(
  raw: string | undefined,
  path: (string | number)[] = ["slug"]
): SlugWarning[] {
  const out: SlugWarning[] = [];
  const normalized = normalizeSlug(raw ?? "");
  if (raw && normalized && raw !== normalized) {
    out.push({
      code: "SLUG_NORMALIZED_DIFFERENT",
      path,
      meta: { normalized },
    });
  }
  return out;
}
