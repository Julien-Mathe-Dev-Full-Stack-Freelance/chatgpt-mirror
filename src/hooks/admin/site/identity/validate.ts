/**
 * @file src/hooks/admin/site/identity/validate.ts
 * @intro Validation + Warnings UI (front-only) — Identité
 * @layer ui/hooks (feature)
 *
 * Règles :
 * - Les **erreurs** sont blocantes et vérifiées au submit (UX), pas « live ».
 * - Les **warnings** sont non-bloquants, calculés en continu pour l’UX
 *   (affichage Hint + confirmation au Save).
 *
 * i18n :
 * - Ce module ne dépend pas d’i18n : il retourne des clés (enum-like).
 * - La Section fait le mapping clés → messages via `t(...)`.
 */

import type { IdentitySettingsInput } from "@/schemas/site/identity/identity";
import { useMemo } from "react";

/* ───────────────────────────── Errors (blocantes) ───────────────────────────── */

export type IdentityUiErrors = { title?: "required"; logoAlt?: "required" };

/**
 * Validation « légère » côté UI.
 * - Pas d’i18n ici : on renvoie des codes (« required ») mappés dans la Section.
 */
export function validateIdentityUi(i: IdentitySettingsInput): IdentityUiErrors {
  const out: IdentityUiErrors = {};
  if (!i.title.trim()) out.title = "required";
  if (!(i.logoAlt ?? "").trim()) out.logoAlt = "required";
  return out;
}

/* ─────────────────────────── Warnings (non-bloquants) ───────────────────────── */

export type IdentityWarningKey =
  | "logos.missingBoth"
  | "logos.missingLight"
  | "logos.missingDark"
  | "favicons.missingBoth"
  | "favicons.missingLight"
  | "favicons.missingDark";

/**
 * Fonction PURE — calcule les warnings à partir des valeurs UI.
 * Retourne des clés stables, mappées dans la Section via i18n.
 */
function computeIdentityWarnings(
  s: Pick<
    IdentitySettingsInput,
    "logoLightUrl" | "logoDarkUrl" | "faviconLightUrl" | "faviconDarkUrl"
  >
): ReadonlyArray<IdentityWarningKey> {
  const warnings: IdentityWarningKey[] = [];

  const hasLogoLight = !!(s.logoLightUrl ?? "").trim();
  const hasLogoDark = !!(s.logoDarkUrl ?? "").trim();
  if (!hasLogoLight && !hasLogoDark) {
    warnings.push("logos.missingBoth");
  } else {
    if (!hasLogoLight) warnings.push("logos.missingLight");
    if (!hasLogoDark) warnings.push("logos.missingDark");
  }

  const hasFavLight = !!(s.faviconLightUrl ?? "").trim();
  const hasFavDark = !!(s.faviconDarkUrl ?? "").trim();
  if (!hasFavLight && !hasFavDark) {
    warnings.push("favicons.missingBoth");
  } else {
    if (!hasFavLight) warnings.push("favicons.missingLight");
    if (!hasFavDark) warnings.push("favicons.missingDark");
  }

  return warnings;
}

/**
 * Hook « confort » pour l’UI — simple mémo autour de la fonction PURE.
 * (Pas d’i18n ici ; pas d’effet de bord.)
 */
export function useIdentityUiWarnings(
  s: Pick<
    IdentitySettingsInput,
    "logoLightUrl" | "logoDarkUrl" | "faviconLightUrl" | "faviconDarkUrl"
  >
): ReadonlyArray<IdentityWarningKey> {
  return useMemo(
    () => computeIdentityWarnings(s),
    [s.logoLightUrl, s.logoDarkUrl, s.faviconLightUrl, s.faviconDarkUrl]
  );
}
