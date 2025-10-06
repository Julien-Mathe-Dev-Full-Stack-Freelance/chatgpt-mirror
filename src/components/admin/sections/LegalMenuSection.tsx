"use client";

/**
 * @file src/components/admin/sections/LegalMenuSection.tsx
 * @intro Section menu légal — erreurs (blocantes) + warnings (non-bloquants) harmonisés
 */

import { useCallback, useMemo, useState } from "react";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import { LegalMenuForm } from "@/components/admin/organisms/forms/LegalMenuForm";
import { MenuPreview } from "@/components/admin/previews/MenuPreview";
import { Separator } from "@/components/ui/separator";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { useLegalMenuSettings } from "@/hooks/admin/site/legal-menu/useLegalMenuSettings";

import {
  useLegalMenuUiWarnings,
  validateLegalMenuUi,
  type LegalMenuUiErrors,
  type LegalMenuWarningKey,
} from "@/hooks/admin/site/legal-menu/validate";

import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { adaptPatchKV } from "@/lib/patch"; // ⬅️ homogénéisation

import {
  extractFirstLevelFieldPaths,
  mapZodPathsToFieldErrors,
} from "@/hooks/_shared/forms";
import { useConfirmList } from "@/hooks/_shared/useConfirmList";

import type {
  LegalMenuItemInput,
  LegalMenuSettingsInput, // ⬅️ pour typer adaptPatchKV
} from "@/schemas/site/legal-menu/legal-menu";

