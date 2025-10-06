"use client";
/**
 * @file src/components/admin/organisms/forms/HeaderForm.tsx
 * @intro Organisme — formulaire d’édition du Header (V0.5)
 * @description
 * Composant **dumb** : pas de validation ici ; warnings affichés par la Section.
 * Champs gérés (booléens uniquement) :
 *  - showLogo
 *  - showTitle
 *  - sticky
 *  - blur
 *  - swapPrimaryAndSocial
 *
 * @layer ui/components
 */

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { SwitchField } from "@/components/admin/molecules/fields/SwitchField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import type { HeaderSettingsInput } from "@/schemas/site/header/header";

type HeaderFormProps = {
  /** Valeur du formulaire (forme/DTO) */
  value: HeaderSettingsInput;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;

  /** Patch clé → valeur (fourni par la Section via adaptPatchKV) */
  onPatch: <K extends keyof HeaderSettingsInput>(
    key: K,
    val: HeaderSettingsInput[K]
  ) => void;

  onReset: () => void;
  onSubmit: () => void;
};

export function HeaderForm({
  value,
  loading,
  saving,
  isDirty,
  onPatch,
  onReset,
  onSubmit,
}: HeaderFormProps) {
  const { t } = useI18n();
  const disabled = !!(saving || loading);

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
        <FieldPanel>
          <SwitchField
            id="header-showlogo"
            label={t("admin.header.fields.showLogo.label")}
            help={t("admin.header.fields.showLogo.help")}
            checked={value.showLogo}
            onCheckedChange={(v) => onPatch("showLogo", v)}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <SwitchField
            id="header-showtitle"
            label={t("admin.header.fields.showTitle.label")}
            help={t("admin.header.fields.showTitle.help")}
            checked={value.showTitle}
            onCheckedChange={(v) => onPatch("showTitle", v)}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <SwitchField
            id="header-sticky"
            label={t("admin.header.fields.sticky.label")}
            help={t("admin.header.fields.sticky.help")}
            checked={value.sticky}
            onCheckedChange={(v) => onPatch("sticky", v)}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <SwitchField
            id="header-blur"
            label={t("admin.header.fields.blur.label")}
            help={t("admin.header.fields.blur.help")}
            checked={value.blur}
            onCheckedChange={(v) => onPatch("blur", v)}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <SwitchField
            id="header-swapzones"
            label={t("admin.header.fields.swapPrimaryAndSocial.label")}
            help={t("admin.header.fields.swapPrimaryAndSocial.help")}
            checked={value.swapPrimaryAndSocial}
            onCheckedChange={(v) => onPatch("swapPrimaryAndSocial", v)}
            loading={loading}
            disabled={disabled}
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
