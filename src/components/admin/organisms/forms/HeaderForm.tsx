"use client";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { SelectField } from "@/components/admin/molecules/fields/SelectField";
import { SwitchField } from "@/components/admin/molecules/fields/SwitchField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { getContainerItems, getHeightItems } from "@/constants/admin/options";
import { useI18n } from "@/i18n/context";
import type { HeaderSettingsDTO } from "@/core/domain/site/dto";
import { ATOM } from "@/infrastructure/ui/atoms";

export type HeaderFormProps = {
  value: HeaderSettingsDTO;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onPatch: <K extends keyof HeaderSettingsDTO>(
    key: K,
    val: HeaderSettingsDTO[K]
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
          <SwitchField
            id="header-sticky"
            label={t("admin.ui.header.sticky.label")}
            help={t("admin.ui.header.sticky.help")}
            checked={value.sticky}
            onCheckedChange={(v) => onPatch("sticky", v)}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <SwitchField
            id="header-blur"
            label={t("admin.ui.header.blur.label")}
            help={t("admin.ui.header.blur.help")}
            checked={value.blur}
            onCheckedChange={(v) => onPatch("blur", v)}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <SelectField
            id="header-height"
            label={t("admin.ui.header.height.label")}
            help={t("admin.ui.header.height.help")}
            value={value.height}
            onChange={(v) =>
              onPatch("height", v as HeaderSettingsDTO["height"])
            }
            items={HEIGHT_ITEMS}
            placeholder={t("admin.ui.fields.select.placeholder") || "Select…"}
            disabled={disabled}
            loading={loading}
          />
        </FieldPanel>

        <FieldPanel>
          <SelectField
            id="header-container"
            label={t("admin.ui.header.container.label")}
            help={t("admin.ui.header.container.help")}
            value={value.container}
            onChange={(v) =>
              onPatch("container", v as HeaderSettingsDTO["container"])
            }
            items={CONTAINER_ITEMS}
            placeholder={t("admin.ui.fields.select.placeholder") || "Select…"}
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
