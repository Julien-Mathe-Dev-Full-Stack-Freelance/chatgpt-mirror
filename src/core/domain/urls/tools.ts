/**
 * @file src/core/domain/urls/tools.ts
 * @intro Barrel public des helpers URLs (href, mailto, compare)
 * @layer domain/utils
 * @remarks
 * - Point d'entrée canonique pour importer des outils URLs dans tout le projet.
 * - Evite les imports multi-fichiers dans les couches supérieures.
 */

export {
  abs,
  brandAssetUrlSafe,
  brandHrefSafe,
  href,
  mail,
  rel,
  type AbsoluteHttpUrl,
  type AssetUrl,
  type AssetUrlOrNull,
  type BrandedHref,
  type MailtoUrl,
  type RelativeUrl,
} from "@/core/domain/urls/href";

export { isMailtoHref, parseMailto } from "@/core/domain/urls/mailto";

export { hrefCompareKey, labelCompareKey } from "@/core/domain/urls/compare";

export { asAssetUrl, isExternalHttp } from "@/core/domain/urls/derive";
