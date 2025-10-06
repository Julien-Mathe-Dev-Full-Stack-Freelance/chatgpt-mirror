"use client";

/**
 * @file src/components/admin/previews/HeaderPreview.tsx
 * @intro Aperçu du header public (identité + menus + social)
 * @description
 * Monte le header public dans un cadre thémé afin d’apercevoir l’en-tête
 * tel qu’il apparaîtrait sur le site (sans navigation active).
 *
 * Accessibilité : désactive la navigation et propage l’état `loading`.
 * Observabilité : aucune (agrège les hooks de preview).
 *
 * @layer ui/previews
 */

import { PreviewPanel } from "@/components/admin/molecules/panels/PreviewPanel";
// import { PublicHeader } from "@/components/public-site/layouts/PublicHeader";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import type { HeaderSettingsDTO } from "@/core/domain/site/dto";
import { useIdentityLogoPreview } from "@/hooks/admin/site/identity/useIdentityLogoPreview";
import { usePrimaryMenuPreview } from "@/hooks/admin/site/primary-menu/usePrimaryMenuPreview";
import { useSocialPreview } from "@/hooks/admin/site/social/useSocialPreview";
import { useThemePreview } from "@/hooks/admin/site/theme/useThemePreview";
import { useI18n } from "@/i18n/context";
import { PREVIEW_BLOCKS } from "@/infrastructure/ui/patterns";

type HeaderPreviewProps = { settings: HeaderSettingsDTO };

export function HeaderPreview({ settings }: HeaderPreviewProps) {
  const { t } = useI18n();
  const { settings: identity, loading: identityLoading } =
    useIdentityLogoPreview(DEFAULT_CONTENT_STATE);
  const { settings: menu, loading: menuLoading } = usePrimaryMenuPreview(
    DEFAULT_CONTENT_STATE
  );
  const { settings: social, loading: socialLoading } = useSocialPreview(
    DEFAULT_CONTENT_STATE
  );
  const { settings: theme } = useThemePreview(DEFAULT_CONTENT_STATE);

  return (
    <PreviewPanel
      theme={theme}
      themeClassName="rounded-lg overflow-hidden"
      label={t("admin.ui.preview.header.label") || "Header preview"}
    >
      {/* <PublicHeader
        settings={settings}
        identity={identity as IdentitySettingsDTO}
        menu={menu as PrimaryMenuSettingsDTO}
        social={social as SocialSettingsDTO}
        disableNav
        loading={identityLoading || menuLoading || socialLoading}
      /> */}

      {/* Contenu factice sous le header — décoratif */}
      <div className={PREVIEW_BLOCKS.spacerSm} aria-hidden />
    </PreviewPanel>
  );
}
HeaderPreview.displayName = "HeaderPreview";
