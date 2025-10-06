"use client";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { SwitchField } from "@/components/admin/molecules/fields/SwitchField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import type { FooterSettingsInput } from "@/schemas/site/footer/footer";

type FooterFormProps = {
  /** Valeur du formulaire (modèle UI) */
  value: FooterSettingsInput;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;

  /** Patch clé → valeur (fourni par la Section via adaptPatchKV) */
  onPatch: <K extends keyof FooterSettingsInput>(
    key: K,
    val: FooterSettingsInput[K]
  ) => void;

  onReset: () => void;
  onSubmit: () => void;
};

export function FooterForm({
  value,
  loading,
  saving,
  isDirty,
  onPatch,
  onReset,
  onSubmit,
}: FooterFormProps) {
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
        <FieldPanel full>
          <SwitchField
            id="footer-showyear"
            label={t("admin.footer.fields.showYear.label")}
            help={t("admin.footer.fields.showYear.help")}
            checked={value.showYear}
            onCheckedChange={(v) => onPatch("showYear", v)}
            disabled={disabled}
            loading={loading}
          />

          <InputField
            id="footer-copyright"
            label={t("admin.footer.fields.copyright.label")}
            help={t("admin.footer.fields.copyright.help")}
            value={value.copyright}
            onChange={(v) => onPatch("copyright", v)}
            placeholder={t("admin.footer.fields.copyright.placeholder")}
            disabled={disabled}
            loading={loading}
            autoCapitalize="sentences"
            autoCorrect="on"
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
