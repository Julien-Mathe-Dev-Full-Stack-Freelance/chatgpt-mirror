"use client";

/**
 * @file src/components/admin/sections/SocialSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { SocialForm } from "@/components/admin/organisms/forms/SocialForm";
import { SocialPreview } from "@/components/admin/previews/SocialPreview";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import { useSocialSettings } from "@/hooks/admin/site/social/useSocialSettings";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function SocialSection() {
  const { t } = useI18n();
  const {
    settings,
    initialLoading,
    saving,
    isDirty,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    reset,
    save,
  } = useSocialSettings();

  return (
    <section
      aria-labelledby="social-title"
      aria-describedby="social-desc"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="social-title" as="h3" visuallyHidden>
        {t("admin.social.title")}
      </Heading>
      <p id="social-desc" className={ATOM.srOnly}>
        {t("admin.social.desc")}
      </p>

      <SocialForm
        items={settings.items}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onAdd={addItem}
        onUpdate={updateItem}
        onRemove={removeItem}
        onMove={moveItem}
        onReset={reset}
        onSubmit={() => void save(DEFAULT_CONTENT_STATE)}
        idPrefix="soc"
        skeletonCount={2}
      />

      <Separator />

      <SocialPreview settings={settings} />
    </section>
  );
}
SocialSection.displayName = "SocialSection";
