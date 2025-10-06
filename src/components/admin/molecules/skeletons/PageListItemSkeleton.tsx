"use client";

/**
 * @file src/components/admin/molecules/skeletons/PageListItemSkeleton.tsx
 * @intro Skeleton d’un élément de liste de pages (titre + meta + actions)
 * @description
 * Placeholder visuel pour une ligne de la liste des pages pendant le chargement.
 * Imite un bloc titre + sous-texte à gauche, et deux actions à droite.
 * Utilise les composants shadcn/ui `<Skeleton>`.
 *
 * Accessibilité :
 * - Le conteneur expose `aria-busy="true"` et `aria-live="polite"` pour signaler
 *   l’état de chargement aux lecteurs d’écran.
 * - Chaque placeholder visuel est marqué `aria-hidden`.
 *
 * Observabilité :
 * - Aucune (composant purement présentational).
 *
 * @layer ui/molecules/skeletons
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/context";

/**
 * Composant « PageListItemSkeleton ».
 * @returns Un `<li>` squelettique imitant une ligne de la liste de pages.
 */
export function PageListItemSkeleton() {
  const { t } = useI18n();
  return (
    <li
      className="flex items-center justify-between px-4 py-3"
      aria-busy="true"
      aria-live="polite"
      aria-label={t("ui.skeleton.pageItem.loading")}
    >
      <div className="min-w-0 space-y-1">
        <Skeleton className="h-4 w-48" aria-hidden="true" />
        <Skeleton className="h-3 w-24" aria-hidden="true" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-16" aria-hidden="true" />
        <Skeleton className="h-8 w-24" aria-hidden="true" />
      </div>
    </li>
  );
}
