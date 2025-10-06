"use client";

/**
 * @file src/components/admin/molecules/FaviconFields.tsx
 * @intro Molécule — Favicons (light/dark) + previews
 * @layer ui/components
 * @remarks
 * - **Dumb** : aucun warning métier (favicons manquants) ici.
 *   Ces warnings sont agrégés et affichés par la Section (HintList top).
 * - Conserve uniquement des aides locales (type MIME, preview).
 */

import { ImageSelector } from "@/components/admin/molecules/fields/ImageSelector";
import { useI18n } from "@/i18n/context";
import type { IdentitySettingsInput } from "@/schemas/site/identity/identity";

type FaviconFieldsProps = Readonly<{
  value: Pick<
    IdentitySettingsInput,
    "title" | "logoAlt" | "faviconLightUrl" | "faviconDarkUrl"
  >;
  disabled?: boolean;
  loading?: boolean;
  onPatch: <K extends keyof IdentitySettingsInput>(
    key: K,
    value: IdentitySettingsInput[K]
  ) => void;
  onUploadImage?: (file: File) => Promise<string>;
}>;

export function FaviconFields({
  value,
  disabled,
  loading,
  onPatch,
  onUploadImage,
}: FaviconFieldsProps) {
  const { t } = useI18n();
  const alt = value.logoAlt || value.title || "Favicon";
  const isBusy = !!(disabled || loading);

  const FAVICON_ACCEPT =
    "image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml";

  return (
    <fieldset aria-describedby="fav-help" className="grid gap-4">
      <legend className="text-sm font-medium opacity-90">
        {t("admin.identity.groups.favicons.legend")}
      </legend>

      <div className="grid gap-6 md:grid-cols-2">
        <ImageSelector
          id="identity-favicon-light-url"
          label={t("admin.identity.fields.faviconLight.label")}
          url={value.faviconLightUrl ?? ""}
          onUrlChange={(v) => onPatch("faviconLightUrl", v)}
          disabled={isBusy}
          loading={loading}
          previewAlt={alt}
          previewBg="light"
          accept={FAVICON_ACCEPT}
          onFileSelect={onUploadImage}
        />

        <ImageSelector
          id="identity-favicon-dark-url"
          label={t("admin.identity.fields.faviconDark.label")}
          url={value.faviconDarkUrl ?? ""}
          onUrlChange={(v) => onPatch("faviconDarkUrl", v)}
          disabled={isBusy}
          loading={loading}
          previewAlt={alt}
          previewBg="dark"
          accept={FAVICON_ACCEPT}
          onFileSelect={onUploadImage}
        />
      </div>

      <p id="fav-help" className="text-sm opacity-70">
        {t("admin.identity.groups.favicons.help")}
      </p>
    </fieldset>
  );
}
