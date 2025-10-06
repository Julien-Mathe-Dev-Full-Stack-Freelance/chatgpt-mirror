// src/components/admin/sections/PageEditSection.tsx
"use client";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import {
  PageForm,
  type PageUiDraft,
} from "@/components/admin/organisms/forms/PageForm";
import { PAGE_TITLE_MAX } from "@/core/domain/constants/limits";
import type { PageRefDTO, SiteIndexDTO } from "@/core/domain/site/dto";
import { normalizeSlug } from "@/core/domain/slug/utils";
import { useConfirmList } from "@/hooks/_shared/useConfirmList";
import { useCreatePage } from "@/hooks/admin/pages/useCreatePage";
import { useUpdatePage } from "@/hooks/admin/pages/useUpdatePage";
import {
  buildSlugSet,
  usePageUiWarnings,
  validatePageUi,
  type PageUiErrors,
  type PageWarningKey,
} from "@/hooks/admin/pages/validate";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { useCallback, useEffect, useMemo, useState } from "react";

type PageEditSectionProps = {
  index: SiteIndexDTO | null;
  loadingIndex?: boolean;
  reloadIndex: () => Promise<void>;
  editSlug: string | null;
  onCancelEdit: () => void;
};

export function PageEditSection({
  index,
  loadingIndex,
  reloadIndex,
  editSlug,
  onCancelEdit,
}: PageEditSectionProps) {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  // I/O hooks
  const { create, saving: creating } = useCreatePage(async () => {
    await reloadIndex();
    setDraft({ title: "", slug: "" });
    setTouched({});
  });
  const { update, updatingSlug } = useUpdatePage(async () => {
    await reloadIndex();
    onCancelEdit();
    setTouched({});
  });

  const initial = useMemo(() => {
    if (!editSlug || !index) return null;
    const ref = index.pages.find((p: PageRefDTO) => p.slug === editSlug);
    return ref ? { id: ref.id, title: ref.title, slug: ref.slug } : null;
  }, [editSlug, index]);

  const mode: "create" | "edit" = editSlug ? "edit" : "create";
  const saving = creating || (editSlug ? updatingSlug === editSlug : false);

  const title =
    mode === "edit" && initial
      ? t("admin.pages.edit.title", { page: initial.title })
      : t("admin.pages.create.title");

  // ─── Draft contrôlé ───
  const [draft, setDraft] = useState<PageUiDraft>(() =>
    initial
      ? { title: initial.title, slug: initial.slug }
      : { title: "", slug: "" }
  );
  // maj du draft quand on passe en edit/quit edit
  useEffect(() => {
    setDraft(
      initial
        ? { title: initial.title, slug: initial.slug }
        : { title: "", slug: "" }
    );
    setTouched({}); // optionnel : on reset les “touched” quand la cible change
  }, [initial]);

  const onPatch = useCallback(
    <K extends keyof PageUiDraft>(k: K, v: PageUiDraft[K]) => {
      setDraft((prev) => ({
        ...prev,
        [k]: typeof v === "string" ? v : v ?? "",
      }));
    },
    []
  );

  // ─── Touched ───
  const [touched, setTouched] = useState<{ title?: boolean; slug?: boolean }>(
    {}
  );
  const markTouched = useCallback((k: "title" | "slug") => {
    setTouched((p) => ({ ...p, [k]: true }));
  }, []);

  // ─── Validation (erreurs blocantes + warnings) ───
  const slugSet = useMemo(
    () => buildSlugSet(index, mode === "edit" ? initial?.slug : undefined),
    [index, mode, initial?.slug]
  );
  const uiErrors: PageUiErrors = validatePageUi(draft, slugSet);
  const warningKeys = usePageUiWarnings(draft);
  const warningHints = useMemo(
    () =>
      warningKeys.map((k: PageWarningKey) => t(`admin.pages.warnings.${k}`)),
    [warningKeys, t]
  );

  // Hints d’erreurs (affichés seulement si “touched”)
  const errorHints = useMemo(() => {
    const arr: string[] = [];
    if (touched.title) {
      if (uiErrors.title === "required")
        arr.push(t("admin.pages.errors.title.required"));
      if (uiErrors.title === "tooShort")
        arr.push(t("admin.pages.errors.title.tooShort"));
      if (uiErrors.title === "tooLong")
        arr.push(t("admin.pages.errors.title.tooLong"));
    }
    if (touched.slug && uiErrors.slug) {
      if (uiErrors.slug === "format")
        arr.push(t("admin.pages.errors.slug.format"));
      if (uiErrors.slug === "reserved")
        arr.push(t("admin.pages.errors.slug.reserved"));
      if (uiErrors.slug === "duplicate")
        arr.push(t("admin.pages.errors.slug.duplicate"));
    }
    return Array.from(new Set(arr));
  }, [touched, uiErrors, t]);

  // Flags invalid pour aria/style
  const invalidFlags = {
    title: Boolean(touched.title && uiErrors.title),
    slug: Boolean(touched.slug && uiErrors.slug),
  };

  // Near-limit & aides dynamiques
  const NEAR = 10;
  const remaining = Math.max(0, PAGE_TITLE_MAX - (draft.title?.length ?? 0));
  const helpTitle =
    remaining <= NEAR
      ? t("admin.pages.form.title.nearLimit", { n: remaining })
      : t("admin.pages.form.title.help");

  const helpSlug = useMemo(() => {
    const s = (draft.slug ?? "").trim();
    if (!s) return t("admin.pages.form.slug.helpEmptyWillBeDerived");
    const normalized = normalizeSlug(s);
    if (normalized && normalized !== s) {
      return t("admin.pages.form.slug.helpNotNormalized");
    }
    return t("admin.pages.form.slug.help");
  }, [draft.slug, t]);

  // isDirty (comparé à l'initial en mode edit)
  const isDirty =
    mode === "edit" && initial
      ? initial.title.trim() !== (draft.title ?? "").trim() ||
        initial.slug.trim() !== (draft.slug ?? "").trim()
      : Boolean((draft.title ?? "").trim() || (draft.slug ?? "").trim());

  // Submit
  const handleSubmit = useCallback(async () => {
    // Marquer touchés si invalides
    if (uiErrors.title || uiErrors.slug) {
      setTouched((p) => ({
        title: p.title || Boolean(uiErrors.title),
        slug: p.slug || Boolean(uiErrors.slug),
      }));
      notify.error(t("admin.pages.errors.form.invalid"));
      return;
    }

    // Confirme si warnings
    if (warningHints.length > 0) {
      const ok = await confirmList({
        title: t("admin.pages.confirm.warn.title"),
        intro: t("admin.pages.confirm.warn.desc"),
        items: warningHints,
        confirmLabel: t("admin.actions.continueSave"),
        cancelLabel: t("admin.actions.cancel"),
        requireAckLabel: t("admin.actions.acknowledge"),
        tone: "default",
      });
      if (!ok) return;
    }

    try {
      const payload = {
        title: (draft.title ?? "").trim(),
        slug: (() => {
          const raw = (draft.slug ?? "").trim();
          if (!raw) return undefined;
          const n = normalizeSlug(raw);
          return n || raw; // fallback défensif
        })(),
      };

      if (mode === "create") {
        await create(payload);
      } else if (initial) {
        await update(initial.slug, payload);
      }
    } catch (e) {
      if (isValidationError(e)) {
        notify.error(t("admin.pages.errors.form.invalid"));
        return;
      }
      if (isHttpError(e)) {
        notify.fromError(e);
        return;
      }
      notify.error(t("admin.pages.errors.form.invalid"));
    }
  }, [
    uiErrors.title,
    uiErrors.slug,
    warningHints,
    t,
    confirmList,
    draft.title,
    draft.slug,
    mode,
    initial,
    create,
    update,
  ]);

  // Auto-derivation du slug au blur du titre si vide (UX)
  const onTitleBlur = useCallback(() => {
    markTouched("title");
    const s = (draft.slug ?? "").trim();
    const t0 = (draft.title ?? "").trim();
    if (!s && t0) {
      const next = normalizeSlug(t0);
      if (next) onPatch("slug", next);
    }
  }, [draft.slug, draft.title, onPatch, markTouched]);

  const onSlugBlur = useCallback(() => markTouched("slug"), [markTouched]);

  return (
    <section
      aria-labelledby="page-edit-title"
      aria-busy={loadingIndex || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading as="h3" id="page-edit-title">
        {title}
      </Heading>

      {/* Erreurs blocantes */}
      {!loadingIndex && errorHints.length > 0 && (
        <HintList
          variant="error"
          title={t("admin.pages.errors.form.invalid")}
          hints={errorHints}
          className="mb-3"
        />
      )}

      {/* Warnings non-bloquants */}
      {!loadingIndex && warningHints.length > 0 && (
        <HintList
          variant="warning"
          title={t("admin.pages.hints.title")}
          hints={warningHints}
          dense
          className="mb-3"
        />
      )}

      <PageForm
        value={draft}
        loading={loadingIndex}
        saving={saving}
        isDirty={isDirty}
        invalid={invalidFlags}
        onPatch={onPatch}
        onSubmit={handleSubmit}
        onReset={() => {
          setTouched({});
          if (mode === "edit" && initial) {
            setDraft({ title: initial.title, slug: initial.slug });
          } else {
            setDraft({ title: "", slug: "" });
          }
          onCancelEdit();
        }}
        onTitleBlur={onTitleBlur}
        onSlugBlur={onSlugBlur}
        helpTitle={helpTitle}
        helpSlug={helpSlug}
        mode={mode}
      />
    </section>
  );
}
