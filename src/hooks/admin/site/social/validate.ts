"use client";
/**
 * @file src/hooks/admin/site/social/validate.ts
 * @intro Validation + Warnings UI (front-only) — Social
 * @layer ui/hooks (feature)
 * @remarks
 * - Déduplication : helpers d’URL importés depuis `lib/normalize`.
 */

import { SOCIAL_KIND_EMAIL } from "@/core/domain/site/social/constants";
import {
  looksLikeHttpPrefixOnly,
  looksLikeMailtoPrefixOnly,
} from "@/lib/normalize";
import type { SocialSettingsInput } from "@/schemas/site/social/social";
import { useMemo } from "react";

/* ────────────── Erreurs UI (blocantes) — aucune côté UI pour Social ────────────── */

/* ───────────────────────── Warnings (non-bloquants) ───────────────────────── */
export type SocialWarningKey =
  | "socialEmpty"
  | "dupKinds"
  | "dupLinks"
  | "emailPrefixOnly"
  | "urlPrefixOnly";

type WarningArgs = Pick<SocialSettingsInput, "items">;

const normKind = (k: string) => k.trim().toLowerCase();
const normHref = (h: string) => h.trim().toLowerCase();

function computeSocialWarnings(
  args: WarningArgs
): ReadonlyArray<SocialWarningKey> {
  const out = new Set<SocialWarningKey>();
  const items = Array.isArray(args.items) ? args.items : [];

  // 0) vide
  if (items.length === 0) {
    out.add("socialEmpty");
    return Array.from(out);
  }

  // 1) doublons de platform/kind
  const seenKinds = new Set<string>();
  for (const it of items) {
    const k = normKind(it.kind);
    if (seenKinds.has(k)) {
      out.add("dupKinds");
      break;
    }
    seenKinds.add(k);
  }

  // 2) doublons de liens (href normalisé)
  const seenHrefs = new Set<string>();
  for (const it of items) {
    const h = normHref(it.href ?? "");
    if (!h) continue; // vide → laisser Zod/domain remonter l’erreur
    if (seenHrefs.has(h)) {
      out.add("dupLinks");
      break;
    }
    seenHrefs.add(h);
  }

  // 3) prefixes incomplets (selon plateforme)
  for (const it of items) {
    const href = (it.href ?? "").trim();
    if (!href) continue;

    if (it.kind === SOCIAL_KIND_EMAIL) {
      // email → doit être mailto: ; si juste le préfixe → warning
      if (looksLikeMailtoPrefixOnly(href)) out.add("emailPrefixOnly");
    } else {
      // non-email → doit être http(s) absolu ; si juste le préfixe → warning
      if (looksLikeHttpPrefixOnly(href)) out.add("urlPrefixOnly");
    }
  }

  return Array.from(out);
}

/** Hook confort */
export function useSocialUiWarnings(
  s: WarningArgs
): ReadonlyArray<SocialWarningKey> {
  const { items } = s;
  return useMemo(() => computeSocialWarnings({ items }), [items]);
}
