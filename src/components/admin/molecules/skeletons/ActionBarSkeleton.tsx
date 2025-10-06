"use client";

/**
 * @file src/components/admin/molecules/skeletons/ActionBarSkeleton.tsx
 * @intro Skeleton pour la barre d’actions (alignée à droite)
 * @description
 * Placeholder minimal qui imite deux boutons d’action pendant un chargement.
 * Utilise les composants shadcn/ui `<Skeleton>`.
 *
 * Accessibilité :
 * - Le conteneur expose `aria-busy="true"` et `aria-live="polite"` pour signaler
 *   l’activité aux lecteurs d’écran.
 * - Chaque placeholder visuel est `aria-hidden`.
 *
 * Observabilité :
 * - Aucune (composant purement présentational).
 *
 * @layer ui/molecules/skeletons
 */

import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/cn";

export type ActionsBarSkeletonVariant =
  | "submitOnly"
  | "resetSubmit"
  | "addResetSubmit";

type ActionsBarSkeletonProps = {
  /** Variante de layout alignée sur `ActionsBar`. */
  variant?: ActionsBarSkeletonVariant;
  /** Ajoute les attributs live-region (désactiver si parent gère déjà l’a11y). */
  withAria?: boolean;
  /** Classes utilitaires supplémentaires. */
  className?: string;
};

/**
 * Composant « ActionsBarSkeleton ».
 * @returns Un squelette aligné sur la variante fournie.
 */
export function ActionsBarSkeleton({
  variant = "resetSubmit",
  withAria = true,
  className,
}: ActionsBarSkeletonProps) {
  const { t } = useI18n();
  const ariaProps = withAria
    ? {
        "aria-busy": true,
        "aria-live": "polite" as const,
        "aria-label":
          t("admin.ui.skeleton.actions.loading") || "Loading actions…",
      }
    : {};

  if (variant === "addResetSubmit") {
    return (
      <div
        {...ariaProps}
        className={cn(
          "flex w-full items-center justify-between gap-2",
          className
        )}
      >
        <Skeleton className="h-9 w-40" aria-hidden="true" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" aria-hidden="true" />
          <Skeleton className="h-9 w-36" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (variant === "submitOnly") {
    return (
      <div {...ariaProps} className={cn("flex w-full justify-end", className)}>
        <Skeleton className="h-9 w-40" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      {...ariaProps}
      className={cn("flex w-full justify-end gap-2", className)}
    >
      <Skeleton className="h-9 w-28" aria-hidden="true" />
      <Skeleton className="h-9 w-36" aria-hidden="true" />
    </div>
  );
}
