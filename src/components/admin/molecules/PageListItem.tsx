"use client";

/**
 * @file src/components/admin/molecules/PageListItem.tsx
 * @intro Élément de liste de pages (ligne)
 */

import { Button } from "@/components/ui/button";
import type { PageRefDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";

type PageListItemProps = {
  page: PageRefDTO;
  onEditMeta?: (slug: string) => void;
  onEditContent?: (slug: string) => void;
  onDelete?: (slug: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
};

export function PageListItem({
  page,
  onEditMeta,
  onEditContent,
  onDelete,
  isUpdating,
  isDeleting,
}: PageListItemProps) {
  const { t } = useI18n();

  return (
    <li className="flex items-center justify-between px-4 py-3">
      <div className="min-w-0">
        <div className="truncate font-medium">{page.title}</div>
        <div className={cn("text-sm", ATOM.textMuted)}>/{page.slug}</div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onEditMeta?.(page.slug)}
          disabled={!onEditMeta || isUpdating}
          title={t("admin.actions.editMeta")}
          aria-label={t("admin.actions.editMeta")}
        >
          {isUpdating
            ? t("admin.pages.actions.updating")
            : t("admin.pages.actions.editMeta.button")}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEditContent?.(page.slug)}
          disabled={!onEditContent}
          title={t("admin.actions.editContent")}
          aria-label={t("admin.actions.editContent")}
        >
          {t("admin.pages.actions.editContent.button")}
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(page.slug)}
          disabled={!onDelete || isDeleting}
          title={t("admin.actions.delete")}
          aria-label={t("admin.actions.delete")}
        >
          {isDeleting ? t("admin.actions.deleting") : t("admin.actions.delete")}
        </Button>
      </div>
    </li>
  );
}
