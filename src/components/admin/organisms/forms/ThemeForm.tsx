"use client";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { SelectField } from "@/components/admin/molecules/fields/SelectField";
import {
  PALETTE_VALUES,
  THEME_MODE_VALUES,
} from "@/core/domain/constants/theme";
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { useMemo } from "react";

type ThemeFormProps = {
  value: ThemeSettingsDTO;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onPatch: <K extends keyof ThemeSettingsDTO>(
    key: K,
    val: ThemeSettingsDTO[K]
  ) => void;
  onReset: () => void;
  onSubmit: () => void;
};

export function ThemeForm({
  value,
  loading,
  saving,
  isDirty,
  onPatch,
  onReset,
  onSubmit,
}: ThemeFormProps) {
  const { t } = useI18n();
  const modeItems = useMemo(
    () =>
      THEME_MODE_VALUES.map((m) => ({
        value: m,
        label: t(`ui.theme.mode.${m}`),
      })),
    [t]
  );
  const paletteItems = useMemo(
    () =>
      PALETTE_VALUES.map((p) => ({
        value: p,
        label: t(`ui.theme.palette.${p}`),
      })),
    [t]
  );
  const disabled = !!(saving || loading);

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
          {loading ? t("ui.loading") : t("ui.actions.saving")}
        </span>
      )}

      <FormGrid>
        <SelectField
          id="theme-mode"
          label={t("ui.theme.mode.label")}
          help={t("ui.theme.mode.help")}
          value={value.themeMode}
          onChange={(v) =>
            onPatch("themeMode", v as ThemeSettingsDTO["themeMode"])
          }
          items={modeItems}
          disabled={disabled}
          loading={loading}
          placeholder={t("ui.theme.mode.placeholder")}
        />

        <SelectField
          id="theme-palette"
          label={t("ui.theme.palette.label")}
          help={t("ui.theme.palette.help")}
          value={value.themePalette}
          onChange={(v) =>
            onPatch("themePalette", v as ThemeSettingsDTO["themePalette"])
          }
          items={paletteItems}
          disabled={disabled}
          loading={loading}
          placeholder={t("ui.theme.palette.placeholder")}
        />
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
