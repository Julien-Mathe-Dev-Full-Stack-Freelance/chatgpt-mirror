/**
 * @file src/core/domain/site/entities/site-settings.ts
 * @intro Entité agrégée des réglages du site (aggregate root).
 * @description
 * Regroupe les value objects de configuration du site (header, footer, menus,
 * identité, social, SEO, thème public, réglages Admin) en un **document unique**.
 * Cette entité est **purement structurelle** (aucune logique), les défauts,
 * normalisations et invariants transverses sont gérés par les schémas Zod et
 * les use-cases/adapters.
 *
 * @layer domain/entity
 * @remarks
 * - Un document par état logique (ex. `draft` et `published`) est géré au niveau
 *   repository/use-cases ; l’entité ne porte pas elle-même la notion d’état.
 * - En cas d’évolution du contrat, prévoir un mécanisme de versionnement/migration
 *   côté use-cases/adapters (pas dans l’entité).
 */

import type {
  AdminSettings,
  FooterSettings,
  HeaderSettings,
  IdentitySettings,
  LegalMenuSettings,
  PrimaryMenuSettings,
  SeoSettings,
  SocialSettings,
  ThemeSettings,
} from ".";

/** Agrégat des réglages du site. */
export interface SiteSettings {
  /** Réglages du header (sticky, blur, hauteur, conteneur…). */
  header: HeaderSettings;

  /** Réglages du footer (logo, hauteur, conteneur, copyright). */
  footer: FooterSettings;

  /** Menu principal (liste ordonnée d’items). */
  primaryMenu: PrimaryMenuSettings;

  /** Menu légal (alias du schéma menu, dédié aux pages légales). */
  legalMenu: LegalMenuSettings;

  /** Liens sociaux (liste ordonnée d’items). */
  social: SocialSettings;

  /** Identité (title, logo, favicon). */
  identity: IdentitySettings;

  /** Réglages SEO (baseUrl, titres, OpenGraph, Twitter/X). */
  seo: SeoSettings;

  /** Thème public (mode/palette) consommé côté runtime client. */
  theme: ThemeSettings;

  /** Réglages Admin (préférences d’interface, thème admin, etc.). */
  admin: AdminSettings;
}
