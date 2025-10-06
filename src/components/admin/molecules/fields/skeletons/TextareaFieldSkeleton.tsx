"use client";

/**
 * @file src/components/admin/molecules/fields/skeletons/TextareaFieldSkeleton.tsx
 * @intro Skeleton shadcn/ui pour un champ « TextareaField »
 * @description
 * Placeholder visuel pour une zone de texte avec label et aide optionnelle.
 * Composant purement présentational, sans logique ni accessibilité fonctionnelle.
 *
 * Accessibilité :
 * - Marqué `aria-hidden` (le champ réel portera les attributs a11y).
 *
 * Observabilité :
 * - Aucune (rendu statique uniquement).
 *
 * @layer ui/molecules/fields/skeletons
 * @remarks
 * - Pas de `className` en props (pas de surcharge côté admin).
 * - Le paramètre `help` agit comme drapeau d’affichage (boolean uniquement).
 */

import { Skeleton } from "@/components/ui/skeleton";

/** Props du skeleton de TextareaField. */
type TextareaFieldSkeletonProps = {
  /** Affiche la ligne d’aide sous le label (true = affichée). */
  help?: boolean;
};

/**
 * Composant « TextareaFieldSkeleton ».
 * @returns Bloc skeleton : label (+ aide optionnelle) puis zone de saisie.
 */
export function TextareaFieldSkeleton({ help }: TextareaFieldSkeletonProps) {
  return (
    <div aria-hidden>
      <Skeleton className="h-4 w-24" />
      {help ? <Skeleton className="mt-1 h-3 w-40" /> : null}
      <Skeleton className="mt-1.5 h-20 w-full" />
    </div>
  );
}

TextareaFieldSkeleton.displayName = "TextareaFieldSkeleton";
