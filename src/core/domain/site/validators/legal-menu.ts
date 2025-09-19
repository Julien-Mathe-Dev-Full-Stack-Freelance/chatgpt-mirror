// src/core/domain/site/validators/legal-menu.ts
/**
 * @file src/core/domain/site/validators/legal-menu.ts
 * @intro Menu légal — erreurs bloquantes + warnings (doublons)
 * @layer domain/validators
 */

import { MENU_ITEM_MAX } from "@/core/domain/constants/limits";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type {
  BlockingIssue,
  UiWarning,
} from "@/core/domain/errors/issue-types";
import type { LegalMenuSettings } from "@/core/domain/site/entities";
import { hrefCompareKey, labelCompareKey } from "@/core/domain/urls/compare";

/** Warnings UI (non bloquants) — codes locaux (pas dans ERROR_CODES). */
export type LegalMenuWarning = UiWarning<"DUPLICATE_HREF" | "DUPLICATE_LABEL">;

export function findLegalMenuWarnings(
  items: ReadonlyArray<{ label: string; href: string }>
): ReadonlyArray<LegalMenuWarning> {
  const byHref = new Map<string, number[]>();
  const byLabel = new Map<string, number[]>();

  items.forEach((it, i) => {
    const hk = hrefCompareKey(it.href);
    const lk = labelCompareKey(it.label);
    byHref.set(hk, [...(byHref.get(hk) ?? []), i]);
    byLabel.set(lk, [...(byLabel.get(lk) ?? []), i]);
  });

  const out: LegalMenuWarning[] = [];
  for (const [hrefKey, indices] of byHref)
    if (indices.length > 1)
      out.push({
        code: "DUPLICATE_HREF",
        path: ["items"],
        meta: { indices, hrefKey },
      });
  for (const [labelKey, indices] of byLabel)
    if (indices.length > 1)
      out.push({
        code: "DUPLICATE_LABEL",
        path: ["items"],
        meta: { indices, labelKey },
      });
  return out;
}

/** Erreurs “dures” (bloquantes) — utilisent les ErrorCode du domaine. */
export type LegalMenuIssue = BlockingIssue;

export function checkLegalMenuRules(
  settings: LegalMenuSettings
): ReadonlyArray<LegalMenuIssue> {
  const issues: LegalMenuIssue[] = [];

  settings.items.forEach((it, idx) => {
    if (!it.label || it.label.trim().length === 0) {
      issues.push({ code: EC.MENU_EMPTY_LABEL, path: ["items", idx, "label"] });
    }
    if (!it.href || it.href.trim().length === 0) {
      issues.push({ code: EC.MENU_EMPTY_HREF, path: ["items", idx, "href"] });
    }
  });

  if (settings.items.length > MENU_ITEM_MAX) {
    issues.push({ code: EC.MENU_TOO_MANY_ITEMS, path: ["items"] });
  }

  return issues;
}
