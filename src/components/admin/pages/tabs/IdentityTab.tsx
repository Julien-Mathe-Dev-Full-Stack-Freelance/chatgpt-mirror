"use client";
/**
 * @file src/components/admin/pages/tabs/IdentityTab.tsx
 * @intro Onglet « Identité » (formulaire + mini aperçu)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { IdentitySection } from "@/components/admin/sections/IdentitySection";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function IdentityTab() {
  const { t } = useI18n();
  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("admin.tabs.identity")}</Heading>
      <IdentitySection />
    </div>
  );
}
IdentityTab.displayName = "IdentityTab";
