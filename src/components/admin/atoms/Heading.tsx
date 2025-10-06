"use client";

/**
 * @file src/components/admin/atoms/Heading.tsx
 * @intro Titre générique (h1–h6) avec styles cohérents
 * @description
 * Atom très léger qui normalise la typo des titres d’onglet/section côté admin.
 * Ne gère **pas** l’incrémentation automatique des niveaux (reste explicite via `as`).
 *
 * Accessibilité :
 * - `visuallyHidden` applique une classe utilitaire (sr-only) : le titre reste
 *   présent dans l’arbre d’accessibilité mais est masqué visuellement.
 *
 * Observabilité : Aucune (présentation pure).
 *
 * @layer ui/atoms
 * @remarks
 * - Exemple : `<Heading as="h2">Paramètres</Heading>`
 * - Les attributs HTML standards (`id`, `aria-*`, `data-*`, …) sont transmis via `...rest`.
 * - Convention admin : pas de `className` exposé.
 */

import { ATOM, HEADINGS } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";
import * as React from "react";

/** Balises de titre supportées. */
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** Propriétés du composant Heading (sans `className`). */
type HeadingProps = Omit<
  React.HTMLAttributes<HTMLHeadingElement>,
  "className"
> & {
  /** Balise de titre à rendre (défaut: `"h2"`). */
  as?: HeadingTag;
  /**
   * Masque visuellement le titre tout en conservant la sémantique
   * (utile pour fournir un titre accessible à un groupe de champs).
   */
  visuallyHidden?: boolean;
  /**
   * Coupe le texte sur une ligne avec ellipsis.
   * (évite de devoir exposer `className` juste pour `truncate`)
   */
  truncate?: boolean;
  /** Contenu du titre. */
  children: React.ReactNode;
};

/**
 * Composant Heading (h1–h6).
 * @returns Un élément de titre typographié de façon cohérente.
 */
export function Heading({
  as = "h2",
  visuallyHidden = false,
  truncate = false,
  children,
  ...rest
}: HeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        HEADINGS[as],
        visuallyHidden && ATOM.srOnly,
        truncate && "truncate"
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Heading.displayName = "Heading";
