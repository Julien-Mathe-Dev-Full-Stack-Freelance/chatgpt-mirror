/**
 * @file src/components/admin/pages/tabs/index.ts
 * @intro Barrel des onglets d’administration (organisms)
 * @description
 * Centralise les ré-exports pour des imports courts et homogènes :
 *   import { PagesTab } from "@/components/admin/pages/tabs"
 *
 * Observabilité :
 * - Aucune (fichier d’agrégation, sans logique d’exécution).
 *
 * @layer ui/organisms
 * @remarks
 * - Aucune logique ici : uniquement des ré-exports statiques.
 * - Conserver l’ordre alphabétique pour la lisibilité et les diffs.
 * - Ne pas ajouter "use client" : ce fichier ne s’exécute pas côté client.
 * - Aide le tree-shaking (ré-exporte sans side-effects).
 */

export { BlocksTab } from "@/components/admin/pages/tabs/BlocksTab";
export { FooterTab } from "@/components/admin/pages/tabs/FooterTab";
export { HeaderTab } from "@/components/admin/pages/tabs/HeaderTab";
export { IdentityTab } from "@/components/admin/pages/tabs/IdentityTab";
export { MenuTab } from "@/components/admin/pages/tabs/MenuTab";
export { OverviewTab } from "@/components/admin/pages/tabs/OverviewTab";
export { PagesTab } from "@/components/admin/pages/tabs/PagesTab";
export { SeoTab } from "@/components/admin/pages/tabs/SeoTab";
export { SocialTab } from "@/components/admin/pages/tabs/SocialTab";
