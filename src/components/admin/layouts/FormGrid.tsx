"use client";

/**
 * @file src/components/admin/layouts/FormGrid.tsx
 * @intro Grille standard de formulaires (2 colonnes en ≥ sm)
 * @description
 * Wrapper minimal pour éviter de répéter la combinaison utilitaires Tailwind :
 * `grid gap-5 sm:grid-cols-2`. Purement présentational, aucune logique.
 *
 * Observabilité :
 * - Aucune (composant statique).
 *
 * @layer ui/molecules
 * @remarks
 * - Pas de `className` en props (pas de surcharge de styles côté admin).
 * - Ajuster l’apparence via le thème plutôt que via des classes externes.
 */

import { GRIDS } from "@/infrastructure/ui/atoms";
import type { ReactNode } from "react";

interface FormGridProps {
  /** Enfants à placer dans la grille (champs, groupes, etc.). */
  children: ReactNode;
}

/**
 * Grille 2 colonnes (≥ sm) pour composer rapidement des formulaires.
 * @param children Éléments de formulaire à disposer dans la grille.
 * @returns Une grille de champs.
 */
export function FormGrid({ children }: FormGridProps) {
  return <div className={GRIDS.form2}>{children}</div>;
}

FormGrid.displayName = "FormGrid";
