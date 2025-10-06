"use client";

/**
 * @file src/components/admin/sections/OverviewThemeSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { CardBox } from "@/components/admin/molecules/cards/CardBox";
import { ThemeForm } from "@/components/admin/organisms/forms/ThemeForm";
import { SiteThemePreview } from "@/components/admin/previews/SiteThemePreview";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import { useThemeSettings } from "@/hooks/admin/site/theme/useThemeSettings";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { adaptPatchKV } from "@/lib/patch";
import { useMemo } from "react";

export function OverviewThemeSection() {
  const { t } = useI18n();
  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useThemeSettings();

  // adaptateur: (key, val) -> patch({ [key]: val })
  const onPatchKV = useMemo(
    () => adaptPatchKV<ThemeSettingsDTO>(patch),
    [patch]
  );

  return (
    <section
      aria-labelledby="theme-overview-title"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="theme-overview-title" as="h3" visuallyHidden>
        {t("admin.theme.overview.title")}
      </Heading>

      <CardBox
        title={t("admin.theme.card.title")}
        description={t("admin.theme.card.desc")}
      >
        <ThemeForm
          value={settings}
          loading={initialLoading}
          saving={saving}
          isDirty={isDirty}
          onPatch={onPatchKV}
          onReset={reset}
          onSubmit={() => void save(DEFAULT_CONTENT_STATE)}
        />
      </CardBox>

      <Separator />

      <SiteThemePreview settings={settings} />
    </section>
  );
}
OverviewThemeSection.displayName = "OverviewThemeSection";
