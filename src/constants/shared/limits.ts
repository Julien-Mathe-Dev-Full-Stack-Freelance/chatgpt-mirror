/**
 * @file src/constants/shared/limits.ts
 * @intro Limites communes à tous les schémas.
 */

// ───────────────────────────────────────────────────────────────────────────────
// URLs
// - Longueur maximale usuelle de compat navigateurs/outils.
// ───────────────────────────────────────────────────────────────────────────────
export const MAX_URL_LENGTH = 2048 as const;

export {
  IDENTITY_TITLE_MAX,
  IDENTITY_TITLE_MIN,
  TAGLINE_MAX,
  LOGO_ALT_MAX,
} from "@/core/domain/constants/limits";
