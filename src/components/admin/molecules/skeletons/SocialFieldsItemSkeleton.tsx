"use client";

/**
 * @file src/components/admin/molecules/skeletons/SocialFieldsItemSkeleton.tsx
 * @intro Skeleton d’un lien social (ligne d’édition)
 * @description
 * Placeholder visuel pour une carte d’édition d’un lien social pendant le chargement.
 * Imitation d’une ligne avec : select (type), champ URL + aide, et actions.
 * Utilise les composants shadcn/ui `<Skeleton>`.
 *
 * Accessibilité :
 * - Le conteneur expose `aria-busy="true"` pour signaler l’état de chargement.
 * - Chaque bloc skeleton est marqué `aria-hidden`.
 *
 * Observabilité :
 * - Aucune (composant purement présentational).
 *
 * @layer ui/molecules/skeletons
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/context";

/**
 * Composant « SocialFieldsItemSkeleton ».
 * @returns Un placeholder squelettique pour une carte d’édition de lien social.
 */
export function SocialFieldsItemSkeleton() {
  const { t } = useI18n();
  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      aria-busy="true"
      aria-live="polite"
      aria-label={t("ui.skeleton.socialItem.loading")}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" aria-hidden="true" />
          <Skeleton className="h-10 w-full" aria-hidden="true" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Skeleton className="h-4 w-20" aria-hidden="true" />
          <Skeleton className="h-10 w-full" aria-hidden="true" />
          <Skeleton className="h-3 w-40" aria-hidden="true" />
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
