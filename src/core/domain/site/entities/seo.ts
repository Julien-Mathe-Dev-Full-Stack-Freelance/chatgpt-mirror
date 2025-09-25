/**
 * @file src/core/domain/site/entities/seo.ts
 * @intro Constantes SEO (types, constantes, URLs)
 */

import type { AssetUrl } from "@/core/domain/urls/href";
import type { TwitterCardType } from "@/core/domain/site/seo/constants";

export interface OpenGraphSettings {
  defaultImageUrl?: AssetUrl;
}

export interface TwitterSettings {
  card: TwitterCardType;
  site?: string;
  creator?: string;
}

export interface SeoSettings {
  baseUrl?: string;
  defaultTitle?: string;
  titleTemplate?: string;
  defaultDescription?: string;
  openGraph?: OpenGraphSettings;
  twitter?: TwitterSettings;
}
