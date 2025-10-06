"use client";

/**
 * @file src/hooks/admin/site/footer/validate.ts
 * @intro Validation + Warnings UI (front-only) — Footer
 */

import type { FooterSettingsInput } from "@/schemas/site/footer/footer";
import { useMemo } from "react";

export type FooterWarningKey = "footerLooksEmpty" | "copyrightEmpty";

function computeFooterWarnings(
  s: Pick<FooterSettingsInput, "copyright" | "showYear">
): ReadonlyArray<FooterWarningKey> {
  const out = new Set<FooterWarningKey>();

  const hasText = (s.copyright ?? "").trim().length > 0;
  const showsYear = Boolean(s.showYear);

  // Recommandation d’avoir un copyright explicite
  if (!hasText) out.add("copyrightEmpty");

  // Footer “vide” si ni texte ni année
  if (!hasText && !showsYear) out.add("footerLooksEmpty");

  return Array.from(out);
}

export function useFooterUiWarnings(
  s: Pick<FooterSettingsInput, "copyright" | "showYear">
): ReadonlyArray<FooterWarningKey> {
  return useMemo(() => computeFooterWarnings(s), [s.copyright, s.showYear]);
}
