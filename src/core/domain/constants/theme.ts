/**
 * @file src/core/domain/constants/theme.ts
 * @intro Constantes de thème (modes, palettes, hauteurs, containers) côté domaine.
 * @layer domaine
 * @sot docs/bible/domain/constants/README.md
 * @description
 * - Source de vérité **domaine** : unions fermées pour thèmes/palettes/containers (pas de magic strings).
 * - Se synchronise avec defaults + schémas côté site/admin (UI consomme ces tokens).
 * - Domaine pur : aucune dépendance UI/infra, aucun side-effect.
 * @remarks
 * - Toute évolution doit être répercutée dans les schémas Zod et l’UI (tokens).
 */

// ───────────────────────────────────────────────────────────────────────────────
// Modes de thème (union fermée) — l’UI mappe ces valeurs sur le système de thèmes.
// ───────────────────────────────────────────────────────────────────────────────
export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

// ───────────────────────────────────────────────────────────────────────────────
// Palettes disponibles — valeurs canoniques consommées par l’UI (tokens).
// ───────────────────────────────────────────────────────────────────────────────
export const PALETTES = ["neutral", "ocean", "violet", "forest"] as const;
export type ThemePalette = (typeof PALETTES)[number];

// ───────────────────────────────────────────────────────────────────────────────
// Hauteurs header/footer — échelons métiers, le détail de tailles reste en UI.
// ───────────────────────────────────────────────────────────────────────────────
/** Hauteurs header/footer */
export const HEADER_FOOTER_HEIGHTS = ["small", "medium", "large"] as const;
export type HeaderFooterHeight = (typeof HEADER_FOOTER_HEIGHTS)[number];

// ───────────────────────────────────────────────────────────────────────────────
// Containers — clés canoniques ; l’UI traduit vers des classes/utilitaires.
// ⚠️ Vérifier l’harmonisation avec `src/core/domain/constants/layout.ts`
// (ex. "content" vs "normal") pour éviter les écarts UI/DTO.
// ───────────────────────────────────────────────────────────────────────────────
/** Containers — canonique */
export const CONTAINERS = ["narrow", "normal", "wide", "full"] as const;
export type ContainerKey = (typeof CONTAINERS)[number];

// ───────────────────────────────────────────────────────────────────────────────
// Type-guards — à utiliser côté adapters/DTOs si besoin (validation souple).
// ───────────────────────────────────────────────────────────────────────────────
/** Type-guards utiles côté adapters/UI si besoin. */
export const isThemeMode = (v: string): v is ThemeMode =>
  (THEME_MODES as readonly string[]).includes(v);

export const isThemePalette = (v: string): v is ThemePalette =>
  (PALETTES as readonly string[]).includes(v);

export const isHeaderFooterHeight = (v: string): v is HeaderFooterHeight =>
  (HEADER_FOOTER_HEIGHTS as readonly string[]).includes(v);

export const isContainerKey = (v: string): v is ContainerKey =>
  (CONTAINERS as readonly string[]).includes(v);
