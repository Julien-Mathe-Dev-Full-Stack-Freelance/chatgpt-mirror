"use client";

/**
 * @file src/components/admin/sections/PagesListSection.tsx
 * @intro Section conteneur — liste des pages + suppression + rendu
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { PageListItem } from "@/components/admin/molecules/PageListItem";
import { PageListItemSkeleton } from "@/components/admin/molecules/skeletons/PageListItemSkeleton";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import type { PageRefDTO, SiteIndexDTO } from "@/core/domain/site/dto";
import { useDeletePage } from "@/hooks/admin/pages/useDeletePage";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";
import { useMemo } from "react";

type PagesListSectionProps = {
  title?: string;

  /** fournis par le Tab (useSiteIndex partagé) */
  index: SiteIndexDTO | null;
  loadingIndex?: boolean;
  reloadIndex: () => Promise<void>;

  /** actions UI */
  onEditMeta?: (slug: string) => void;
  onEditContent?: (slug: string) => void;
};

export function PagesListSection({
  title,
  index,
  loadingIndex,
  reloadIndex,
  onEditMeta,
  onEditContent,
}: PagesListSectionProps) {
  const { t } = useI18n();

  // pages dérivées de l’index (pas d’appel réseau ici)
  const pages: ReadonlyArray<PageRefDTO> = useMemo(
    () => index?.pages ?? [],
    [index]
  );

  // suppression + reload (hook I/O encapsulé dans la section)
  const { remove, loadingSlug: deletingSlug } = useDeletePage(async () => {
    await reloadIndex();
  });

  const headingTitle = title ?? t("admin.pages.list.title");

  return (
    <section
      className={ATOM.space.sectionGap}
      aria-labelledby="pages-list-title"
      aria-busy={loadingIndex || undefined}
    >
      <Heading as="h3" id="pages-list-title">
        {headingTitle}
      </Heading>

      {loadingIndex ? (
        <div className="mt-3 rounded-xl border" aria-hidden>
          <ul className="divide-y">
            {Array.from({ length: ADMIN_SKELETON_COUNTS.pagesList }).map(
              (_, i) => (
                <PageListItemSkeleton key={i} />
              )
            )}
          </ul>
        </div>
      ) : pages.length === 0 ? (
        <div
          className={cn("mt-3 rounded-xl border p-4 text-sm", ATOM.textMuted)}
          role="status"
          aria-live="polite"
        >
          {t("admin.pages.list.empty")}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border">
          <ul className="divide-y">
            {pages.map((p) => (
              <PageListItem
                key={p.id}
                page={p}
                onEditMeta={onEditMeta}
                onEditContent={onEditContent}
                onDelete={(slug) => void remove(slug)}
                isDeleting={deletingSlug === p.slug}
                // pas de MAJ inline côté liste (géré par PageEditSection)
                isUpdating={false}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
PagesListSection.displayName = "PagesListSection";
