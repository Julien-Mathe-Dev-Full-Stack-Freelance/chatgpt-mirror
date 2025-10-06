"use client";

/**
 * @file src/components/admin/molecules/TabBar.tsx
 * @intro Barre d’onglets admin (shadcn/ui)
 * @description Rendu d’une tablist depuis une config.
 * Observabilité : Aucune.
 * @layer ui/molecules
 */

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n/context";

export type TabBarItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

type TabBarProps = {
  tabs: ReadonlyArray<TabBarItemProps>;
  ariaLabel?: string;
};

export function TabBar({ tabs, ariaLabel }: TabBarProps) {
  const { t } = useI18n();
  const computedLabel = ariaLabel ?? t("admin.tabs.aria");
  return (
    <TabsList aria-label={computedLabel}>
      {tabs.map((tItem) => (
        <TabsTrigger
          key={tItem.value}
          value={tItem.value}
          disabled={tItem.disabled}
        >
          {tItem.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
