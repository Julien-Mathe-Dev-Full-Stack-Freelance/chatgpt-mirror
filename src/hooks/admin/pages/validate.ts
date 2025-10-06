"use client";

/**
 * @file src/hooks/admin/pages/validate.ts
 * @intro Validation UI (erreurs + warnings) pour Page — côté front uniquement
 * @description
 * - Respecte le pattern existant :
 *   • fonction PURE `validatePageUi(...)` pour les erreurs (blocantes)
 *   • hook `usePageUiWarnings(...)` pour les avertissements (non-bloquants)
 *   • helper `buildSlugSet(...)` pour détecter les doublons côté UI
 * - La frontière *réelle* reste Zod + UC côté serveur ; ceci n’est que de l’UX.
 */

import { PAGE_TITLE_MAX, PAGE_TITLE_MIN } from "@/core/domain/constants/limits";
import type { SiteIndexDTO } from "@/core/domain/site/dto";
import { SLUG_FINAL_RE } from "@/core/domain/slug/constants";
import { isReservedSlug, normalizeSlug } from "@/core/domain/slug/utils";
import { useMemo } from "react";

/* ─────────────────────────── Types (modèle UI minimal) ─────────────────────────── */

export type PageUiDraft = {
  title: string;
  /** Optionnel : si vide, le serveur dérivera depuis `title`. */
  slug?: string;
};

/** Erreurs blocantes (codes mappés par i18n dans la Section). */
export type PageUiErrors = Partial<{
  title: "required" | "tooShort" | "tooLong";
  slug: "format" | "reserved" | "duplicate";
}>;

/** Warnings non-bloquants (clés stables pour i18n). */
export type PageWarningKey =
  | "slugEmptyWillBeDerived" // slug vide → sera dérivé côté serveur
  | "slugNotNormalized" // slug fourni mais non conforme au regex/kebab
  | "titleLooksThin"; // titre très court (conseil UX)

/* ───────────────────────────── Erreurs (fonction PURE) ───────────────────────────── */

export function validatePageUi(
  draft: PageUiDraft,
  existingSlugs?: ReadonlySet<string> // pour détecter les collisions côté UI
): PageUiErrors {
  const e: PageUiErrors = {};
  const t = (draft.title ?? "").trim();

  // Title
  if (!t) e.title = "required";
  else if (t.length < PAGE_TITLE_MIN) e.title = "tooShort";
  else if (t.length > PAGE_TITLE_MAX) e.title = "tooLong";

  // Slug (si fourni)
  const s = (draft.slug ?? "").trim();
  if (s) {
    if (!SLUG_FINAL_RE.test(s)) e.slug = "format";
    else if (isReservedSlug(s)) e.slug = "reserved";
    else if (existingSlugs?.has(s)) e.slug = "duplicate";
  }

  return e;
}

/* ─────────────────────────── Warnings (fonction PURE + hook) ─────────────────────────── */

function computePageWarnings(
  draft: PageUiDraft
): ReadonlyArray<PageWarningKey> {
  const out = new Set<PageWarningKey>();
  const t = (draft.title ?? "").trim();
  const s = (draft.slug ?? "").trim();

  if (!s) out.add("slugEmptyWillBeDerived");
  else {
    const normalized = normalizeSlug(s);
    // Warning non bloquant si l'utilisateur a saisi un slug “proche” mais pas normalisé
    if (normalized && normalized !== s) out.add("slugNotNormalized");
  }

  // Simple “hint” si le titre est très court (non bloquant)
  if (t && t.length <= Math.max(4, PAGE_TITLE_MIN)) out.add("titleLooksThin");

  return Array.from(out);
}

/** Hook confort — mémoïse le calcul des warnings. */
export function usePageUiWarnings(
  draft: PageUiDraft
): ReadonlyArray<PageWarningKey> {
  return useMemo(() => computePageWarnings(draft), [draft.title, draft.slug]);
}

/* ───────────────────────────── Helper pour doublons ───────────────────────────── */

/**
 * Construit un Set de slugs à partir du site index (optionnel).
 * Passer `currentSlug` en update pour éviter l’auto-collision.
 */
export function buildSlugSet(
  index: SiteIndexDTO | null | undefined,
  currentSlug?: string
): ReadonlySet<string> {
  const set = new Set<string>();
  if (!index) return set;
  for (const p of index.pages) {
    if (p.slug && p.slug !== currentSlug) set.add(p.slug);
  }
  return set;
}
