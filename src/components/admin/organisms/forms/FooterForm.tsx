"use client";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { SelectField } from "@/components/admin/molecules/fields/SelectField";
import { SwitchField } from "@/components/admin/molecules/fields/SwitchField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { getContainerItems, getHeightItems } from "@/constants/admin/options";
import type { FooterSettingsDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export type FooterFormProps = {
  value: FooterSettingsDTO;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onPatch: <K extends keyof FooterSettingsDTO>(
    key: K,
    val: FooterSettingsDTO[K]
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

  const HEIGHT_ITEMS = getHeightItems();
  const CONTAINER_ITEMS = getContainerItems();

  return (
    <form
      aria-busy={loading || saving}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      {(loading || saving) && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {loading ? t("admin.ui.loading") : t("ui.actions.saving")}
        </span>
      )}

      <FormGrid>
        <FieldPanel>
          <SelectField
            id="footer-height"
            label={t("admin.ui.footer.height.label")}
            help={t("admin.ui.footer.height.help")}
            value={value.height}
            onChange={(v) =>
              onPatch("height", v as FooterSettingsDTO["height"])
            }
            items={HEIGHT_ITEMS}
            disabled={disabled}
            loading={loading}
            placeholder={t("admin.ui.fields.select.placeholder") || "Select…"}
          />
        </FieldPanel>

        <FieldPanel>
          <SelectField
            id="footer-container"
            label={t("admin.ui.footer.container.label")}
            help={t("admin.ui.footer.container.help")}
            value={value.container}
            onChange={(v) =>
              onPatch("container", v as FooterSettingsDTO["container"])
            }
            items={CONTAINER_ITEMS}
            disabled={disabled}
            loading={loading}
            placeholder={t("admin.ui.fields.select.placeholder") || "Select…"}
          />
        </FieldPanel>

        <FieldPanel full>
          <SwitchField
            id="footer-copyright-year"
            label={t("admin.ui.footer.copyright.showYear.label")}
            help={t("admin.ui.footer.copyright.showYear.help")}
            checked={value.copyrightShowYear ?? false}
            onCheckedChange={(v) => onPatch("copyrightShowYear", v)}
            disabled={disabled}
            loading={loading}
          />

          <InputField
            id="footer-copyright-text"
            label={t("admin.ui.footer.copyright.text.label")}
            help={t("admin.ui.footer.copyright.text.help")}
            value={value.copyright ?? ""}
            onChange={(v) => onPatch("copyright", v || undefined)}
            placeholder={t("admin.ui.footer.copyright.text.placeholder")}
            disabled={disabled}
            loading={loading}
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
