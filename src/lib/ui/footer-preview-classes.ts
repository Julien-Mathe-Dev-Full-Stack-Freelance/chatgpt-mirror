/**
 * @file src/lib/ui/footer-preview-classes.ts
 * @intro Mapping settings → classes Tailwind (aperçu footer)
 * @description
 * Transformation **pure** et déterministe : prend des réglages de footer validés
 * et renvoie les classes utilitaires utilisées par les composants d’aperçu/public.
 *
 * Observabilité :
 * - Aucune (fonction pure sans effet de bord).
 *
 * @layer lib/ui
 * @remarks
 * - Garder ces mappings en phase avec les options exposées dans le formulaire Footer.
 * - Les classes retournées sont volontairement minimales (bg/border/height/container).
 * @example
 * import { footerPreviewClasses } from "@/lib/ui/footer-preview-classes";
 * const { height, container, bg, border } = footerPreviewClasses(settings);
 */

import type { FooterSettingsDTO } from "@/core/domain/site/dto";

/** Ensemble de classes Tailwind nécessaires pour le rendu d’un footer. */
export type FooterPreviewClasses = {
  height: string;
  container: string;
  bg: string;
  border: string;
};

/** Traduction de `height` métier → classe Tailwind. */
const HEIGHT = {
  small: "h-12",
  medium: "h-16",
  large: "h-20",
} as const satisfies Record<FooterSettingsDTO["height"], string>;

/** Traduction de `container` métier → contrainte de largeur. */
const CONTAINER = {
  narrow: "max-w-xl",
  normal: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
} as const satisfies Record<FooterSettingsDTO["container"], string>;

/**
 * Retourne les classes utilitaires pour l’aperçu du footer.
 * @param s Réglages de footer (hauteur, container…)
 * @returns Un objet `{ height, container, bg, border }` prêt à être interpolé.
 */
export function footerPreviewClasses(
  s: FooterSettingsDTO
): FooterPreviewClasses {
  return {
    height: HEIGHT[s.height],
    container: CONTAINER[s.container],
    bg: "bg-background",
    border: "border-t",
  };
}
