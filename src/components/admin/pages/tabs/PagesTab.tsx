"use client";
/**
 * @file src/components/admin/pages/tabs/PagesTab.tsx
 * @intro Onglet « Pages » (CRUD des pages)
 */
import { Heading } from "@/components/admin/atoms/Heading";
import { PageEditSection } from "@/components/admin/sections/PageEditSection";
import { PagesListSection } from "@/components/admin/sections/PagesListSection";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/context";
import type { PageRefDTO } from "@/core/domain/site/dto";
import { useCreatePage } from "@/hooks/admin/pages/useCreatePage";
import { useDeletePage } from "@/hooks/admin/pages/useDeletePage";
import { useUpdatePage } from "@/hooks/admin/pages/useUpdatePage";
import { useSiteIndex } from "@/hooks/admin/site/useSiteIndex";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ATOM } from "@/infrastructure/ui/atoms";

export function PagesTab() {
  const { t } = useI18n();
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);

  const { index, loading, reload } = useSiteIndex();
  const pages: ReadonlyArray<PageRefDTO> = useMemo(
    () => index?.pages ?? [],
    [index]
  );

  const { create, saving: creating } = useCreatePage(async () => {
    await reload();
    setFormKey((k) => k + 1);
  });

  const { remove, loadingSlug: deletingSlug } = useDeletePage(async () => {
    await reload();
  });

  const { update, updatingSlug } = useUpdatePage(async () => {
    await reload();
    setEditSlug(null);
    setEditInitial(null);
  });

  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<{
    id: PageRefDTO["id"];
    title: string;
    slug: string;
  } | null>(null);

  const currentInitial = useMemo(() => {
    if (!editSlug) return null;
    const ref = pages.find((p: PageRefDTO) => p.slug === editSlug);
    return ref ? { id: ref.id, title: ref.title, slug: ref.slug } : null;
  }, [pages, editSlug]);

  // ✅ remplace le useMemo détourné par un vrai useEffect
  useEffect(() => {
    if (currentInitial && !editInitial) setEditInitial(currentInitial);
  }, [currentInitial, editInitial]);

  const mode: "create" | "edit" = editSlug ? "edit" : "create";

  const handleCreate = useCallback(
    (payload: { title: string; slug?: string }) => void create(payload),
    [create]
  );

  const handleStartEdit = useCallback((slug: string) => {
    setEditSlug(slug);
    setEditInitial(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditSlug(null);
    setEditInitial(null);
  }, []);

  const handleSubmitEdit = useCallback(
    (payload: { title: string; slug?: string }) => {
      if (!editSlug) return;
      const ref = editInitial ?? currentInitial;
      if (!ref) return;

      const nextSlug = payload.slug?.trim()
        ? payload.slug
        : undefined;

      void update(editSlug, {
        id: ref.id,
        title: payload.title,
        slug: nextSlug,
      });
    },
    [currentInitial, editInitial, editSlug, update]
  );

  const handleDelete = useCallback(
    (slug: string) => void remove(slug),
    [remove]
  );

  const handleEditContent = useCallback(
    (slug: string) => router.push(`/admin/pages/${slug}`),
    [router]
  );

  const saving = creating || (editSlug ? updatingSlug === editSlug : false);

  return (
    <div className={ATOM.space.pageGap}>
      <Heading as="h2">{t("ui.tabs.pages")}</Heading>

      <PageEditSection
        key={formKey}
        loading={loading}
        saving={saving}
        mode={mode}
        initial={editInitial ?? currentInitial}
        onCancelEdit={handleCancelEdit}
        onSubmit={mode === "edit" ? handleSubmitEdit : handleCreate}
      />

      <Separator />

      <PagesListSection
        title={t("ui.pages.list.title")}
        loading={loading}
        pages={pages}
        deletingSlug={deletingSlug}
        updatingSlug={updatingSlug}
        onDelete={handleDelete}
        onEditMeta={handleStartEdit}
        onEditContent={handleEditContent}
      />
    </div>
  );
}
PagesTab.displayName = "PagesTab";
