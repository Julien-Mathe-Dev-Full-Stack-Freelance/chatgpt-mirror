"use client";

/**
 * @file src/components/admin/molecules/fields/skeletons/InputFieldSkeleton.tsx
 * @intro Skeleton shadcn/ui pour un champ de formulaire (label + aide + input)
 * @description
 * Placeholder visuel pour un champ de type « InputField » composé d’un label,
 * d’une aide facultative et d’un input. Purement présentational.
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
 * - Le paramètre `help` est utilisé uniquement comme drapeau d’affichage.
 */

import { Skeleton } from "@/components/ui/skeleton";

/** Props du skeleton d’InputField. */
type InputFieldSkeletonProps = {
  /** Affiche la ligne d’aide sous le label (truthy = affichée). */
  help?: boolean;
};

/**
 * Composant « InputFieldSkeleton ».
 * @returns Trois placeholders : label, aide (optionnelle) et input.
 */
export function InputFieldSkeleton({ help }: InputFieldSkeletonProps) {
  return (
    <div aria-hidden>
      <Skeleton className="h-4 w-24" />
      {help ? <Skeleton className="mt-1 h-3 w-40" /> : null}
      <Skeleton className="mt-1.5 h-9 w-full" />
    </div>
  );
}

InputFieldSkeleton.displayName = "InputFieldSkeleton";
