"use client";
/**
 * @file src/components/admin/molecules/cards/skeletons/CardBoxSkeleton.tsx
 * @intro Skeleton basique pour un panneau de type « CardBox »
 * @description Placeholder visuel présenté pendant le chargement d’un panneau (card).
 * Observabilité : Aucune (stateless). Accessibilité : aria-hidden sur le conteneur.
 * @layer ui/molecules
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Composant Skeleton pour un bloc « CardBox ». */
export function CardBoxSkeleton() {
  return (
    <Card className="rounded-xl" aria-hidden="true">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[70%]" />
      </CardContent>
    </Card>
  );
}
CardBoxSkeleton.displayName = "CardBoxSkeleton";
