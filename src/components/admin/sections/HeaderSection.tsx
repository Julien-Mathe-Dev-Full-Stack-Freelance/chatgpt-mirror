"use client";
/**
 * @file src/components/admin/sections/HeaderSection.tsx
 * @intro Section Header — warnings (non-bloquants) + confirmation de save
 * @layer ui/sections
 */

import { useCallback, useMemo } from "react";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import { HeaderForm } from "@/components/admin/organisms/forms/HeaderForm";
import { HeaderPreview } from "@/components/admin/previews/HeaderPreview";
import { Separator } from "@/components/ui/separator";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import type { HeaderSettingsDTO } from "@/core/domain/site/dto";

import { useHeaderSettings } from "@/hooks/admin/site/header/useHeaderSettings";
import {
  useHeaderUiWarnings,
  type HeaderWarningKey,
} from "@/hooks/admin/site/header/validate";

import { useConfirmList } from "@/hooks/_shared/useConfirmList";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { adaptPatchKV } from "@/lib/patch";

export function HeaderSection() {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useHeaderSettings();

  // adaptateur: (key, val) -> patch({ [key]: val })
  const onPatchKV = useMemo(
    () => adaptPatchKV<HeaderSettingsDTO>(patch),
    [patch]
  );

  /* ── Warnings live (non-bloquants) ── */
  const warningKeys = useHeaderUiWarnings({
    showLogo: settings.showLogo,
    showTitle: settings.showTitle,
  });

  const warningHints = useMemo(
    () =>
      warningKeys.map((k: HeaderWarningKey) => t(`admin.header.hints.${k}`)),
    [warningKeys, t]
  );

  /* ── Submit ── */
  const handleSubmit = useCallback(async () => {
    // Confirmation si warnings présents (et pas pendant le loading initial)
    const filteredWarnings = initialLoading ? [] : warningHints;
    if (filteredWarnings.length > 0) {
      const ok = await confirmList({
        title: t("admin.header.confirm.warn.title"),
        intro: t("admin.header.confirm.warn.desc"),
        items: filteredWarnings,
        confirmLabel: t("admin.actions.continueSave"),
        cancelLabel: t("admin.actions.cancel"),
        requireAckLabel: t("admin.actions.acknowledge"),
        tone: "default",
      });
      if (!ok) return;
    }

    try {
      await save(DEFAULT_CONTENT_STATE);
    } catch (e: unknown) {
      // Pas d’erreurs UI blocantes attendues, mais on garde le mapping standard
      if (isValidationError(e)) {
        notify.error(t("admin.header.errors.form.invalid"));
        return;
      }
      if (isHttpError(e)) {
        notify.fromError(e);
        return;
      }
      notify.error(t("admin.header.errors.form.invalid"));
    }
  }, [initialLoading, warningHints, confirmList, save, t]);

  return (
    <section
      aria-labelledby="header-title"
      aria-describedby="header-desc"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="header-title" as="h3" visuallyHidden>
        {t("admin.header.title")}
      </Heading>
      <p id="header-desc" className={ATOM.srOnly}>
        {t("admin.header.desc")}
      </p>

      {/* Warnings (non-bloquants) */}
      {!initialLoading && warningHints.length > 0 && (
        <HintList
          variant="warning"
          title={t("admin.header.hints.title")}
          hints={warningHints}
          dense
          className="mb-3"
        />
      )}

      <HeaderForm
        value={settings}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onPatch={onPatchKV}
        onReset={reset}
        onSubmit={handleSubmit}
      />

      <Separator />

      <HeaderPreview settings={settings} />
    </section>
  );
}
HeaderSection.displayName = "HeaderSection";
