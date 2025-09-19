"use client";

/**
 * @file src/components/admin/sections/IdentitySection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { IdentityForm } from "@/components/admin/organisms/forms/IdentityForm";
import { IdentityLogoPreview } from "@/components/admin/previews/IdentityLogoPreview";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import type { IdentitySettingsDTO } from "@/core/domain/site/dto";
import { useIdentitySettings } from "@/hooks/admin/site/identity/useIdentitySettings";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { adaptPatchKV } from "@/lib/patch";
import { useMemo } from "react";

export function IdentitySection() {
  const { t } = useI18n();
  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useIdentitySettings();

  // adaptateur: (key, val) -> patch({ [key]: val })
  const onPatchKV = useMemo(
    () => adaptPatchKV<IdentitySettingsDTO>(patch),
    [patch]
  );

  return (
    <section
      aria-labelledby="identity-title"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="identity-title" as="h3" visuallyHidden>
        {t("admin.identity.title")}
      </Heading>

      <IdentityForm
        value={settings}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onPatch={onPatchKV}
        onReset={reset}
        onSubmit={() => void save(DEFAULT_CONTENT_STATE)}
      />

      <Separator />

      <IdentityLogoPreview settings={settings} />
    </section>
  );
}
IdentitySection.displayName = "IdentitySection";
