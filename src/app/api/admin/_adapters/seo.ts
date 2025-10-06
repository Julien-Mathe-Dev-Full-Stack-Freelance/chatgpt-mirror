/**
 * @file src/app/api/admin/_adapters/seo.ts
 * @intro Adapter API → Domaine pour SEO settings
 * @layer api/adapters
 *
 * Règles :
 * - Trim des chaînes.
 * - Mapping partiel et superficiel uniquement (shallow).
 * - Aucune logique métier ici (ni fallback, ni validations d’invariants).
 * - Les URLs/Assets ont déjà été validés en **forme** par Zod.
 */

import type { SeoSettings } from "@/core/domain/site/entities/seo";
import { asAssetUrl } from "@/core/domain/urls/tools";
import type { UpdateSeoSettingsPatchDTO } from "@/schemas/site/seo/seo-intents";

/**
 * Adaptation patch SEO (DTO → Partial<Domaine>).
 * Ne pose QUE les clés présentes.
 */
export function adaptUpdateSeoPatch(
  dto: UpdateSeoSettingsPatchDTO
): Partial<SeoSettings> {
  const out: Partial<SeoSettings> = {};

  // Champs racine
  if (typeof dto.baseUrl === "string") out.baseUrl = dto.baseUrl.trim();
  if (typeof dto.defaultTitle === "string")
    out.defaultTitle = dto.defaultTitle.trim();
  if (typeof dto.defaultDescription === "string")
    out.defaultDescription = dto.defaultDescription.trim();
  if (typeof dto.titleTemplate === "string")
    out.titleTemplate = dto.titleTemplate.trim();
  if (typeof dto.canonicalUrl === "string")
    out.canonicalUrl = dto.canonicalUrl.trim();
  if (typeof dto.robots === "string") out.robots = dto.robots.trim();
  if (typeof dto.structuredDataEnabled === "boolean")
    out.structuredDataEnabled = dto.structuredDataEnabled;

  // OpenGraph (bloc optionnel)
  if (dto.openGraph && typeof dto.openGraph === "object") {
    const ogIn = dto.openGraph;
    const ogOut: NonNullable<SeoSettings["openGraph"]> = {};

    if (typeof ogIn.title === "string") ogOut.title = ogIn.title.trim();
    if (typeof ogIn.description === "string")
      ogOut.description = ogIn.description.trim();
    if (typeof ogIn.imageAlt === "string")
      ogOut.imageAlt = ogIn.imageAlt.trim();

    if (typeof ogIn.defaultImageUrl === "string") {
      // AssetUrl (relatif/absolu) → brand côté domaine
      ogOut.defaultImageUrl = asAssetUrl(ogIn.defaultImageUrl);
    }

    // Ne pose le bloc que s'il a au moins une clé
    if (Object.keys(ogOut).length > 0) out.openGraph = ogOut;
  }

  // Twitter (bloc optionnel)
  if (dto.twitter && typeof dto.twitter === "object") {
    const twIn = dto.twitter;
    const twOut: NonNullable<SeoSettings["twitter"]> = {
      card: twIn.card, // déjà validé par z.enum(TWITTER_CARD_TYPES)
    };

    if (typeof twIn.site === "string") twOut.site = twIn.site.trim();
    if (typeof twIn.creator === "string") twOut.creator = twIn.creator.trim();

    if (Object.keys(twOut).length > 0) out.twitter = twOut;
  }

  return out;
}
