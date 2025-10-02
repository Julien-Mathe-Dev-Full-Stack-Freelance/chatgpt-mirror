"use client";

/**
 * @file src/hooks/admin/site/legal-menu/validate.ts
 * @intro Validation + Warnings UI (front-only) — Menu légal
 * @layer ui/hooks (feature)
 * @remarks
 * - Erreurs UI (blocantes) : champs requis item par item.
 * - Warnings UI (non-bloquants) : doublons, externes sans new tab, préfixe externe incomplet.
 * - Inclut `legalMenuEmpty` pour homogénéiser avec la section.
 */

import { hrefCompareKey, labelCompareKey } from "@/core/domain/urls/tools";
import {
  hasDuplicates,
  isIncompleteExternalPrefix,
} from "@/hooks/_shared/validate-helpers";
import type { LegalMenuItemInput } from "@/schemas/site/legal-menu/legal-menu";
import { useMemo } from "react";

/* ────────────────────────────── 1) Erreurs UI (blocantes) ───────────────────────────── */
export type LegalMenuUiErrors = { at?: number; items?: "required" };

/** 2) Vérifie les champs requis (label+href) ; retourne la 1re erreur si présente. */
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

/** 4) PURE — calcule les warnings pour la Section. */
export function computeLegalMenuWarnings(
  args: WarningArgs
): ReadonlyArray<LegalMenuWarningKey> {
  const { items } = args;
  const out = new Set<LegalMenuWarningKey>();

  // 0) Vide
  if (!items || items.length === 0) {
    out.add("legalMenuEmpty");
    return Array.from(out);
  }

  // Prépare clés de comparaison
  const labelKeys: string[] = [];
  const hrefKeys: string[] = [];

  let hasExternalNoNewTab = false;
  let hasExternalPrefixOnly = false;

  for (const it of items) {
    const labelKey = labelCompareKey(it.label);
    const hrefKey = hrefCompareKey(it.href);

    labelKeys.push(labelKey);
    hrefKeys.push(hrefKey);

    // 1) Externe mais pas newTab
    if (it.isExternal && !it.newTab) hasExternalNoNewTab = true;

    // 2) Préfixe externe incomplet — indépendamment de isExternal
    //    Ignore "/" (homepage valide)
    if (it.href.trim() !== "/" && isIncompleteExternalPrefix(it.href)) {
      hasExternalPrefixOnly = true;
    }
  }

  // Doublons labels top
  if (hasDuplicates(labelKeys)) out.add("dupLabelsTop");

  // Doublons liens top
  if (hasDuplicates(hrefKeys)) out.add("dupLinksTop");

  // Externes sans newTab
  if (hasExternalNoNewTab) out.add("externalNoNewTab");

  // Liens au préfixe externe incomplet
  if (hasExternalPrefixOnly) out.add("externalPrefixOnly");

  return Array.from(out);
}

/** 5) Hook confort — simple mémo autour de la fonction PURE. */
export function useLegalMenuUiWarnings(
  args: WarningArgs
): ReadonlyArray<LegalMenuWarningKey> {
  const { items } = args;
  return useMemo(() => computeLegalMenuWarnings({ items }), [items]);
}
