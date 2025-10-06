/**
 * @file src/app/api/admin/_adapters/header.ts
 * @intro API admin — adapter pour les réglages Header
 * @layer api/adapters
 * @description
 * Adapte le patch DTO (frontière Zod) vers le **domaine**.
 * - Ne pose QUE les clés présentes (Partial<HeaderSettings>).
 * - Aucune normalisation avancée en V0.5 (booléens simples).
 */

import type { HeaderSettings } from "@/core/domain/site/entities/header";
import type { UpdateHeaderSettingsPatchDTO } from "@/schemas/site/header/header-intents";

/**
 * Adaptation du patch Header (DTO -> domaine).
 * @remarks
 * - Copie défensive champ à champ (booléens seulement en V0.5).
 */
export function adaptUpdateHeaderPatch(
  dto: UpdateHeaderSettingsPatchDTO
): Partial<HeaderSettings> {
  const out: Partial<HeaderSettings> = {};

  if (typeof dto.showLogo === "boolean") out.showLogo = dto.showLogo;
  if (typeof dto.showTitle === "boolean") out.showTitle = dto.showTitle;
  if (typeof dto.sticky === "boolean") out.sticky = dto.sticky;
  if (typeof dto.blur === "boolean") out.blur = dto.blur;
  if (typeof dto.swapPrimaryAndSocial === "boolean") {
    out.swapPrimaryAndSocial = dto.swapPrimaryAndSocial;
  }

  return out;
}
