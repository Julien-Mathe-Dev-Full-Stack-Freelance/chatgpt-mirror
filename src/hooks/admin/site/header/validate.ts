"use client";
/**
 * @file src/hooks/admin/site/header/validate.ts
 * @intro Validation + Warnings UI (front-only) — Header
 * @layer ui/hooks (feature)
 * @remarks
 * - Aucune erreur UI bloquante en V0.5 (booléens simples).
 * - Warnings UI non-bloquants :
 *    • "noBranding" : ni logo ni titre affichés (risque d’entête vide).
 */

import type { HeaderSettingsInput } from "@/schemas/site/header/header";
import { useMemo } from "react";

/* ────────────── Erreurs UI (blocantes) — aucune pour Header en V0.5 ────────────── */

/* ───────────────────────── Warnings (non-bloquants) ───────────────────────── */

export type HeaderWarningKey = "noBranding";

/**
 * PURE — calcule les warnings pour la Section Header.
 * @param s Réglages du header issus du formulaire (forme/DTO).
 * @returns Liste de warnings non-bloquants.
 */
function computeHeaderWarnings(
  s: Pick<HeaderSettingsInput, "showLogo" | "showTitle">
): ReadonlyArray<HeaderWarningKey> {
  const out = new Set<HeaderWarningKey>();

  // Ni logo ni titre → risque d’en-tête vide/illisible
  if (!s.showLogo && !s.showTitle) {
    out.add("noBranding");
  }

  return Array.from(out);
}

/** Hook confort — simple mémo autour de la fonction PURE. */
export function useHeaderUiWarnings(
  s: Pick<HeaderSettingsInput, "showLogo" | "showTitle">
): ReadonlyArray<HeaderWarningKey> {
  return useMemo(() => computeHeaderWarnings(s), [s.showLogo, s.showTitle]);
}
