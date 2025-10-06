"use client";
/**
 * @file src/components/admin/pages/tabs/FooterTab.tsx
 * @intro Onglet « Footer » (formulaire + aperçu)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { FooterSection } from "@/components/admin/sections/FooterSection";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function FooterTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("admin.tabs.footer")}</Heading>
      <FooterSection />
    </div>
  );
}
FooterTab.displayName = "FooterTab";
