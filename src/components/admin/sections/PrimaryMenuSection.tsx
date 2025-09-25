"use client";

/**
 * @file src/components/admin/sections/PrimaryMenuSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { MenuPreview } from "@/components/admin/previews/MenuPreview";
import { usePrimaryMenuSettings } from "@/hooks/admin/site/primary-menu/usePrimaryMenuSettings";
import { PrimaryMenuForm } from "@/components/admin/organisms/forms/PrimaryMenuForm";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

export function PrimaryMenuSection() {
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
  } = usePrimaryMenuSettings();

  return (
    <section
      aria-labelledby="primary-menu-title"
      aria-describedby="primary-menu-desc"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading as="h3" id="primary-menu-title">
        {t("admin.menu.primary.title")}
      </Heading>
      <p id="primary-menu-desc" className={ATOM.srOnly}>
        {t("admin.menu.primary.desc")}
      </p>

      <PrimaryMenuForm
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
        idPrefix="pm"
        skeletonCount={3}
      />

      <Separator />

      <MenuPreview settings={settings} />
    </section>
  );
}
PrimaryMenuSection.displayName = "PrimaryMenuSection";
