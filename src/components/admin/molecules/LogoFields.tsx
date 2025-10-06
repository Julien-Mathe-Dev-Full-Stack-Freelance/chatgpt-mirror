"use client";

/**
 * @file src/components/admin/molecules/LogoFields.tsx
 * @intro Molécule — logos (light/dark) + alt + previews (via ImageSelector)
 * @layer ui/molecules
 * @remarks
 * - Pas d’erreur inline : les erreurs sont affichées en tête de Section (pattern LegalMenu).
 */

import { ImageSelector } from "@/components/admin/molecules/fields/ImageSelector";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { LOGO_ALT_MAX } from "@/constants/shared/limits";
import { useI18n } from "@/i18n/context";
import type { IdentitySettingsInput } from "@/schemas/site/identity/identity";
import { useMemo } from "react";

type LogoFieldsProps = Readonly<{
  value: Pick<
    IdentitySettingsInput,
    "title" | "logoAlt" | "logoLightUrl" | "logoDarkUrl"
  >;
  disabled?: boolean;
  loading?: boolean;
  invalidAlt?: boolean;

  onPatch: <K extends keyof IdentitySettingsInput>(
    key: K,
    value: IdentitySettingsInput[K]
  ) => void;
  onUploadImage?: (file: File) => Promise<string>;

  /** NEW — notifie la Section que le champ ALT a été “touched” */
  onAltBlur?: () => void;
}>;

export function LogoFields({
  value,
  disabled,
  loading,
  invalidAlt,
  onPatch,
  onUploadImage,
  onAltBlur,
}: LogoFieldsProps) {
  const { t } = useI18n();
  const alt = useMemo(
    () => value.logoAlt || value.title || "Logo",
    [value.logoAlt, value.title]
  );
  const isBusy = !!(disabled || loading);

  // Reco: SVG prioritaire, fallback PNG/WEBP
  const LOGO_ACCEPT = "image/svg+xml,image/png,image/webp";
  const PREFERRED_LOGO = ["image/svg+xml"];
  const preferredLogoHint = t("admin.identity.fields.logo.help");

  // --- Counter + dynamic help for alt
  const NEAR_THRESHOLD = 10;
  const altLen = (value.logoAlt ?? "").length;
  const altRemaining = Math.max(0, LOGO_ALT_MAX - altLen);
  const altHelpDynamic =
    altLen > 0 && altRemaining <= NEAR_THRESHOLD
      ? t("admin.identity.fields.logoAlt.nearLimit", { n: altRemaining })
      : t("admin.identity.fields.logoAlt.help");

  return (
    <fieldset aria-describedby="logos-help" className="grid gap-4">
      <legend className="text-sm font-medium opacity-90">
        {t("admin.identity.groups.logos.legend")}
      </legend>

      {/* Alt commun (sans erreur inline) */}
      <InputField
        id="identity-logo-alt"
        label={t("admin.identity.fields.logoAlt.label")}
        value={value.logoAlt}
        onChange={(v) => onPatch("logoAlt", v)}
        onBlur={onAltBlur}
        placeholder={t("admin.identity.fields.logoAlt.placeholder")}
        help={altHelpDynamic}
        required
        disabled={isBusy}
        loading={loading}
        showCount
        maxLength={LOGO_ALT_MAX}
        autoCapitalize="sentences"
        autoCorrect="on"
        invalid={invalidAlt}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ImageSelector
          id="identity-logo-light-url"
          label={t("admin.identity.fields.logoLight.label")}
          url={value.logoLightUrl ?? ""}
          onUrlChange={(v) => onPatch("logoLightUrl", v)}
          disabled={isBusy}
          loading={loading}
          previewAlt={alt}
          previewBg="light"
          accept={LOGO_ACCEPT}
          onFileSelect={onUploadImage}
          preferredTypes={PREFERRED_LOGO}
          preferredTypeHint={preferredLogoHint}
        />

        <ImageSelector
          id="identity-logo-dark-url"
          label={t("admin.identity.fields.logoDark.label")}
          url={value.logoDarkUrl ?? ""}
          onUrlChange={(v) => onPatch("logoDarkUrl", v)}
          disabled={isBusy}
          loading={loading}
          previewAlt={alt}
          previewBg="dark"
          accept={LOGO_ACCEPT}
          onFileSelect={onUploadImage}
          preferredTypes={PREFERRED_LOGO}
          preferredTypeHint={preferredLogoHint}
        />
      </div>

      <p id="logos-help" className="text-sm opacity-70">
        {t("admin.identity.groups.logos.help")}
      </p>
    </fieldset>
  );
}
