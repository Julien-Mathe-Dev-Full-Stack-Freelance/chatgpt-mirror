"use client";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import type { IdentitySettingsDTO } from "@/core/domain/site/dto";
import { brandAssetUrlSafe } from "@/core/domain/urls/href";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export type IdentityFormProps = {
  value: IdentitySettingsDTO;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onPatch: <K extends keyof IdentitySettingsDTO>(
    key: K,
    val: IdentitySettingsDTO[K]
  ) => void;
  onReset: () => void;
  onSubmit: () => void;
};

export function IdentityForm({
  value,
  loading,
  saving,
  isDirty,
  onPatch,
  onReset,
  onSubmit,
}: IdentityFormProps) {
  const { t } = useI18n();
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
        <FieldPanel full>
          <InputField
            id="identity-title"
            label={t("ui.identity.title.label")}
            value={value.title}
            onChange={(v) => onPatch("title", v)}
            placeholder={t("ui.identity.title.placeholder")}
            help={t("ui.identity.title.help")}
            required
            disabled={disabled}
            loading={loading}
          />
        </FieldPanel>

        <FieldPanel>
          <InputField
            id="identity-logo-url"
            label={t("ui.identity.logoUrl.label")}
            value={value.logoUrl ?? ""}
            onChange={(v) =>
              onPatch("logoUrl", brandAssetUrlSafe(v) || undefined)
            }
            placeholder={t("ui.identity.logoUrl.placeholder")}
            help={t("ui.identity.logoUrl.help")}
            disabled={disabled}
            loading={loading}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </FieldPanel>

        <FieldPanel>
          <InputField
            id="identity-favicon-url"
            label={t("ui.identity.faviconUrl.label")}
            value={value.faviconUrl ?? ""}
            onChange={(v) =>
              onPatch("faviconUrl", brandAssetUrlSafe(v) || undefined)
            }
            placeholder={t("ui.identity.faviconUrl.placeholder")}
            help={t("ui.identity.faviconUrl.help")}
            disabled={disabled}
            loading={loading}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
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
