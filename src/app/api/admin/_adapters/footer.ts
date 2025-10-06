/**
 * @file src/app/api/admin/_adapters/footer.ts
 * @intro API admin — adapter Footer (DTO -> domaine)
 * @layer api/adapters
 */

import type { FooterSettings } from "@/core/domain/site/entities/footer";
import type { UpdateFooterSettingsPatchDTO } from "@/schemas/site/footer/footer-intents";

export function adaptUpdateFooterPatch(
  dto: UpdateFooterSettingsPatchDTO
): Partial<FooterSettings> {
  const out: Partial<FooterSettings> = {};

  if (typeof dto.showYear === "boolean") out.showYear = dto.showYear;

  if (typeof dto.copyright === "string") {
    const trimmed = dto.copyright.trim();
    // on autorise vide (""), c’est une préférence d’affichage
    out.copyright = trimmed;
  }

  return out;
}
