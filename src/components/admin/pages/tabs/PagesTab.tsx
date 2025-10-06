"use client";
/**
 * @file src/components/admin/pages/tabs/PagesTab.tsx
 * @intro Onglet « Pages » — coordination (index + sélection)
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { PageEditSection } from "@/components/admin/sections/PageEditSection";
import { PagesListSection } from "@/components/admin/sections/PagesListSection";
import { Separator } from "@/components/ui/separator";
import { useSiteIndex } from "@/hooks/admin/site/useSiteIndex";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function PagesTab() {
  const { t } = useI18n();
  const router = useRouter();
  const { index, loading, reload } = useSiteIndex();

  const [editSlug, setEditSlug] = useState<string | null>(null);

  const handleEditContent = useCallback(
    (slug: string) => router.push(`/admin/pages/${slug}`),
    [router]
  );

  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("admin.tabs.pages")}</Heading>

      {/* CREATE / EDIT (conteneur) */}
      <PageEditSection
        index={index}
        loadingIndex={loading}
        reloadIndex={reload}
        editSlug={editSlug}
        onCancelEdit={() => setEditSlug(null)}
      />

      <Separator />

      {/* LISTE (conteneur) */}
      <PagesListSection
        title={t("admin.pages.list.title")}
        index={index}
        loadingIndex={loading}
        reloadIndex={reload}
        onEditMeta={(slug) => setEditSlug(slug)}
        onEditContent={handleEditContent}
      />
    </div>
  );
}
PagesTab.displayName = "PagesTab";
