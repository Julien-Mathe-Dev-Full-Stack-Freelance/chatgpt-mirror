"use client";
/**
 * @file src/components/admin/pages/tabs/MenuTab.tsx
 * @intro Onglet « Menus » (formulaire + aperçus)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { LegalMenuSection } from "@/components/admin/sections/LegalMenuSection";
import { PrimaryMenuSection } from "@/components/admin/sections/PrimaryMenuSection";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function MenuTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("admin.tabs.menu")}</Heading>
      <PrimaryMenuSection />
      <Separator />
      <LegalMenuSection />
    </div>
  );
}
MenuTab.displayName = "MenuTab";
