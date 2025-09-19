"use client";
/**
 * @file src/components/admin/molecules/cards/skeletons/ChecklistCardSkeleton.tsx
 * @intro Skeleton basique pour une « ChecklistCard » (titre + 4 items)
 * @description Placeholder visuel pendant le chargement d’une carte checklist.
 * Observabilité : Aucune. Accessibilité : aria-hidden sur le conteneur.
 * @layer ui/molecules
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Composant Skeleton pour un bloc « ChecklistCard ». */
export function ChecklistCardSkeleton() {
  return (
    <Card className="rounded-xl" aria-hidden="true">
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-4 w-44" />
      </CardHeader>

      <CardContent className="space-y-2 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="mt-0.5 h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
ChecklistCardSkeleton.displayName = "ChecklistCardSkeleton";
