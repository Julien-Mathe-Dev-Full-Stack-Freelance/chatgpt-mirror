"use client";

/**
 * @file src/components/admin/sections/LegalMenuSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { LegalMenuForm } from "@/components/admin/organisms/forms/LegalMenuForm";
import { MenuPreview } from "@/components/admin/previews/MenuPreview";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import { useLegalMenuSettings } from "@/hooks/admin/site/legal-menu/useLegalMenuSettings";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function LegalMenuSection() {
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
  } = useLegalMenuSettings();

  return (
    <section
      aria-labelledby="legal-menu-title"
      aria-describedby="legal-menu-desc"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading as="h3" id="legal-menu-title">
        {t("admin.legal.title")}
      </Heading>
      <p id="legal-menu-desc" className={ATOM.srOnly}>
        {t("admin.legal.desc")}
      </p>

      <LegalMenuForm
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
        idPrefix="lm"
        skeletonCount={2}
      />

      <Separator />

      <MenuPreview settings={settings} />
    </section>
  );
}
LegalMenuSection.displayName = "LegalMenuSection";
