"use client";

/**
 * @file src/components/admin/molecules/skeletons/MenuFieldsItemSkeleton.tsx
 * @intro Skeleton d’un item de menu (champs + actions)
 * @description
 * Placeholder visuel d’un item de menu pendant le chargement : imite trois champs
 * (label, href, cible) et une rangée d’actions. Utilise les composants shadcn/ui
 * `<Skeleton>`.
 *
 * Accessibilité :
 * - Le conteneur expose `aria-busy="true"` et `aria-live="polite"` pour informer
 *   les lecteurs d’écran du chargement en cours.
 * - Chaque placeholder visuel est `aria-hidden`.
 *
 * Observabilité :
 * - Aucune (composant purement présentational).
 *
 * @layer ui/molecules/skeletons
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/context";

/**
 * Composant « MenuFieldsItemSkeleton ».
 * @returns Un bloc encadré imitant un item de menu avec ses champs et actions.
 */
export function MenuFieldsItemSkeleton() {
  const { t } = useI18n();
  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      aria-busy="true"
      aria-live="polite"
      aria-label={t("ui.skeleton.menuItem.loading")}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" aria-hidden="true" />
          <Skeleton className="h-10 w-full" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" aria-hidden="true" />
          <Skeleton className="h-10 w-full" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" aria-hidden="true" />
          <Skeleton className="h-10 w-20" aria-hidden="true" />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" aria-hidden="true" />
          <Skeleton className="h-9 w-28" aria-hidden="true" />
        </div>
        <Skeleton className="h-9 w-24" aria-hidden="true" />
      </div>
    </div>
  );
}
