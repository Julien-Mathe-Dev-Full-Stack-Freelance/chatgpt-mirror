"use client";
/**
 * @file src/components/admin/pages/tabs/HeaderTab.tsx
 * @intro Onglet « Header » (formulaire + aperçu)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { HeaderSection } from "@/components/admin/sections/HeaderSection";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function HeaderTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("admin.tabs.header")}</Heading>
      <HeaderSection />
    </div>
  );
}
HeaderTab.displayName = "HeaderTab";
