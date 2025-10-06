"use client";

/**
 * @file src/components/admin/sections/SocialSection.tsx
 * @intro Section Social — warnings (non-bloquants) + confirmation de save (alignée sur Legal/Primary)
 * @layer ui/sections
 */

import { useCallback, useMemo } from "react";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import { SocialForm } from "@/components/admin/organisms/forms/SocialForm";
import { Separator } from "@/components/ui/separator";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { useConfirmList } from "@/hooks/_shared/useConfirmList";
import { useSocialSettings } from "@/hooks/admin/site/social/useSocialSettings";
import {
  useSocialUiWarnings,
  type SocialWarningKey,
} from "@/hooks/admin/site/social/validate";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { adaptPatchKV } from "@/lib/patch"; // ⬅️ ajout

import {
  DEFAULT_SOCIAL_HREF,
  DEFAULT_SOCIAL_KIND,
} from "@/core/domain/site/social/constants";
import type {
  SocialItemInput,
  SocialSettingsInput,
} from "@/schemas/site/social/social"; // ⬅️ SocialSettingsInput pour typer adaptPatchKV

export function SocialSection() {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useSocialSettings();

  // ⬅️ homogène avec les autres sections
  const onPatchKV = useMemo(
    () => adaptPatchKV<SocialSettingsInput>(patch),
    [patch]
  );

  /* ── Warnings live (non-bloquants) ── */
  const warningKeys = useSocialUiWarnings({ items: settings.items ?? [] });
  const warningHints = useMemo(
    () =>
      warningKeys.map((k: SocialWarningKey) => t(`admin.social.hints.${k}`)),
    [warningKeys, t]
  );

  /* ─────────────── Callbacks d’édition (liste d’items) ─────────────── */
  const makeDefaultItem = useCallback(
    (): SocialItemInput => ({
      kind: DEFAULT_SOCIAL_KIND,
      href: DEFAULT_SOCIAL_HREF, // ex. "https://" ou "mailto:" selon ton placeholder
    }),
    []
  );

  const onAdd = useCallback(
    (index?: number) => {
      const items = [...(settings.items ?? [])];
      const next = makeDefaultItem();
      if (typeof index === "number" && index >= 0 && index <= items.length) {
        items.splice(index, 0, next);
      } else {
        items.push(next);
      }
      onPatchKV("items", items); // ⬅️ au lieu de patch({ items })
    },
    [settings.items, onPatchKV, makeDefaultItem]
  );

  const onUpdate = useCallback(
    (index: number, partial: Partial<SocialItemInput>) => {
      const items = [...(settings.items ?? [])];
      const curr = items[index];
      if (!curr) return;

      const next: SocialItemInput = { ...curr, ...partial };
      items[index] = next;
      onPatchKV("items", items); // ⬅️
    },
    [settings.items, onPatchKV]
  );

  const onRemove = useCallback(
    (i: number) => {
      const items = [...(settings.items ?? [])];
      if (i < 0 || i >= items.length) return;
      items.splice(i, 1);
      onPatchKV("items", items); // ⬅️
    },
    [settings.items, onPatchKV]
  );

  const onMove = useCallback(
    (from: number, to: number) => {
      const items = [...(settings.items ?? [])];
      if (
        from < 0 ||
        from >= items.length ||
        to < 0 ||
        to >= items.length ||
        from === to
      )
        return;
      const [it] = items.splice(from, 1);
      items.splice(to, 0, it);
      onPatchKV("items", items); // ⬅️
    },
    [settings.items, onPatchKV]
  );

  /* ─────────────── Submit ─────────────── */

  const handleSubmit = useCallback(async () => {
    const filteredWarnings = initialLoading ? [] : warningHints;

    if (filteredWarnings.length > 0) {
      const ok = await confirmList({
        title: t("admin.social.confirm.warn.title"),
        intro: t("admin.social.confirm.warn.desc"),
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
        notify.error(t("admin.social.errors.form.invalid"));
        return;
      }
      if (isHttpError(e)) {
        notify.fromError(e);
        return;
      }
      notify.error(t("admin.social.errors.form.invalid"));
    }
  }, [initialLoading, warningHints, confirmList, save, t]);

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

      {/* Warnings (non-bloquants) */}
      {!initialLoading && warningHints.length > 0 && (
        <HintList
          variant="warning"
          title={t("admin.social.hints.title")}
          hints={warningHints}
          dense
          className="mb-3"
        />
      )}

      <SocialForm
        items={settings.items}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onMove={onMove}
        onReset={reset}
        onSubmit={handleSubmit}
        idPrefix="soc"
        skeletonCount={2}
      />

      <Separator />

      {/*<SocialPreview settings={settings} />*/}
    </section>
  );
}
SocialSection.displayName = "SocialSection";
