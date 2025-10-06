"use client";

/**
 * @file src/components/admin/molecules/panels/FieldPanel.tsx
 * @intro Bloc de formulaire encadré (border + padding)
 * @description
 * Conteneur visuel pour regrouper des champs de formulaire avec un style cohérent.
 * Présentation pure (aucune logique).
 *
 * Accessibilité : Aucune sémantique supplémentaire (décoratif).
 * Observabilité : Aucune.
 *
 * @layer ui/molecules
 * @remarks
 * - Pas de `className` en props (surcharge interdite côté admin).
 * - `full` applique `sm:col-span-2` (utile dans une grille `sm:grid-cols-2`).
 */

import { PANELS } from "@/infrastructure/ui/patterns";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type FieldPanelProps = {
  children: ReactNode;
  /** Étendre sur 2 colonnes (≥ sm). */
  full?: boolean;
};

export function FieldPanel({ children, full = false }: FieldPanelProps) {
  return (
    <div className={cn(PANELS.field, full && "sm:col-span-2")}>{children}</div>
  );
}

FieldPanel.displayName = "FieldPanel";
