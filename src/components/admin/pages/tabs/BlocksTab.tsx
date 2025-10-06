"use client";
/**
 * @file src/components/admin/pages/tabs/BlocksTab.tsx
 * @intro Onglet « Blocs » (bibliothèque de templates)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { BlocksSection } from "@/components/admin/sections/BlocksSection";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function BlocksTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("ui.tabs.blocks")}</Heading>
      <BlocksSection />
    </div>
  );
}
BlocksTab.displayName = "BlocksTab";
