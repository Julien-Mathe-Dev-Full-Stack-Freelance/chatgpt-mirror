/**
 * @file src/lib/ui/header-preview-classes.ts
 * @intro Mapping settings → classes Tailwind (aperçu header)
 * @description
 * Transformation **pure** et déterministe : prend des réglages de header validés
 * et renvoie les classes utilitaires utilisées par les composants d’aperçu/public.
 *
 * Observabilité :
 * - Aucune (fonction pure sans effet de bord).
 *
 * @layer lib/ui
 * @remarks
 * - Garder ces mappings en phase avec les options exposées dans le formulaire Header.
 * - Les classes retournées sont volontairement minimales (height/container/sticky/bg).
 * @example
 * import { headerPreviewClasses } from "@/lib/ui/header-preview-classes";
 * const { height, container, sticky, bg } = headerPreviewClasses(settings);
 */

import type { HeaderSettingsDTO } from "@/core/domain/site/dto";

/** Ensemble de classes Tailwind nécessaires pour le rendu d’un header. */
export type HeaderPreviewClasses = {
  height: string;
  container: string;
  sticky: string;
  bg: string;
};

/** Traduction de `height` métier → classe Tailwind. */
const HEIGHT = {
  small: "h-12",
  medium: "h-16",
  large: "h-20",
} as const satisfies Record<HeaderSettingsDTO["height"], string>;

/** Traduction de `container` métier → contrainte de largeur. */
const CONTAINER = {
  narrow: "max-w-xl",
  normal: "max-w-3xl",
  wide: "max-w-5xl",
  full: "max-w-none",
} as const satisfies Record<HeaderSettingsDTO["container"], string>;

/**
 * Retourne les classes utilitaires pour l’aperçu du header.
 * @param s Réglages du header (hauteur, container, sticky, blur…).
 * @returns Un objet `{ height, container, sticky, bg }` prêt à être interpolé.
 */
export function headerPreviewClasses(
  s: HeaderSettingsDTO
): HeaderPreviewClasses {
  return {
    height: HEIGHT[s.height],
    container: CONTAINER[s.container],
    sticky: s.sticky ? "sticky top-0" : "",
    bg: s.blur
      ? "backdrop-blur supports-[backdrop-filter]:bg-background/70"
      : "bg-background",
  };
}
