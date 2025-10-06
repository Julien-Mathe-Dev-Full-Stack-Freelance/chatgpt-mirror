"use client";

/**
 * @file src/components/admin/molecules/fields/skeletons/SelectFieldSkeleton.tsx
 * @intro Skeleton shadcn/ui pour un champ « SelectField »
 * @description
 * Placeholder visuel pour un champ de sélection composé d’un label,
 * d’une aide facultative et d’un sélecteur. Purement présentational.
 *
 * Accessibilité :
 * - Masqué aux lecteurs d’écran via `aria-hidden` (le contenu réel portera l’a11y).
 *
 * Observabilité :
 * - Aucune (composant de rendu uniquement).
 *
 * @layer ui/molecules/fields/skeletons
 * @remarks
 * - Pas de `className` en props (pas de surcharge côté admin).
 * - Le paramètre `help` agit comme drapeau d’affichage (boolean uniquement).
 */

import { Skeleton } from "@/components/ui/skeleton";

/** Props du skeleton de SelectField. */
type SelectFieldSkeletonProps = {
  /** Affiche la ligne d’aide sous le label (true = affichée). */
  help?: boolean;
};

/**
 * Composant « SelectFieldSkeleton ».
 * @returns Trois placeholders : label, aide (optionnelle) et sélecteur.
 */
export function SelectFieldSkeleton({ help }: SelectFieldSkeletonProps) {
  return (
    <div aria-hidden>
      <Skeleton className="h-4 w-24" />
      {help ? <Skeleton className="mt-1 h-3 w-40" /> : null}
      <Skeleton className="mt-1.5 h-9 w-full" />
    </div>
  );
}

SelectFieldSkeleton.displayName = "SelectFieldSkeleton";
