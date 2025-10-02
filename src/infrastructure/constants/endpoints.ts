/**
 * @file src/infrastructure/constants/endpoints.ts
 * @intro Admin API endpoints (composés, version/env prêts)
 * @layer infra/http
 */

// Join de segments: tolère "", "/", undefined et normalise les slashes
function ep(...segs: Array<string | number | null | undefined>): string {
  const parts = segs
    .filter((s): s is string | number => s != null)
    .map(String)
    .map((s) => s.replace(/^\/+|\/+$/g, "")) // trim both ends
    .filter(Boolean);
  return "/" + parts.join("/");
}

// Préfixes configurables (publics pour le client)
const API_PREFIX = process.env["NEXT_PUBLIC_API_PREFIX"] ?? "/api";
const API_VERSION = process.env["NEXT_PUBLIC_API_VERSION"] ?? undefined;
const VERSION_SEG = API_VERSION ? [API_VERSION] : [];

// /api[/v1]/admin
const ADMIN_BASE = ep(API_PREFIX, ...VERSION_SEG, "admin");
// /api[/v1]/admin/site
const SITE_BASE = ep(ADMIN_BASE, "site");

const MEDIA_BASE = ep(ADMIN_BASE, "media");

export const ENDPOINTS = {
  ADMIN: {
    base: ADMIN_BASE,

    PAGES: {
      base: ep(ADMIN_BASE, "pages"),
      byId: (id: string | number) => ep(ADMIN_BASE, "pages", id),
    },

    SITE: {
      base: SITE_BASE,
      header: ep(SITE_BASE, "header"),
      footer: ep(SITE_BASE, "footer"),
      primaryMenu: ep(SITE_BASE, "primary-menu"),
      legalMenu: ep(SITE_BASE, "legal-menu"),
      identity: ep(SITE_BASE, "identity"),
      social: ep(SITE_BASE, "social"),
      seo: ep(SITE_BASE, "seo"),
      theme: ep(SITE_BASE, "theme"),
      publish: ep(SITE_BASE, "publish"),
    },
    MEDIA: {
      /** Upload d’un fichier image (multipart/form-data) */
      upload: "/api/admin/media/upload",
    },
  },
} as const;

// Exports pratiques
export const ADMIN_BASE_URL = ENDPOINTS.ADMIN.base;
export const SITE_BASE_URL = ENDPOINTS.ADMIN.SITE.base;
