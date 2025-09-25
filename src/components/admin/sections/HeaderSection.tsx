"use client";

/**
 * @file src/components/admin/sections/HeaderSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { HeaderForm } from "@/components/admin/organisms/forms/HeaderForm";
import { HeaderPreview } from "@/components/admin/previews/HeaderPreview";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import type { HeaderSettingsDTO } from "@/core/domain/site/dto";
import { useHeaderSettings } from "@/hooks/admin/site/header/useHeaderSettings";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { adaptPatchKV } from "@/lib/patch";
import { useMemo } from "react";

export function HeaderSection() {
  const { t } = useI18n();
  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useHeaderSettings();

  // adaptateur: (key, val) -> patch({ [key]: val })
  const onPatchKV = useMemo(
    () => adaptPatchKV<HeaderSettingsDTO>(patch),
    [patch]
  );

  return (
    <section
      aria-labelledby="header-title"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="header-title" as="h3" visuallyHidden>
        {t("admin.header.title")}
      </Heading>

      <HeaderForm
        value={settings}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onPatch={onPatchKV}
        onReset={reset}
        onSubmit={() => void save(DEFAULT_CONTENT_STATE)}
      />

      <Separator />

      <HeaderPreview settings={settings} />
    </section>
  );
}
HeaderSection.displayName = "HeaderSection";
