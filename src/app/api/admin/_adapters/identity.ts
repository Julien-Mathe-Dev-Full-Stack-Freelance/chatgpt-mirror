/**
 * @file src/app/api/admin/_adapters/identity.ts
 * @intro API admin — adapters pour les réglages Identity
 * @layer api/adapters
 */

import type { IdentitySettings } from "@/core/domain/site/entities/identity";
import { asAssetUrlOrNull } from "@/core/domain/urls/derive";
import type { UpdateIdentitySettingsPatchDTO } from "@/schemas/site/identity/identity-intents";

/**
 * Adaptation du patch d'Identity (DTO -> domaine).
 * Ne pose QUE les clés présentes (Partial<IdentitySettings>).
 */
export function adaptUpdateIdentityPatch(
  dto: UpdateIdentitySettingsPatchDTO
): Partial<IdentitySettings> {
  const out: Partial<IdentitySettings> = {};

  if (typeof dto.title === "string") out.title = dto.title.trim();
  if (typeof dto.tagline === "string") out.tagline = dto.tagline.trim();
  if (typeof dto.logoAlt === "string") out.logoAlt = dto.logoAlt.trim();

  // Les assets sont string | "" | null | undefined (optionnels + clearables)
  if (dto.logoLightUrl !== undefined) {
    out.logoLightUrl = asAssetUrlOrNull(dto.logoLightUrl);
  }
  if (dto.logoDarkUrl !== undefined) {
    out.logoDarkUrl = asAssetUrlOrNull(dto.logoDarkUrl);
  }
  if (dto.faviconLightUrl !== undefined) {
    out.faviconLightUrl = asAssetUrlOrNull(dto.faviconLightUrl);
  }
  if (dto.faviconDarkUrl !== undefined) {
    out.faviconDarkUrl = asAssetUrlOrNull(dto.faviconDarkUrl);
  }

  return out;
}
