"use client";

/**
 * @file src/components/admin/sections/PageEditSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { PageForm } from "@/components/admin/organisms/forms/PageForm";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export type PageEditSectionProps = {
  loading?: boolean;
  saving?: boolean;
  onSubmit: (payload: { title: string; slug?: string }) => void;
  mode?: "create" | "edit";
  initial?: { id?: string; title: string; slug: string } | null;
  onCancelEdit?: () => void;
};

export function PageEditSection({
  loading,
  saving,
  onSubmit,
  mode = "create",
  initial = null,
  onCancelEdit,
}: PageEditSectionProps) {
  const { t } = useI18n();
  const editing = mode === "edit";
  const title =
    editing && initial
      ? t("admin.pages.edit.title", { page: initial.title })
      : t("admin.pages.create.title");

  return (
    <section
      aria-labelledby="page-edit-title"
      aria-busy={loading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading as="h3" id="page-edit-title">
        {title}
      </Heading>

      <PageForm
        loading={loading}
        saving={saving}
        onSubmit={onSubmit}
        mode={mode}
        initial={initial}
        onCancelEdit={onCancelEdit}
      />
    </section>
  );
}
PageEditSection.displayName = "PageEditSection";
