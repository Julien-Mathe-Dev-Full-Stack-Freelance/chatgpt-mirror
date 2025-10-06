"use client";
/**
 * @file src/hooks/admin/site/primary-menu/validate.ts
 * @intro Validation + Warnings UI (front-only) — Primary menu (top + children)
 * @layer ui/hooks (feature)
 * @remarks
 * - Erreurs UI (blocantes) : champs requis item & enfant.
 * - Warnings UI (non-bloquants) : doublons top, doublons enfants par groupe,
 *   externes sans new tab, préfixe externe incomplet, état vide (`primaryMenuEmpty`).
 * - Homogène avec Legal menu.
 * - Déduplication : helpers d’URL importés depuis `lib/normalize`.
 */

import { hrefCompareKey, labelCompareKey } from "@/core/domain/urls/tools";
import { hasDuplicates } from "@/hooks/_shared/validate-helpers";
import { looksLikeHttpPrefixOnly } from "@/lib/normalize";
import type {
  PrimaryMenuItemChildInput,
  PrimaryMenuItemInput,
  PrimaryMenuSettingsInput,
} from "@/schemas/site/primary-menu/primary-menu";
import { useMemo } from "react";

/* ──────────────────────────── 1) Erreurs UI (blocantes) ──────────────────────────── */

export type PrimaryMenuUiErrors =
  | { kind: "none" }
  | { kind: "item"; at: number }
  | { kind: "child"; at: number; childAt: number };

/** 2) Retourne la *première* erreur bloquante rencontrée (sinon `{ kind: "none" }`) */
export function validatePrimaryMenuUi(
  items: ReadonlyArray<PrimaryMenuItemInput>
): PrimaryMenuUiErrors {
  for (let i = 0; i < items.length; i++) {
    const it: PrimaryMenuItemInput = items[i];
    if (!it.label.trim() || !it.href.trim()) {
      return { kind: "item", at: i };
    }
    const children: PrimaryMenuItemChildInput[] = it.children ?? [];
    for (let j = 0; j < children.length; j++) {
      const c = children[j];
      if (!c.label.trim() || !c.href.trim()) {
        return { kind: "child", at: i, childAt: j };
      }
    }
  }
  return { kind: "none" };
}

/* ───────────────────────── 3) Warnings UI (non-bloquants) ───────────────────────── */

export type PrimaryMenuWarningKey =
  | "primaryMenuEmpty"
  | "dupLabelsTop"
  | "dupLinksTop"
  | "dupLabelsChildren"
  | "dupLinksChildren"
  | "externalNoNewTab"
  | "externalPrefixOnly";

type WarningArgs = Pick<PrimaryMenuSettingsInput, "items">;

/** 4) PURE — calcule les warnings pour la Section. */
function computePrimaryMenuWarnings(
  args: WarningArgs
): ReadonlyArray<PrimaryMenuWarningKey> {
  const { items } = args;
  const out = new Set<PrimaryMenuWarningKey>();

  // 0) Vide → rien d’autre à vérifier
  if (!items || items.length === 0) {
    out.add("primaryMenuEmpty");
    return Array.from(out);
  }

  // Accumulateurs top-level
  const topLabelKeys: string[] = [];
  const topHrefKeys: string[] = [];

  let hasExternalNoNewTab = false;
  let hasExternalPrefixOnly = false;

  // 1) Parcours top-level & enfants
  for (const it of items) {
    const labelKey = labelCompareKey(it.label);
    const hrefKey = hrefCompareKey(it.href);
    topLabelKeys.push(labelKey);
    topHrefKeys.push(hrefKey);

    // externalNoNewTab
    if (it.isExternal && !it.newTab) hasExternalNoNewTab = true;

    // externalPrefixOnly — ignore explicitement "/" (homepage valide)
    if (it.href.trim() !== "/" && looksLikeHttpPrefixOnly(it.href)) {
      hasExternalPrefixOnly = true;
    }

    // Enfants du groupe courant
    const children = it.children ?? [];
    if (children.length > 0) {
      const childLabelKeys: string[] = [];
      const childHrefKeys: string[] = [];

      for (const c of children) {
        childLabelKeys.push(labelCompareKey(c.label));
        childHrefKeys.push(hrefCompareKey(c.href));

        if (c.isExternal && !c.newTab) hasExternalNoNewTab = true;

        if (c.href.trim() !== "/" && looksLikeHttpPrefixOnly(c.href)) {
          hasExternalPrefixOnly = true;
        }
      }

      if (hasDuplicates(childLabelKeys)) out.add("dupLabelsChildren");
      if (hasDuplicates(childHrefKeys)) out.add("dupLinksChildren");
    }
  }

  // 2) Doublons top-level
  if (hasDuplicates(topLabelKeys)) out.add("dupLabelsTop");
  if (hasDuplicates(topHrefKeys)) out.add("dupLinksTop");

  // 3) Externes
  if (hasExternalNoNewTab) out.add("externalNoNewTab");
  if (hasExternalPrefixOnly) out.add("externalPrefixOnly");

  return Array.from(out);
}

/** 5) Hook confort — simple mémo autour de la fonction PURE. */
export function usePrimaryMenuUiWarnings(
  args: WarningArgs
): ReadonlyArray<PrimaryMenuWarningKey> {
  const { items } = args;
  return useMemo(() => computePrimaryMenuWarnings({ items }), [items]);
}
