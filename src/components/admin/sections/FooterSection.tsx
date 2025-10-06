"use client";

/**
 * @file src/components/admin/sections/FooterSection.tsx
 * @intro Section Footer — warnings (non-bloquants) + confirmation de save
 * @layer ui/sections
 */

import { useCallback, useMemo } from "react";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import { FooterForm } from "@/components/admin/organisms/forms/FooterForm";
import { FooterPreview } from "@/components/admin/previews/FooterPreview";
import { Separator } from "@/components/ui/separator";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { useFooterSettings } from "@/hooks/admin/site/footer/useFooterSettings";
import {
  useFooterUiWarnings,
  type FooterWarningKey,
} from "@/hooks/admin/site/footer/validate";

import { useConfirmList } from "@/hooks/_shared/useConfirmList";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { adaptPatchKV } from "@/lib/patch";
import type { FooterSettingsInput } from "@/schemas/site/footer/footer";

export function FooterSection() {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useFooterSettings();

  const onPatchKV = useMemo(
    () => adaptPatchKV<FooterSettingsInput>(patch),
    [patch]
  );

  // warnings live
  const warningKeys = useFooterUiWarnings({
    copyright: settings.copyright,
    showYear: settings.showYear,
  });

  const warningHints = useMemo(
    () =>
      warningKeys.map((k: FooterWarningKey) => t(`admin.footer.hints.${k}`)),
    [warningKeys, t]
  );

  const handleSubmit = useCallback(async () => {
    // confirmation si warnings
    const filteredWarnings = initialLoading ? [] : warningHints;
    if (filteredWarnings.length > 0) {
      const ok = await confirmList({
        title: t("admin.footer.hints.title"),
        intro: t("admin.header.confirm.warn.desc"), // ou une clé dédiée si tu préfères
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
      if (isValidationError(e)) {
        notify.error(t("admin.footer.errors.form.invalid"));
        return;
      }
      if (isHttpError(e)) {
        notify.fromError(e);
        return;
      }
      notify.error(t("admin.footer.errors.form.invalid"));
    }
  }, [initialLoading, warningHints, confirmList, save, t]);

  return (
    <section
      aria-labelledby="footer-title"
      aria-describedby="footer-desc"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="footer-title" as="h3" visuallyHidden>
        {t("admin.footer.title")}
      </Heading>
      <p id="footer-desc" className={ATOM.srOnly}>
        {t("admin.footer.desc")}
      </p>

      {/* Warnings (non-bloquants) */}
      {!initialLoading && warningHints.length > 0 && (
        <HintList
          variant="warning"
          title={t("admin.footer.hints.title")}
          hints={warningHints}
          dense
          className="mb-3"
        />
      )}

      <FooterForm
        value={settings}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onPatch={onPatchKV}
        onReset={reset}
        onSubmit={handleSubmit}
      />

      <Separator />

      <FooterPreview settings={settings} />
    </section>
  );
}
FooterSection.displayName = "FooterSection";
