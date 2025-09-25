"use client";
/**
 * @file src/components/admin/molecules/cards/skeletons/StatCardSkeleton.tsx
 * @intro Skeleton basique pour une « StatCard » (label + valeur + hint)
 * @description Placeholder visuel pendant le chargement d’une carte statistique.
 * Observabilité : Aucune. Accessibilité : aria-hidden sur le conteneur.
 * @layer ui/molecules
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Composant Skeleton pour un bloc « StatCard ». */
export function StatCardSkeleton() {
  return (
    <Card className="rounded-xl" aria-hidden="true">
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-4 w-28" />
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex items-baseline justify-between gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
StatCardSkeleton.displayName = "StatCardSkeleton";
