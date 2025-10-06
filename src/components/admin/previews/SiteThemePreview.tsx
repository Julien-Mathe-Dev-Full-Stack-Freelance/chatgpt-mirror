"use client";

/**
 * @file src/components/admin/previews/SiteThemePreview.tsx
 * @intro Aperçu global du thème (header + footer)
 * @description
 * Combine les previews header/footer au sein du thème public sélectionné
 * pour donner un aperçu global de l’habillage du site.
 *
 * Accessibilité : nav désactivée, region encapsulée dans `PreviewPanel`.
 * Observabilité : aucune (agrège des hooks de preview).
 *
 * @layer ui/previews
 */

import { PreviewPanel } from "@/components/admin/molecules/panels/PreviewPanel";
// import { PublicFooter } from "@/components/public-site/layouts/PublicFooter";
// import { PublicHeader } from "@/components/public-site/layouts/PublicHeader";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import { useFooterPreview } from "@/hooks/admin/site/footer/useFooterPreview";
import { useHeaderPreview } from "@/hooks/admin/site/header/useHeaderPreview";
import { useIdentityLogoPreview } from "@/hooks/admin/site/identity/useIdentityLogoPreview";
import { useLegalMenuPreview } from "@/hooks/admin/site/legal-menu/useLegalMenuPreview";
import { usePrimaryMenuPreview } from "@/hooks/admin/site/primary-menu/usePrimaryMenuPreview";
import { useSocialPreview } from "@/hooks/admin/site/social/useSocialPreview";
import { useI18n } from "@/i18n/context";
import { PREVIEW_BLOCKS } from "@/infrastructure/ui/patterns";

export function SiteThemePreview({ settings }: { settings: ThemeSettingsDTO }) {
  const { t } = useI18n();
  const { settings: header } = useHeaderPreview(DEFAULT_CONTENT_STATE);
  const { settings: footer } = useFooterPreview(DEFAULT_CONTENT_STATE);

  const { settings: identity, loading: identityLoading } =
    useIdentityLogoPreview(DEFAULT_CONTENT_STATE);
  const { settings: menu, loading: menuLoading } = usePrimaryMenuPreview(
    DEFAULT_CONTENT_STATE
  );
  const { settings: social, loading: socialLoading } = useSocialPreview(
    DEFAULT_CONTENT_STATE
  );
  const { settings: legalMenu, loading: legalLoading } = useLegalMenuPreview(
    DEFAULT_CONTENT_STATE
  );

  return (
    <PreviewPanel
      theme={settings}
      themeClassName="rounded-lg overflow-hidden"
      label={t("admin.ui.preview.theme.label") || "Theme preview"}
    >
      {/* <PublicHeader
        settings={header}
        identity={identity}
        menu={menu}
        social={social}
        disableNav
        loading={identityLoading || menuLoading || socialLoading}
      /> */}
      <div className={PREVIEW_BLOCKS.spacerLg} aria-hidden />
      {/* <PublicFooter
        settings={footer}
        legalMenu={legalMenu}
        legalLoading={legalLoading}
        disableNav
        identityTitle={identity.title}
        identityLogoUrl={""}
      /> */}
    </PreviewPanel>
  );
}
SiteThemePreview.displayName = "SiteThemePreview";
