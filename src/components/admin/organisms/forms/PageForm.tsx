"use client";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { PAGE_TITLE_MAX, PAGE_TITLE_MIN } from "@/core/domain/constants/limits";
import { SLUG_FINAL_RE } from "@/core/domain/slug/constants";
import { isValidSlug, normalizeSlug } from "@/core/domain/slug/utils";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { useEffect, useMemo, useState } from "react";

export type PageFormProps = {
  loading?: boolean;
  saving?: boolean;
  onSubmit: (payload: { title: string; slug?: string }) => void;
  mode?: "create" | "edit";
  initial?: { id?: string; title: string; slug: string } | null;
  onCancelEdit?: () => void;
};

export function PageForm({
  loading,
  saving = false,
  onSubmit,
  mode = "create",
  initial = null,
  onCancelEdit,
}: PageFormProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");

  useEffect(() => {
    if (mode === "edit" && initial) {
      setTitle(initial.title);
      setSlug(initial.slug);
      return;
    }

    if (mode === "create") {
      setTitle("");
      setSlug("");
    }
  }, [mode, initial]);

  const titleIsValid = useMemo(() => {
    const t0 = title.trim();
    return t0.length >= PAGE_TITLE_MIN && t0.length <= PAGE_TITLE_MAX;
  }, [title]);

  const slugIsValid = useMemo(() => {
    const s0 = slug.trim();
    return !s0 || isValidSlug(s0);
  }, [slug]);

  const isDirty = useMemo(() => {
    if (mode !== "edit" || !initial) return true;
    return (
      title.trim() !== initial.title.trim() ||
      slug.trim() !== initial.slug.trim()
    );
  }, [mode, initial, title, slug]);

  const disabled = !!(loading || saving);

  function handleTitleBlur() {
    if (!slug.trim() && title.trim()) {
      const next = normalizeSlug(title);
      if (next) setSlug(next);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t0 = title.trim();
    const s0 = slug.trim();
    onSubmit({ title: t0, slug: s0 || undefined });
  }

  const submitLabel = mode === "edit" ? t("ui.page.save") : t("ui.page.create");
  const submitLoadingLabel =
    mode === "edit" ? t("ui.page.saving") : t("ui.page.creating");

  const submitIsDisabled =
    saving || !titleIsValid || !slugIsValid || (mode === "edit" && !isDirty);

  return (
    <form aria-busy={loading || saving} onSubmit={handleSubmit} noValidate>
      {(loading || saving) && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {loading ? t("admin.ui.loading") : t("ui.actions.saving")}
        </span>
      )}

      <FormGrid>
        <FieldPanel full>
          <InputField
            id="page-title"
            label={t("ui.page.title.label")}
            value={title}
            onChange={setTitle}
            onBlur={handleTitleBlur}
            placeholder={
              mode === "edit"
                ? t("ui.page.title.placeholder.edit")
                : t("ui.page.title.placeholder.create")
            }
            help={t("ui.page.title.help")}
            required
            minLength={PAGE_TITLE_MIN}
            maxLength={PAGE_TITLE_MAX}
            autoCapitalize="sentences"
            spellCheck={false}
            aria-invalid={!titleIsValid || undefined}
            disabled={disabled}
            loading={loading}
          />

          <InputField
            id="page-slug"
            label={t("ui.page.slug.label")}
            value={slug}
            onChange={setSlug}
            placeholder={
              mode === "edit"
                ? t("ui.page.slug.placeholder.edit")
                : t("ui.page.slug.placeholder.create")
            }
            help={t("ui.page.slug.help")}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            pattern={SLUG_FINAL_RE.source}
            title={t("ui.page.slug.title")}
            aria-invalid={!slugIsValid || undefined}
            disabled={disabled}
            loading={loading}
          />
        </FieldPanel>
      </FormGrid>

      {mode === "edit" ? (
        <ActionsBar
          variant="resetSubmit"
          loading={loading}
          saving={saving}
          isDirty={isDirty}
          onReset={onCancelEdit}
          resetLabel={t("ui.page.cancel")}
          submitLabel={submitLabel}
          submitLoadingLabel={submitLoadingLabel}
          resetDisabled={!onCancelEdit}
          submitDisabled={submitIsDisabled}
        />
      ) : (
        <ActionsBar
          variant="submitOnly"
          loading={loading}
          saving={saving}
          submitLabel={submitLabel}
          submitLoadingLabel={submitLoadingLabel}
          submitDisabled={submitIsDisabled}
        />
      )}
    </form>
  );
}
