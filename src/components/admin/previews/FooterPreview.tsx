"use client";

/**
 * @file src/components/admin/previews/FooterPreview.tsx
 * @intro Aperçu du footer public (liens légaux + identité)
 * @description
 * Affiche le footer public dans un cadre de preview avec neutralisation des
 * liens et affichage des informations d’identité/menus légaux.
 *
 * Accessibilité : navigation désactivée, preview encapsulée dans `PreviewPanel`.
 * Observabilité : aucune (lecture seule).
 *
 * @layer ui/previews
 */

import { PreviewPanel } from "@/components/admin/molecules/panels/PreviewPanel";
// import { PublicFooter } from "@/components/public-site/layouts/PublicFooter";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import type { FooterSettingsDTO } from "@/core/domain/site/dto";
import { useIdentityLogoPreview } from "@/hooks/admin/site/identity/useIdentityLogoPreview";
import { useLegalMenuPreview } from "@/hooks/admin/site/legal-menu/useLegalMenuPreview";
import { useThemePreview } from "@/hooks/admin/site/theme/useThemePreview";
import { useI18n } from "@/i18n/context";
import { PREVIEW_BLOCKS } from "@/infrastructure/ui/patterns";

type FooterPreviewProps = { settings: FooterSettingsDTO };

export function FooterPreview({ settings }: FooterPreviewProps) {
  const { t } = useI18n();
  // GET-only (draft) pour un rendu fidèle
  const { settings: legalMenu, loading: legalLoading } = useLegalMenuPreview(
    DEFAULT_CONTENT_STATE
  );
  const { settings: theme } = useThemePreview(DEFAULT_CONTENT_STATE);
  const { settings: identity } = useIdentityLogoPreview(DEFAULT_CONTENT_STATE);

  return (
    <PreviewPanel
      label={t("admin.ui.preview.footer.label") || "Footer preview"}
      theme={theme}
      themeClassName="rounded-lg overflow-hidden"
    >
      {/* Bloc factice pour situer le footer — décoratif */}
      <div className={PREVIEW_BLOCKS.spacerSm} aria-hidden />

      {/* <PublicFooter
        settings={settings}
        legalMenu={legalMenu}
        legalLoading={legalLoading}
        disableNav
        identityTitle={identity.title}
        identityLogoUrl={""}
      /> */}
    </PreviewPanel>
  );
}
FooterPreview.displayName = "FooterPreview";
