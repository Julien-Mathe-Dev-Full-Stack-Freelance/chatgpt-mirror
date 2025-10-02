/**
 * @file src/core/domain/site/dto.ts
 * @intro DTOs exposés pour les réglages du site
 * @layer domain/dto
 * @remarks
 * Ces DTOs servent de contrat aux adapters (API/infra). Ils sont aujourd’hui
 * strictement alignés sur les entités domaine mais permettent, si nécessaire,
 * d’introduire plus tard des transformations spécifiques à la frontière sans
 * impacter le cœur du domaine.
 */

import type {
  AdminSettings,
  FooterSettings,
  HeaderSettings,
  IdentitySettings,
  LegalMenuItem,
  LegalMenuSettings,
  PageRef,
  PrimaryMenuItem,
  PrimaryMenuSettings,
  SeoSettings,
  SiteIndex,
  SocialItem,
  SocialSettings,
  ThemeSettings,
} from "@/core/domain/site/entities";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type { PublishSiteResult } from "@/core/domain/site/use-cases/publish/publish-site.types";

export type PageRefDTO = Readonly<PageRef>;
export type SiteIndexDTO = Readonly<SiteIndex>;

export type HeaderSettingsDTO = Readonly<HeaderSettings>;
export type FooterSettingsDTO = Readonly<FooterSettings>;
export type PrimaryMenuSettingsDTO = Readonly<PrimaryMenuSettings>;
export type PrimaryMenuItemDTO = Readonly<PrimaryMenuItem>;
export type LegalMenuSettingsDTO = Readonly<LegalMenuSettings>;
export type LegalMenuItemDTO = Readonly<LegalMenuItem>;
export type SocialSettingsDTO = Readonly<SocialSettings>;
export type SocialItemDTO = Readonly<SocialItem>;
export type IdentitySettingsDTO = Readonly<IdentitySettings>;
export type SeoSettingsDTO = Readonly<SeoSettings>;
export type ThemeSettingsDTO = Readonly<ThemeSettings>;
export type AdminSettingsDTO = Readonly<AdminSettings>;
export type PublishSiteResultDTO = Readonly<PublishSiteResult>;

export type SiteSettingsDTO = Readonly<{
  header: HeaderSettingsDTO;
  footer: FooterSettingsDTO;
  primaryMenu: PrimaryMenuSettingsDTO;
  legalMenu: LegalMenuSettingsDTO;
  social: SocialSettingsDTO;
  identity: IdentitySettingsDTO;
  seo: SeoSettingsDTO;
  theme: ThemeSettingsDTO;
  admin: AdminSettingsDTO;
}>;

export type WriteSiteSettingsDTO = Readonly<SiteSettings>;
