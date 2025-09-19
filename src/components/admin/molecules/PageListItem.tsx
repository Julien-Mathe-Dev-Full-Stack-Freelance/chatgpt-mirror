"use client";

/**
 * @file src/components/admin/molecules/PageListItem.tsx
 * @intro Élément de liste de pages (ligne)
 * @description Titre + slug + actions (métadonnées, contenu, suppression).
 * Observabilité : Aucune.
 * @layer ui/molecules
 */

import { Button } from "@/components/ui/button";
import type { PageRefDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { cn } from "@/lib/cn";

export type PageListItemProps = {
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
          title={t("ui.pages.editMeta.title")}
          aria-label={t("ui.pages.editMeta.title")}
        >
          {isUpdating ? t("ui.pages.updating") : t("ui.pages.editMeta.button")}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEditContent?.(page.slug)}
          disabled={!onEditContent}
          title={t("ui.pages.editContent.title")}
          aria-label={t("ui.pages.editContent.title")}
        >
          {t("ui.pages.editContent.button")}
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(page.slug)}
          disabled={!onDelete || isDeleting}
          title={t("ui.pages.delete.title")}
          aria-label={t("ui.pages.delete.title")}
        >
          {isDeleting ? t("ui.pages.deleting") : t("ui.pages.delete.button")}
        </Button>
      </div>
    </li>
  );
}
