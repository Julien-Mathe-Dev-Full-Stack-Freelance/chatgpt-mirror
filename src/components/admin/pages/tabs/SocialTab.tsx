"use client";

/**
 * @file src/components/admin/pages/tabs/SocialTab.tsx
 * @intro Onglet « Réseaux sociaux » (formulaire + aperçu)
 * @description
 * Vue contrôlée et légère : l’état + I/O sont délégués au hook `useSocialSettings`
 * via la section `<SocialSection />`. Aucun accès réseau direct dans ce composant.
 *
 * @layer ui/organisms
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { SocialSection } from "@/components/admin/sections/SocialSection";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

/**
 * Composant d’onglet « Réseaux sociaux ».
 * Regroupe le formulaire des liens sociaux et un aperçu inline.
 */
export function SocialTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("admin.tabs.social")}</Heading>
      <SocialSection />
    </div>
  );
}
SocialTab.displayName = "SocialTab";
