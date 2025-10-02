"use client";

/**
 * @file src/components/admin/sections/PagesListSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { PageListItem } from "@/components/admin/molecules/PageListItem";
import { PageListItemSkeleton } from "@/components/admin/molecules/skeletons/PageListItemSkeleton";
import { ADMIN_SKELETON_COUNTS } from "@/constants/admin/presets";
import type { PageRefDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";

export type PagesListSectionProps = {
  title?: string;
  pages: ReadonlyArray<PageRefDTO>;
  loading?: boolean;
  deletingSlug?: string | null;
  updatingSlug?: string | null;
  onEditMeta?: (slug: string) => void;
  onEditContent?: (slug: string) => void;
  onDelete?: (slug: string) => void;
};

export function PagesListSection({
  title,
  pages,
  loading,
  deletingSlug,
  updatingSlug,
  onEditMeta,
  onEditContent,
  onDelete,
}: PagesListSectionProps) {
  const { t } = useI18n();
  const headingTitle = title ?? t("admin.pages.list.title");
  return (
    <section
      className={ATOM.space.sectionGap}
      aria-labelledby="pages-list-title"
      aria-busy={loading || undefined}
    >
      <Heading as="h3" id="pages-list-title">
        {headingTitle}
      </Heading>

      {loading ? (
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
                onDelete={onDelete}
                isUpdating={updatingSlug === p.slug}
                isDeleting={deletingSlug === p.slug}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
PagesListSection.displayName = "PagesListSection";
