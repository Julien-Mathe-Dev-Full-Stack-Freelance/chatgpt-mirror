"use client";

/**
 * @file src/components/admin/sections/FooterSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { FooterForm } from "@/components/admin/organisms/forms/FooterForm";
import { FooterPreview } from "@/components/admin/previews/FooterPreview";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import type { FooterSettingsDTO } from "@/core/domain/site/dto";
import { useFooterSettings } from "@/hooks/admin/site/footer/useFooterSettings";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { adaptPatchKV } from "@/lib/patch";
import { useMemo } from "react";

export function FooterSection() {
  const { t } = useI18n();
  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useFooterSettings();

  // adaptateur: (key, val) -> patch({ [key]: val })
  const onPatchKV = useMemo(
    () => adaptPatchKV<FooterSettingsDTO>(patch),
    [patch]
  );

  return (
    <section
      aria-labelledby="footer-title"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="footer-title" as="h3" visuallyHidden>
        {t("admin.footer.title")}
      </Heading>

      <FooterForm
        value={settings}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onPatch={onPatchKV}
        onReset={reset}
        onSubmit={() => void save(DEFAULT_CONTENT_STATE)}
      />

      <Separator />

      <FooterPreview settings={settings} />
    </section>
  );
}
FooterSection.displayName = "FooterSection";