export function LegalMenuSection() {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useLegalMenuSettings();

  // ⬅️ adaptateur KV comme dans Identity/Footer/Header
  const onPatchKV = useMemo(
    () => adaptPatchKV<LegalMenuSettingsInput>(patch),
    [patch]
  );

  /* ── Erreurs UI blocantes (pour submit / toast) ── */
  const [uiErrors, setUiErrors] = useState<LegalMenuUiErrors>({});

  /* ── “Touched” par item → on n’affiche qu’après blur ── */
  const [touchedLabel, setTouchedLabel] = useState<Set<number>>(
    () => new Set()
  );
  const [touchedHref, setTouchedHref] = useState<Set<number>>(() => new Set());

  const touchLabel = useCallback((i: number) => {
    setTouchedLabel((prev) => new Set(prev).add(i));
  }, []);
  const touchHref = useCallback((i: number) => {
    setTouchedHref((prev) => new Set(prev).add(i));
  }, []);

  /* ── Warnings live (non-bloquants) ── */
  const warningKeys = useLegalMenuUiWarnings({ items: settings.items ?? [] });
  const warningHints = useMemo(
    () =>
      warningKeys.map((k: LegalMenuWarningKey) => t(`admin.menu.hints.${k}`)),
    [warningKeys, t]
  );

  /* ── Hints d’erreur (uniquement si touched) ── */
  const errorHints = useMemo(() => {
    const arr: string[] = [];
    const items = settings.items ?? [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const idx = i + 1;
      if (touchedLabel.has(i) && !it.label.trim()) {
        arr.push(t("admin.menu.errors.item.label.required", { index: idx }));
      }
      if (touchedHref.has(i) && !it.href.trim()) {
        arr.push(t("admin.menu.errors.item.href.required", { index: idx }));
      }
    }
    return Array.from(new Set(arr));
  }, [settings.items, touchedLabel, touchedHref, t]);

  /* ─────────────────────────── Callbacks d’édition ─────────────────────────── */

  const makeDefaultItem = useCallback(
    (): LegalMenuItemInput => ({
      label: "",
      href: "/",
      newTab: false,
      isExternal: false,
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
      // patch({ items }) -> homogénéisé :
      onPatchKV("items", items);
      if (uiErrors.at != null) setUiErrors({});
      setTouchedLabel(new Set());
      setTouchedHref(new Set());
    },
    [settings.items, onPatchKV, makeDefaultItem, uiErrors.at]
  );

  const onUpdate = useCallback(
    (index: number, partial: Partial<LegalMenuItemInput>) => {
      const items = [...(settings.items ?? [])];
      const curr = items[index];
      if (!curr) return;

      const next: LegalMenuItemInput = { ...curr, ...partial };
      items[index] = next;
      onPatchKV("items", items);

      if (uiErrors.items && uiErrors.at === index) {
        if (next.label.trim() && next.href.trim()) {
          setUiErrors({});
        }
      }
    },
    [settings.items, onPatchKV, uiErrors.items, uiErrors.at]
  );

  const reindexTouched = (set: Set<number>, removed: number) => {
    const next = new Set<number>();
    set.forEach((i) => {
      if (i < removed) next.add(i);
      else if (i > removed) next.add(i - 1);
    });
    return next;
  };

  const onRemove = useCallback(
    (index: number) => {
      const items = [...(settings.items ?? [])];
      if (index < 0 || index >= items.length) return;
      items.splice(index, 1);
      onPatchKV("items", items);

      // reindex touched
      setTouchedLabel((prev) => reindexTouched(prev, index));
      setTouchedHref((prev) => reindexTouched(prev, index));

      // reindex uiErrors.at si nécessaire
      setUiErrors((prev) => {
        if (!prev.items || prev.at == null) return {};
        if (prev.at === index) return {};
        if (prev.at > index) return { items: "required", at: prev.at - 1 };
        return prev;
      });
    },
    [settings.items, onPatchKV]
  );

  const reindexOnMove = (set: Set<number>, from: number, to: number) => {
    const next = new Set<number>();
    set.forEach((i) => {
      if (i === from) next.add(to);
      else if (from < to && i > from && i <= to) next.add(i - 1);
      else if (from > to && i >= to && i < from) next.add(i + 1);
      else next.add(i);
    });
    return next;
  };

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
      onPatchKV("items", items);

      setTouchedLabel((prev) => reindexOnMove(prev, from, to));
      setTouchedHref((prev) => reindexOnMove(prev, from, to));

      if (uiErrors.items && typeof uiErrors.at === "number") {
        setUiErrors({ items: "required", at: to });
      }
    },
    [settings.items, onPatchKV, uiErrors.items, uiErrors.at]
  );
  /* ── Flags invalid par item (pour border rouge après blur) ── */
  const invalidFlags = useMemo(
    () =>
      (settings.items ?? []).map((it, i) => ({
        label: !initialLoading && touchedLabel.has(i) && !it.label.trim(),
        href: !initialLoading && touchedHref.has(i) && !it.href.trim(),
      })),
    [settings.items, touchedLabel, touchedHref, initialLoading]
  );

  /* ─────────────────────────── Submit ─────────────────────────── */

  const handleSubmit = useCallback(async () => {
    const uiErr = validateLegalMenuUi(settings.items ?? []);
    if (uiErr.items) {
      setUiErrors(uiErr);
      if (typeof uiErr.at === "number") {
        touchLabel(uiErr.at);
        touchHref(uiErr.at);
      }
      notify.error(t("admin.menu.errors.form.invalid"));
      return;
    }

    const filteredWarnings = initialLoading ? [] : warningHints;

    if (filteredWarnings.length > 0) {
      const ok = await confirmList({
        title: t("admin.menu.confirm.warn.title"),
        intro: t("admin.menu.confirm.warn.desc"),
        items: filteredWarnings,
        confirmLabel: t("admin.actions.continueSave"),
        cancelLabel: t("admin.actions.cancel"),
        requireAckLabel: t("admin.actions.acknowledge"),
        tone: "default",
      });
      if (!ok) return;
    }

    try {
      setUiErrors({});
      await save(DEFAULT_CONTENT_STATE);
    } catch (e: unknown) {
      if (isValidationError(e)) {
        const paths = extractFirstLevelFieldPaths(e.body);
        const fieldErrors = mapZodPathsToFieldErrors(paths, t, {
          items: "admin.menu.errors.form.invalid",
        });
        if (fieldErrors["items"]) {
          setUiErrors({ items: "required", at: 0 });
          touchLabel(0);
          touchHref(0);
          notify.error(t("admin.menu.errors.form.invalid"));
          return;
        }
      }
      if (isHttpError(e)) {
        notify.fromError(e);
        return;
      }
      notify.error(t("admin.menu.errors.form.invalid"));
    }
  }, [
    settings.items,
    initialLoading,
    warningHints,
    confirmList,
    save,
    t,
    touchLabel,
    touchHref,
  ]);

  return (
    <section
      aria-labelledby="legal-menu-title"
      aria-describedby="legal-menu-desc"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading as="h3" id="legal-menu-title">
        {t("admin.menu.legal.title")}
      </Heading>
      <p id="legal-menu-desc" className={ATOM.srOnly}>
        {t("admin.menu.legal.desc")}
      </p>

      {/* Erreurs blocantes (uniquement si des champs touchés sont invalides) */}
      {!initialLoading && errorHints.length > 0 && (
        <HintList
          hints={errorHints}
          title={t("admin.menu.errors.form.invalid")}
          variant="error"
          dense
          className="mb-3"
        />
      )}

      {/* Warnings */}
      {!initialLoading && warningHints.length > 0 && (
        <HintList
          hints={warningHints}
          title={t("admin.menu.hints.title")}
          variant="warning"
          dense
          className="mb-3"
        />
      )}

      <LegalMenuForm
        items={settings.items}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onMove={onMove}
        onReset={() => {
          setTouchedLabel(new Set());
          setTouchedHref(new Set());
          reset();
        }}
        onSubmit={handleSubmit}
        idPrefix="lm"
        skeletonCount={2}
        invalid={invalidFlags}
        onLabelBlur={touchLabel}
        onHrefBlur={touchHref}
      />

      <Separator />

      <MenuPreview settings={settings} />
    </section>
  );
}
LegalMenuSection.displayName = "LegalMenuSection";
