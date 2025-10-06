"use client";
/**
 * @file src/components/admin/pages/tabs/SeoTab.tsx
 * @intro Onglet « SEO » (formulaire + mini-aperçu SERP optionnel)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { SeoSection } from "@/components/admin/sections/SeoSection";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function SeoTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("admin.tabs.seo")}</Heading>
      <SeoSection />
    </div>
  );
}
SeoTab.displayName = "SeoTab";
