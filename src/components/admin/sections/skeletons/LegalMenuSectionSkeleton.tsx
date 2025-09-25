"use client";

/**
 * @file src/components/admin/sections/skeletons/LegalMenuSectionSkeleton.tsx
 * @intro Skeleton de la section « Liens légaux »
 * @description
 * Placeholders purement décoratifs pendant le chargement initial.
 *
 * A11y (Option A) :
 * - Tout le skeleton est masqué aux lecteurs d’écran via `aria-hidden`.
 * - Le vrai titre/structure restent rendus par la section parente.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function LegalMenuSectionSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="rounded-xl border p-4 space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-9 w-44" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </div>
  );
}
LegalMenuSectionSkeleton.displayName = "LegalMenuSectionSkeleton";
