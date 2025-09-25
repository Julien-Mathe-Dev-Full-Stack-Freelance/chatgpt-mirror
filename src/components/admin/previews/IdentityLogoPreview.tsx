"use client";

/**
 * @file src/components/admin/previews/IdentityLogoPreview.tsx
 * @intro Aperçu du bloc identité (logo + titre)
 * @description
 * Représente visuellement le logo et le titre publics utilisés par le site.
 * Utilisé dans l’admin pour vérifier l’identité sans navigation.
 *
 * Accessibilité : texte fallback + placeholder lorsque le logo manque.
 * Observabilité : aucune (stateless).
 *
 * @layer ui/previews
 */

import Image from "next/image";

import { PreviewPanel } from "@/components/admin/molecules/panels/PreviewPanel";
import { useI18n } from "@/i18n/context";
import type { IdentitySettingsDTO } from "@/core/domain/site/dto";

export type IdentityLogoPreviewProps = { settings: IdentitySettingsDTO };

export function IdentityLogoPreview({ settings }: IdentityLogoPreviewProps) {
  const { t } = useI18n();
  const logoUrl = settings.logoUrl;

  return (
    <PreviewPanel
      label={t("admin.ui.preview.identity.label") || "Identity preview"}
    >
      <div className="inline-flex items-center gap-3">
        {logoUrl ? (
          <div className="relative h-8 w-8 overflow-hidden rounded">
            <Image
              src={logoUrl}
              alt={t("ui.preview.identity.logoAlt")}
              fill
              sizes="32px"
              className="object-contain"
              priority={false}
            />
          </div>
        ) : (
          <div
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground"
          >
            {t("ui.preview.identity.placeholder")}
          </div>
        )}

        <span className="text-base font-semibold leading-none">
          {settings.title || t("ui.preview.identity.defaultTitle")}
        </span>
      </div>
    </PreviewPanel>
  );
}
IdentityLogoPreview.displayName = "IdentityLogoPreview";
