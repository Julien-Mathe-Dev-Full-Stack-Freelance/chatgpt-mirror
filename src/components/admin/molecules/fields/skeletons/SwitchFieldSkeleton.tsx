"use client";

/**
 * @file src/components/admin/molecules/fields/skeletons/SwitchFieldSkeleton.tsx
 * @intro Skeleton shadcn/ui pour un champ « SwitchField »
 * @description
 * Placeholder visuel pour un interrupteur avec label et aide optionnelle.
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

/** Props du skeleton de SwitchField. */
type SwitchFieldSkeletonProps = {
  /** Affiche la ligne d’aide sous le label (true = affichée). */
  help?: boolean;
};

/**
 * Composant « SwitchFieldSkeleton ».
 * @returns Ligne skeleton : label (+ aide optionnelle) à gauche, switch à droite.
 */
export function SwitchFieldSkeleton({ help }: SwitchFieldSkeletonProps) {
  return (
    <div className="flex items-center justify-between" aria-hidden>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        {help ? <Skeleton className="h-3 w-40" /> : null}
      </div>
      <Skeleton className="h-6 w-10" />
    </div>
  );
}

SwitchFieldSkeleton.displayName = "SwitchFieldSkeleton";
