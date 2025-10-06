/**
 * @file src/core/domain/site/entities/seo.ts
 * @intro Entité SEO — paramètres globaux de référencement
 * @layer domain/entity
 */

import type { TwitterCardType } from "@/core/domain/site/seo/constants";
import type { AssetUrl } from "@/core/domain/urls/tools";

/** Paramètres OpenGraph pour l’aperçu social. */
interface OpenGraphSettings {
  title?: string; // undefined si absent (pas "")
  description?: string; // idem
  defaultImageUrl?: AssetUrl; // asset non clearable ici (soit défini, soit absent)
  imageAlt?: string;
}

interface TwitterSettings {
  /** Card toujours présente (tu as un défaut domaine) */
  card: TwitterCardType;

  /** Handles optionnels, on évite "" dans le domaine. */
  site?: string;
  creator?: string;
}

export interface SeoSettings {
  /** Domaine de base optionnel en dev, validé/forcé https en prod côté règles. */
  baseUrl?: string;

  /** Requis côté publication, mais on garde optionnel au niveau de l’entité. */
  defaultTitle?: string;

  /** Avec placeholder %s si présent : validé par les règles. */
  titleTemplate?: string;

  /** Description par défaut, optionnelle. */
  defaultDescription?: string;

  /** URL canonique globale, optionnelle. */
  canonicalUrl?: string;

  /** Directive robots (ex: "index,follow"), optionnelle. */
  robots?: string;

  /** Bloc OG facultatif (si vide → undefined). */
  openGraph?: OpenGraphSettings;

  /** Bloc Twitter avec card toujours définie via defaults. */
  twitter?: TwitterSettings;

  /** Feature flag optionnel. */
  structuredDataEnabled?: boolean;
}
