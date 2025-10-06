"use client";
/**
 * @file src/components/admin/pages/tabs/OverviewTab.tsx
 * @intro Onglet « Vue d’ensemble » (informations globales)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { OverviewSection } from "@/components/admin/sections/OverviewSection";
import { OverviewThemeSection } from "@/components/admin/sections/OverviewThemeSection";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function OverviewTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("ui.tabs.overview")}</Heading>
      <OverviewSection />
      <Separator />
      <OverviewThemeSection />
    </div>
  );
}
OverviewTab.displayName = "OverviewTab";
