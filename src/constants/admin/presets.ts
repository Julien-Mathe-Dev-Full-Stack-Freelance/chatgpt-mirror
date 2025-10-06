/**
 * @file src/constants/admin/presets.ts
 * @intro Presets UI Admin (choix canoniques)
 * @layer constants
 * @remarks
 * - Zéro i18n : décisions d’UI stables pour l’admin.
 * - Le rendu des classes est délégué à l’adapter `containerClass(kind)`.
 */

/** Conteneur par défaut de l’admin (équivalent “XL”). */
// export const ADMIN_CONTAINER_KIND: ContainerKey = "normal";

/** Compteurs de skeletons par défaut (admin). */
export const ADMIN_SKELETON_COUNTS = {
  pagesList: 4,
  primaryMenu: 3,
  legalMenu: 2,
  socialList: 2,
} as const;
// export type AdminSkeletonCounts = typeof ADMIN_SKELETON_COUNTS;
