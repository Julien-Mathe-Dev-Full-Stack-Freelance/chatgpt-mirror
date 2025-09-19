// src/core/domain/site/validators/primary-menu.ts
/**
 * @file src/core/domain/site/validators/primary-menu.ts
 * @intro Menu principal — erreurs bloquantes + warnings (doublons)
 * @layer domain/validators
 */

import { MENU_ITEM_MAX } from "@/core/domain/constants/limits";
import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type {
  BlockingIssue,
  UiWarning,
} from "@/core/domain/errors/issue-types";
import type { PrimaryMenuSettings } from "@/core/domain/site/entities";
import { hrefCompareKey, labelCompareKey } from "@/core/domain/urls/compare";

export type PrimaryMenuWarning = UiWarning<
  "DUPLICATE_HREF" | "DUPLICATE_LABEL"
>;

export function findPrimaryMenuWarnings(
  items: ReadonlyArray<{ label: string; href: string }>
): ReadonlyArray<PrimaryMenuWarning> {
  const byHref = new Map<string, number[]>();
  const byLabel = new Map<string, number[]>();

  items.forEach((it, i) => {
    const hk = hrefCompareKey(it.href);
    const lk = labelCompareKey(it.label);
    byHref.set(hk, [...(byHref.get(hk) ?? []), i]);
    byLabel.set(lk, [...(byLabel.get(lk) ?? []), i]);
  });

  const out: PrimaryMenuWarning[] = [];
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

export type PrimaryMenuIssue = BlockingIssue;

export function checkPrimaryMenuRules(
  settings: PrimaryMenuSettings
): ReadonlyArray<PrimaryMenuIssue> {
  const issues: PrimaryMenuIssue[] = [];

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
