/**
 * @file src/lib/ui/social-preview-helpers.ts
 * @intro Mapping Social → label lisible + icône (Tabler brand / Lucide fallback)
 * @description
 * Fournit de petits helpers pour afficher des liens sociaux côté UI :
 * - `socialKindLabel(kind, t?)`  → libellé humain (ex. "Instagram"),
 * - `socialBrandIcon(kind)`  → icône **de marque** (Tabler) si disponible,
 * - `socialGenericIcon(kind)`→ icône **générique** (Lucide) sinon.
 *
 * Observabilité :
 * - Aucune (fonctions pures sans effet de bord).
 *
 * @layer lib/ui
 * @remarks
 * - Les imports d’icônes sont *nommés* pour permettre le tree-shaking.
 * - Maintenir la liste en phase avec `SOCIAL_KINDS` et `SOCIAL_KIND_LABELS`.
 */

import {
  type SocialKind,
  SOCIAL_KIND_EMAIL,
  SOCIAL_KIND_WEBSITE,
} from "@/core/domain/site/social/constants";
import {
  DEFAULT_LOCALE,
  MESSAGES,
  createTSafe,
  type TFunc,
} from "@/i18n";
import type { TablerIcon } from "@tabler/icons-react";
import {
  IconBrandBehance,
  IconBrandDribbble,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import { Globe, Mail } from "lucide-react";

/** Mapping des icônes “brand” Tabler disponibles par réseau. */
const BRAND_ICON_MAP: Partial<Record<SocialKind, TablerIcon>> = {
  instagram: IconBrandInstagram,
  facebook: IconBrandFacebook,
  x: IconBrandX,
  linkedin: IconBrandLinkedin,
  github: IconBrandGithub,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  behance: IconBrandBehance,
  dribbble: IconBrandDribbble,
  pinterest: IconBrandPinterest,
  spotify: IconBrandSpotify,
  soundcloud: IconBrandSoundcloud,
};

const DEFAULT_T: TFunc = createTSafe(
  MESSAGES[DEFAULT_LOCALE],
  MESSAGES[DEFAULT_LOCALE]
);

/**
 * Retourne le libellé humain pour un type de réseau social.
 * @param kind Type de réseau social.
 * @param t   Fonction de traduction (facultative). Fallback : locale par défaut.
 * @returns Libellé lisible (ex. "Instagram") ou le `kind` si non traduit.
 */
export function socialKindLabel(
  kind: SocialKind,
  t: TFunc = DEFAULT_T
): string {
  const label = t(`admin.social.kind.${kind}`);
  return label || kind;
}

/**
 * Retourne le composant d’icône **de marque** (Tabler) s’il existe.
 * @param kind Type de réseau social.
 * @returns Composant React Tabler ou `null` si non disponible.
 */
export function socialBrandIcon(kind: SocialKind): TablerIcon | null {
  return BRAND_ICON_MAP[kind] ?? null;
}

/**
 * Retourne un composant d’icône **générique** (Lucide) pour les cas non brand.
 * @param kind Type de réseau social.
 * @returns Composant React Lucide (ex. `Mail` pour "email", `Globe` par défaut).
 */
export function socialGenericIcon(kind: SocialKind): LucideIcon {
  switch (kind) {
    case SOCIAL_KIND_EMAIL:
      return Mail;
    case SOCIAL_KIND_WEBSITE:
    default:
      return Globe;
  }
}
