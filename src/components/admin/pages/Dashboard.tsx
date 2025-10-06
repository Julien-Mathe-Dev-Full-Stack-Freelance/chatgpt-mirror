"use client";
/**
 * @file src/components/admin/pages/pages/Dashboard.tsx
 * @intro Onglets du dashboard d’administration
 */
import { Tabs } from "@/components/ui/tabs";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  TabBar,
  type TabBarItemProps,
} from "@/components/admin/molecules/TabBar";
import { TabPanel } from "@/components/admin/molecules/TabPanel";
import {
  BlocksTab,
  FooterTab,
  HeaderTab,
  IdentityTab,
  MenuTab,
  OverviewTab,
  PagesTab,
  SeoTab,
  SocialTab,
} from "@/components/admin/pages/tabs";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

const TABS_DEF = [
  { key: "overview", labelKey: "admin.tabs.overview" },
  { key: "identity", labelKey: "admin.tabs.identity" },
  { key: "menu", labelKey: "admin.tabs.menu" },
  { key: "social", labelKey: "admin.tabs.social" },
  { key: "header", labelKey: "admin.tabs.header" },
  { key: "footer", labelKey: "admin.tabs.footer" },
  { key: "pages", labelKey: "admin.tabs.pages" },
  { key: "blocks", labelKey: "admin.tabs.blocks" },
  { key: "seo", labelKey: "admin.tabs.seo" },
] as const;

type TabDef = (typeof TABS_DEF)[number];
type TabKey = TabDef["key"];

const TAB_KEYS_SET = new Set<TabKey>(TABS_DEF.map((def) => def.key));

const capitalizeKey = (value: string): string =>
  value.length === 0
    ? value
    : value
        .split(/[_-]/g)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(" ");

function isTabKey(v: string | null): v is TabKey {
  return typeof v === "string" && TAB_KEYS_SET.has(v as TabKey);
}

function readTabFromLocation(defaultTab: TabKey): TabKey {
  if (typeof window === "undefined") return defaultTab;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("tab");
  return isTabKey(fromUrl) ? (fromUrl as TabKey) : defaultTab;
}

function useTabState(defaultTab: TabKey = "overview", initialTab?: string) {
  const [value, setValue] = useState<TabKey>(() =>
    isTabKey(initialTab ?? null)
      ? (initialTab as TabKey)
      : readTabFromLocation(defaultTab)
  );

  const setTab = useCallback(
    (next: TabKey) => {
      setValue((prev) => (prev === next ? prev : next));
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      if (next === defaultTab) {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", next);
      }
      window.history.replaceState(
        window.history.state,
        document.title,
        `${url.pathname}${url.search}${url.hash}`
      );
    },
    [defaultTab]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      setValue(readTabFromLocation(defaultTab));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [defaultTab]);

  return { value, setTab };
}

export function Dashboard({ initialTab }: { initialTab?: string } = {}) {
  const { t } = useI18n();
  const { value, setTab } = useTabState("overview", initialTab);

  const tabs: TabBarItemProps[] = useMemo(
    () =>
      TABS_DEF.map(({ key, labelKey }) => ({
        value: key,
        label: t(labelKey) || capitalizeKey(key),
      })),
    [t]
  );

  return (
    <Tabs
      value={value}
      onValueChange={(v) => setTab(v as TabKey)}
      className={ATOM.space.tabsGap}
    >
      <TabBar tabs={tabs} ariaLabel={t("admin.tabs.aria")} />

      <TabPanel value="overview">
        <OverviewTab />
      </TabPanel>
      <TabPanel value="identity">
        <IdentityTab />
      </TabPanel>
      <TabPanel value="menu">
        <MenuTab />
      </TabPanel>
      <TabPanel value="social">
        <SocialTab />
      </TabPanel>
      <TabPanel value="header">
        <HeaderTab />
      </TabPanel>
      <TabPanel value="footer">
        <FooterTab />
      </TabPanel>
      <TabPanel value="pages">
        <PagesTab />
      </TabPanel>
      <TabPanel value="blocks">
        <BlocksTab />
      </TabPanel>
      <TabPanel value="seo">
        <SeoTab />
      </TabPanel>
    </Tabs>
  );
}
Dashboard.displayName = "Dashboard";
