"use client";

/**
 * @file src/components/admin/organisms/forms/PageForm.tsx
 * @intro Formulaire de création/modification d’une page
 */

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { PAGE_TITLE_MAX, PAGE_TITLE_MIN } from "@/core/domain/constants/limits";
import { SLUG_FINAL_RE } from "@/core/domain/slug/constants";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export type PageUiDraft = { title: string; slug?: string };

type PageFormProps = {
  value: PageUiDraft;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;

  /** flags invalidité pour aria/style (pas de message inline) */
  invalid?: Partial<Record<"title" | "slug", boolean>>;

  /** patch clé → valeur (la Section fournit un adaptateur) */
  onPatch: <K extends keyof PageUiDraft>(key: K, val: PageUiDraft[K]) => void;
  onSubmit: () => void;
  onReset?: () => void;

  /** blur remontés pour “touched” côté Section */
  onTitleBlur?: () => void;
  onSlugBlur?: () => void;

  /** Texte d’aide dynamiques calculés par la Section */
  helpTitle?: string;
  helpSlug?: string;

  /** Mode UI */
  mode?: "create" | "edit";
};

export function PageForm({
  value,
  loading,
  saving,
  isDirty,
  invalid,
  onPatch,
  onSubmit,
  onReset,
  onTitleBlur,
  onSlugBlur,
  helpTitle,
  helpSlug,
  mode = "create",
}: PageFormProps) {
  const { t } = useI18n();
  const disabled = !!(loading || saving);

  const submitLabel =
    mode === "edit"
      ? t("admin.pages.form.actions.save")
      : t("admin.pages.form.actions.create");
  const submitLoadingLabel =
    mode === "edit"
      ? t("admin.pages.form.actions.saving")
      : t("admin.pages.form.actions.creating");

  return (
    <form
      aria-busy={loading || saving || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      {(loading || saving) && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {loading ? t("admin.actions.loading") : t("admin.actions.saving")}
        </span>
      )}

      <FormGrid>
        <FieldPanel full>
          <InputField
            id="page-title"
            label={t("admin.pages.form.title.label")}
            value={value.title}
            onChange={(v) => onPatch("title", v)}
            onBlur={onTitleBlur}
            placeholder={
              mode === "edit"
                ? t("admin.pages.form.title.placeholder.edit")
                : t("admin.pages.form.title.placeholder.create")
            }
            help={helpTitle ?? t("admin.pages.form.title.help")}
            required
            minLength={PAGE_TITLE_MIN}
            maxLength={PAGE_TITLE_MAX}
            showCount
            autoCapitalize="sentences"
            spellCheck={false}
            disabled={disabled}
            loading={loading}
            invalid={invalid?.title}
          />

          <InputField
            id="page-slug"
            label={t("admin.pages.form.slug.label")}
            value={value.slug ?? ""}
            onChange={(v) => onPatch("slug", v)}
            onBlur={onSlugBlur}
            placeholder={
              mode === "edit"
                ? t("admin.pages.form.slug.placeholder.edit")
                : t("admin.pages.form.slug.placeholder.create")
            }
            help={helpSlug ?? t("admin.pages.form.slug.help")}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            pattern={SLUG_FINAL_RE.source}
            title={t("admin.pages.form.slug.title")}
            disabled={disabled}
            loading={loading}
            invalid={invalid?.slug}
          />
        </FieldPanel>
      </FormGrid>

      {mode === "edit" ? (
        <ActionsBar
          variant="resetSubmit"
          loading={loading}
          saving={saving}
          isDirty={isDirty}
          onReset={onReset}
          resetLabel={t("admin.actions.cancel")}
          submitLabel={submitLabel}
          submitLoadingLabel={submitLoadingLabel}
        />
      ) : (
        <ActionsBar
          variant="submitOnly"
          loading={loading}
          saving={saving}
          submitLabel={submitLabel}
          submitLoadingLabel={submitLoadingLabel}
        />
      )}
    </form>
  );
}
