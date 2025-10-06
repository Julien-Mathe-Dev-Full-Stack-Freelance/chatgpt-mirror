/**
 * @file src/core/domain/constants/theme.ts
 * @intro Constantes de thème (modes, palettes, hauteurs, containers) côté domaine.
 * @layer domain/constants
 * @sot docs/bible/domain/constants/README.md#theme
 * @description
 * - Source de vérité **domaine** : unions fermées pour modes/palettes/containers (pas de magic strings).
 * - Synchronisé avec defaults + schémas (site/admin) ; l’UI consomme ces tokens.
 * - Domaine pur : aucune dépendance UI/infra, aucun side-effect.
 * @remarks
 * - Toute évolution doit être répercutée dans les schémas Zod, DTO/adapters et l’UI (tokens).
 */

// ───────────────────────────────────────────────────────────────────────────────
// Modes de thème (union fermée) — l’UI mappe ces valeurs sur le système de thèmes.
// ───────────────────────────────────────────────────────────────────────────────
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;
export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];
export const THEME_MODE_VALUES = Object.values(
  THEME_MODES
) as readonly ThemeMode[];

// ───────────────────────────────────────────────────────────────────────────────
// Palettes disponibles — valeurs canoniques consommées par l’UI (tokens).
// ───────────────────────────────────────────────────────────────────────────────
export const PALETTES = {
  NEUTRAL: "neutral",
  OCEAN: "ocean",
  VIOLET: "violet",
  FOREST: "forest",
} as const;
export type ThemePalette = (typeof PALETTES)[keyof typeof PALETTES];
export const PALETTE_VALUES = Object.values(
  PALETTES
) as readonly ThemePalette[];

// ───────────────────────────────────────────────────────────────────────────────
// Hauteurs header/footer — échelons métiers ; la granularité exacte reste en UI.
// ───────────────────────────────────────────────────────────────────────────────
// const HEADER_FOOTER_HEIGHTS = {
//   SMALL: "small",
//   MEDIUM: "medium",
//   LARGE: "large",
// } as const;
// export type HeaderFooterHeight =
// (typeof HEADER_FOOTER_HEIGHTS)[keyof typeof HEADER_FOOTER_HEIGHTS];
// const HEADER_FOOTER_HEIGHT_VALUES = Object.values(
//   HEADER_FOOTER_HEIGHTS
// ) as readonly HeaderFooterHeight[];

// ───────────────────────────────────────────────────────────────────────────────
// Containers — clés canoniques ; l’UI traduit vers des classes/utilitaires.
// ⚠️ Harmoniser avec `constants/layout.ts` si une sémantique similaire existe.
// ───────────────────────────────────────────────────────────────────────────────
export const CONTAINERS = {
  NARROW: "narrow",
  NORMAL: "normal",
  WIDE: "wide",
  FULL: "full",
} as const;
export type ContainerKey = (typeof CONTAINERS)[keyof typeof CONTAINERS];
/** Liste itérable attendue par les factories i18n / zod enums. */
export const CONTAINER_VALUES = Object.values(
  CONTAINERS
) as readonly ContainerKey[];

// ───────────────────────────────────────────────────────────────────────────────
// Type-guards — à utiliser côté adapters/DTOs si besoin (validation souple).
// ───────────────────────────────────────────────────────────────────────────────
// export function isThemeMode(v: unknown): v is ThemeMode {
//   return typeof v === "string" && THEME_MODE_VALUES.includes(v as ThemeMode);
// }

// export function isThemePalette(v: unknown): v is ThemePalette {
//   return typeof v === "string" && PALETTE_VALUES.includes(v as ThemePalette);
// }

// export function isHeaderFooterHeight(v: unknown): v is HeaderFooterHeight {
//   return (
//     typeof v === "string" &&
//     HEADER_FOOTER_HEIGHT_VALUES.includes(v as HeaderFooterHeight)
//   );
// }

// export function isContainerKey(v: unknown): v is ContainerKey {
//   return typeof v === "string" && CONTAINER_VALUES.includes(v as ContainerKey);
// }
