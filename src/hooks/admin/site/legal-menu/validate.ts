"use client";
/**
 * @file src/hooks/admin/site/legal-menu/validate.ts
 * @intro Validation + Warnings UI (front-only) — Menu légal
 * @layer ui/hooks (feature)
 */

import { hrefCompareKey, labelCompareKey } from "@/core/domain/urls/tools";
import { hasDuplicates } from "@/hooks/_shared/validate-helpers";
import { looksLikeHttpPrefixOnly } from "@/lib/normalize";
import type { LegalMenuItemInput } from "@/schemas/site/legal-menu/legal-menu";
import { useMemo } from "react";

/* ────────────────────────────── 1) Erreurs UI (blocantes) ───────────────────────────── */
export type LegalMenuUiErrors = { at?: number; items?: "required" };

export function validateLegalMenuUi(
  items: ReadonlyArray<Pick<LegalMenuItemInput, "label" | "href">>
): LegalMenuUiErrors {
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it.label.trim() || !it.href.trim()) {
      return { items: "required", at: i };
    }
  }
  return {};
}

/* ────────────────────────────── 3) Warnings UI (non-bloquants) ───────────────────────────── */

export type LegalMenuWarningKey =
  | "legalMenuEmpty"
  | "dupLabelsTop"
  | "dupLinksTop"
  | "externalNoNewTab"
  | "externalPrefixOnly";

type WarningArgs = {
  items: ReadonlyArray<LegalMenuItemInput>;
};

function computeLegalMenuWarnings(
  args: WarningArgs
): ReadonlyArray<LegalMenuWarningKey> {
  const { items } = args;
  const out = new Set<LegalMenuWarningKey>();

  if (!items || items.length === 0) {
    out.add("legalMenuEmpty");
    return Array.from(out);
  }

  const labelKeys: string[] = [];
  const hrefKeys: string[] = [];

  let hasExternalNoNewTab = false;
  let hasExternalPrefixOnly = false;

  for (const it of items) {
    const labelKey = labelCompareKey(it.label);
    const hrefKey = hrefCompareKey(it.href);

    labelKeys.push(labelKey);
    hrefKeys.push(hrefKey);

    if (it.isExternal && !it.newTab) hasExternalNoNewTab = true;

    // Ignore "/" (homepage valide)
    if (it.href.trim() !== "/" && looksLikeHttpPrefixOnly(it.href)) {
      hasExternalPrefixOnly = true;
    }
  }

  if (hasDuplicates(labelKeys)) out.add("dupLabelsTop");
  if (hasDuplicates(hrefKeys)) out.add("dupLinksTop");
  if (hasExternalNoNewTab) out.add("externalNoNewTab");
  if (hasExternalPrefixOnly) out.add("externalPrefixOnly");

  return Array.from(out);
}

export function useLegalMenuUiWarnings(
  args: WarningArgs
): ReadonlyArray<LegalMenuWarningKey> {
  const { items } = args;
  return useMemo(() => computeLegalMenuWarnings({ items }), [items]);
}
