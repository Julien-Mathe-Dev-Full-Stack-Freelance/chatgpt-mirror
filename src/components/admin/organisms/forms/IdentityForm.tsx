"use client";

/**
 * @file src/components/admin/organisms/forms/IdentityForm.tsx
 * @intro Organisme — formulaire d’édition de l’identité (titre, logos, favicons)
 * @layer ui/components
 * @remarks
 * - Composant **dumb** : pas de validation, pas de mapping d’erreurs.
 * - Les erreurs et warnings sont affichés en tête de Section (pattern LegalMenu).
 * - Aides “near limit” non bloquantes (purement UI).
 */

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { FaviconFields } from "@/components/admin/molecules/FaviconFields";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { LogoFields } from "@/components/admin/molecules/LogoFields";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { IDENTITY_TITLE_MAX, TAGLINE_MAX } from "@/constants/shared/limits";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import type { IdentitySettingsInput } from "@/schemas/site/identity/identity";

type IdentityFormProps = {
  value: IdentitySettingsInput;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;

  /** Flags d’invalidité (pas de message inline, juste le style/aria) */
  invalid?: Partial<Record<"title" | "logoAlt", boolean>>;

  /** Patch clé → valeur (fourni par la Section via adaptPatchKV) */
  onPatch: <K extends keyof IdentitySettingsInput>(
    key: K,
    val: IdentitySettingsInput[K]
  ) => void;
  onReset: () => void;
  onSubmit: () => void;
  onUploadImage?: (file: File) => Promise<string>;

  /** Appelés au blur pour marquer le champ comme “touched” côté Section */
  onTitleBlur?: () => void;
  onLogoAltBlur?: () => void;
};

export function IdentityForm({
  value,
  loading,
  saving,
  isDirty,
  invalid,
  onPatch,
  onReset,
  onSubmit,
  onUploadImage,
  onTitleBlur,
  onLogoAltBlur,
}: IdentityFormProps) {
  const { t } = useI18n();
  const disabled = !!(saving || loading);

  // ——— Aide "near limit" (non bloquante) ———
  const NEAR_THRESHOLD = 10; // quand il reste ≤ 10 caractères

  const titleRemaining =
    typeof value.title === "string"
      ? Math.max(0, IDENTITY_TITLE_MAX - value.title.length)
      : IDENTITY_TITLE_MAX;

  const taglineLen = (value.tagline ?? "").length;
  const taglineRemaining = Math.max(0, TAGLINE_MAX - taglineLen);

  const titleHelpDynamic =
    titleRemaining <= NEAR_THRESHOLD
      ? t("admin.identity.fields.title.nearLimit", { n: titleRemaining })
      : t("admin.identity.fields.title.help");

  const taglineHelpDynamic =
    value.tagline && taglineRemaining <= NEAR_THRESHOLD
      ? t("admin.identity.fields.tagline.nearLimit", { n: taglineRemaining })
      : t("admin.identity.fields.tagline.help");

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
            id="identity-title"
            label={t("admin.identity.fields.title.label")}
            value={value.title}
            onChange={(v) => onPatch("title", v)}
            onBlur={onTitleBlur}
            placeholder={t("admin.identity.fields.title.placeholder")}
            help={titleHelpDynamic}
            required
            disabled={disabled}
            loading={loading}
            showCount
            maxLength={IDENTITY_TITLE_MAX}
            autoCapitalize="sentences"
            autoCorrect="on"
            invalid={invalid?.title}
          />

          <InputField
            id="identity-tagline"
            label={t("admin.identity.fields.tagline.label")}
            value={value.tagline ?? ""}
            onChange={(v) => onPatch("tagline", v)}
            placeholder={t("admin.identity.fields.tagline.placeholder")}
            help={taglineHelpDynamic}
            disabled={disabled}
            loading={loading}
            showCount
            maxLength={TAGLINE_MAX}
            autoCapitalize="sentences"
            autoCorrect="on"
          />
        </FieldPanel>

        <FieldPanel full>
          <LogoFields
            value={value}
            disabled={disabled}
            loading={loading}
            onPatch={onPatch}
            onUploadImage={onUploadImage}
            invalidAlt={invalid?.logoAlt}
            /* NEW: déclenche le “touched” pour l’ALT au blur */
            onAltBlur={onLogoAltBlur}
          />
        </FieldPanel>

        <FieldPanel full>
          <FaviconFields
            value={value}
            disabled={disabled}
            loading={loading}
            onPatch={onPatch}
            onUploadImage={onUploadImage}
          />
        </FieldPanel>
      </FormGrid>

      <ActionsBar
        variant="resetSubmit"
        loading={loading}
        saving={saving}
        isDirty={isDirty}
        onReset={onReset}
      />
    </form>
  );
}
