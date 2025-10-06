"use client";
/**
 * @file src/hooks/admin/site/seo/validate.ts
 * @intro Validation + Warnings UI (front-only) — SEO
 * @layer ui/hooks (feature)
 *
 * Règles :
 * - Erreurs UI (blocantes au submit) : champs requis simples, aligné sur Identity.
 * - Warnings UI (non-bloquants) : bonnes pratiques SEO (Lighthouse-like).
 *
 * i18n :
 * - Ce module retourne des **clés stables** (enum-like).
 * - Le mapping clés → messages est fait dans la Section via `t(...)`.
 */

import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
} from "@/core/domain/constants/limits";
import { TITLE_PLACEHOLDER_RE } from "@/core/domain/site/seo/constants";
import type { SeoSettingsInput } from "@/schemas/site/seo/seo";
import { useMemo } from "react";

/* ───────────────────────────── 1) Erreurs UI (blocantes) ───────────────────────────── */

export type SeoUiErrors = { defaultTitle?: "required" };

/**
 * Validation « légère » côté UI.
 * - Pas d’i18n ici : on renvoie des codes (« required ») mappés dans la Section.
 */
export function validateSeoUi(i: SeoSettingsInput): SeoUiErrors {
  const out: SeoUiErrors = {};
  if (!(i.defaultTitle ?? "").trim()) out.defaultTitle = "required";
  return out;
}

/* ───────────────────────────── 2) Warnings UI (non-bloquants) ───────────────────────── */

export type SeoWarningKey =
  | "description.length" // description <50 ou >160
  | "titleTemplate.placeholderMissing" // template défini sans %s
  | "robots.noindex" // robots contient noindex
  | "openGraph.image.missing" // OG image absente
  | "twitter.site.missing"
  | "twitter.creator.missing";

/**
 * PURE — calcule les warnings à partir des valeurs UI.
 * Retourne des clés stables, mappées dans la Section via i18n.
 */
function computeSeoWarnings(i: SeoSettingsInput): ReadonlyArray<SeoWarningKey> {
  const out = new Set<SeoWarningKey>();

  const desc = (i.defaultDescription ?? "").trim();
  if (
    desc.length > 0 &&
    (desc.length < SEO_DESCRIPTION_MIN || desc.length > SEO_DESCRIPTION_MAX)
  ) {
    out.add("description.length");
  }

  const template = (i.titleTemplate ?? "").trim();
  if (template.length > 0 && !TITLE_PLACEHOLDER_RE.test(template)) {
    out.add("titleTemplate.placeholderMissing");
  }

  const robots = (i.robots ?? "").toLowerCase().trim();
  if (robots.includes("noindex")) {
    out.add("robots.noindex");
  }

  const ogImg = (i.openGraph?.defaultImageUrl ?? "").trim();
  if (ogImg.length === 0) {
    out.add("openGraph.image.missing");
  }

  if (!i.twitter?.site || i.twitter.site.trim() === "") {
    out.add("twitter.site.missing");
  }
  if (!i.twitter?.creator || i.twitter.creator.trim() === "") {
    out.add("twitter.creator.missing");
  }

  return Array.from(out);
}

/**
 * Hook « confort » pour l’UI — simple mémo autour de la fonction PURE.
 * (Pas d’i18n ici ; pas d’effet de bord.)
 */
export function useSeoUiWarnings(
  i: SeoSettingsInput
): ReadonlyArray<SeoWarningKey> {
  return useMemo(
    () => computeSeoWarnings(i),
    [
      i.defaultDescription,
      i.titleTemplate,
      i.robots,
      i.openGraph?.defaultImageUrl,
      i.twitter?.site,
      i.twitter?.creator,
    ]
  );
}
