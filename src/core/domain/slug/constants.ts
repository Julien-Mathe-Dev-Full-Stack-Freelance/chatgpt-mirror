/**
 * @file src/core/domain/slug/constants.ts
 * @intro Slugs — SoT (regex finale + réservations)
 * @layer constants
 * @remarks
 * - ASCII only : a–z, 0–9, tirets. Pas de double tiret, pas de tiret début/fin.
 * - Slug = 1 segment (pas de "/").
 */

export const SLUG_FINAL_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const RESERVED_SLUGS = [
  // espaces admin/infra
  "admin",
  "api",
  // auth & profils
  "login",
  "logout",
  "register",
  "signup",
  "account",
  "profile",
  "settings",
  // techniques / robots
  "sitemap",
  "robots",
  // erreurs / assets
  "404",
  "500",
  "favicon",
  "assets",
  "static",
  "public",
  // flux
  "rss",
  "feed",
] as const;
