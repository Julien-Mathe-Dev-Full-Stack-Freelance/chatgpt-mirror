"use client";

/**
 * @file src/components/admin/sections/PrimaryMenuSection.tsx
 * @intro Section menu principal — erreurs (blocantes) + warnings (non-bloquants) harmonisés
 */

import { useCallback, useMemo, useState } from "react";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import { PrimaryMenuForm } from "@/components/admin/organisms/forms/PrimaryMenuForm";
import { MenuPreview } from "@/components/admin/previews/MenuPreview";
import { Separator } from "@/components/ui/separator";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { usePrimaryMenuSettings } from "@/hooks/admin/site/primary-menu/usePrimaryMenuSettings";
import {
  usePrimaryMenuUiWarnings,
  validatePrimaryMenuUi,
  type PrimaryMenuUiErrors,
  type PrimaryMenuWarningKey,
} from "@/hooks/admin/site/primary-menu/validate";

import {
  extractFirstLevelFieldPaths,
  mapZodPathsToFieldErrors,
} from "@/hooks/_shared/forms";
import { useConfirmList } from "@/hooks/_shared/useConfirmList";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { adaptPatchKV } from "@/lib/patch"; // ⬅️ ajout

import type {
  PrimaryMenuItemChildInput,
  PrimaryMenuItemInput,
  PrimaryMenuSettingsInput, // ⬅️ pour typer adaptPatchKV
} from "@/schemas/site/primary-menu/primary-menu";

export function PrimaryMenuSection() {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    usePrimaryMenuSettings();

  // ⬅️ adaptateur KV (homogène avec les autres sections)
  const onPatchKV = useMemo(
    () => adaptPatchKV<PrimaryMenuSettingsInput>(patch),
    [patch]
  );

  const [uiErrors, setUiErrors] = useState<PrimaryMenuUiErrors>({
    kind: "none",
  });

  /* ── Touched (parents + enfants) ── */
  const [touchedParentLabel, setTouchedParentLabel] = useState<Set<number>>(
    () => new Set()
  );
  const [touchedParentHref, setTouchedParentHref] = useState<Set<number>>(
    () => new Set()
  );

  const [touchedChildLabel, setTouchedChildLabel] = useState<
    Map<number, Set<number>>
  >(() => new Map());
  const [touchedChildHref, setTouchedChildHref] = useState<
    Map<number, Set<number>>
  >(() => new Map());

  const touchParentLabel = useCallback((i: number) => {
    setTouchedParentLabel((prev) => new Set(prev).add(i));
  }, []);
  const touchParentHref = useCallback((i: number) => {
    setTouchedParentHref((prev) => new Set(prev).add(i));
  }, []);
  const touchChildLabel = useCallback((pi: number, ci: number) => {
    setTouchedChildLabel((prev) => {
      const m = new Map(prev);
      const s = new Set<number>(m.get(pi) ?? new Set<number>());
      s.add(ci);
      m.set(pi, s);
      return m;
    });
  }, []);
  const touchChildHref = useCallback((pi: number, ci: number) => {
    setTouchedChildHref((prev) => {
      const m = new Map(prev);
      const s = new Set<number>(m.get(pi) ?? new Set<number>());
      s.add(ci);
      m.set(pi, s);
      return m;
    });
  }, []);

  /* ── Warnings ── */
  const warningKeys = usePrimaryMenuUiWarnings({
    items: settings.items ?? [],
  });
  const warningHints = useMemo(
    () =>
      warningKeys.map((k: PrimaryMenuWarningKey) => t(`admin.menu.hints.${k}`)),
    [warningKeys, t]
  );

  /* ── Hints d’erreur à l’affichage ── */
  const errorHints = useMemo(() => {
    const arr: string[] = [];
    const items = settings.items ?? [];

    // parents
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const idx = i + 1;
      if (touchedParentLabel.has(i) && !it.label.trim()) {
        arr.push(t("admin.menu.errors.item.label.required", { index: idx }));
      }
      if (touchedParentHref.has(i) && !it.href.trim()) {
        arr.push(t("admin.menu.errors.item.href.required", { index: idx }));
      }
    }

    // enfants
    for (let p = 0; p < items.length; p++) {
      const ch = items[p].children ?? [];
      const tLbl = touchedChildLabel.get(p) ?? new Set<number>();
      const tHref = touchedChildHref.get(p) ?? new Set<number>();
      for (let c = 0; c < ch.length; c++) {
        const it = ch[c];
        const parent = p + 1;
        const child = c + 1;
        if (tLbl.has(c) && !it.label.trim()) {
          arr.push(
            t("admin.menu.errors.child.label.required", { parent, child })
          );
        }
        if (tHref.has(c) && !it.href.trim()) {
          arr.push(
            t("admin.menu.errors.child.href.required", { parent, child })
          );
        }
      }
    }

    return Array.from(new Set(arr));
  }, [
    settings.items,
    touchedParentLabel,
    touchedParentHref,
    touchedChildLabel,
    touchedChildHref,
    t,
  ]);

  /* ─────────────────────────── Callbacks d’édition ─────────────────────────── */

  const makeDefaultItem = useCallback(
    (): PrimaryMenuItemInput => ({
      label: "",
      href: "/",
      newTab: false,
      isExternal: false,
      children: [],
    }),
    []
  );

  const makeDefaultChild = useCallback(
    (): PrimaryMenuItemChildInput => ({
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
      onPatchKV("items", items); // ⬅️ homogénéisé
      setUiErrors({ kind: "none" });

      setTouchedParentLabel(new Set());
      setTouchedParentHref(new Set());
      setTouchedChildLabel(new Map());
      setTouchedChildHref(new Map());
    },
    [settings.items, onPatchKV, makeDefaultItem]
  );

  const onUpdate = useCallback(
    (index: number, partial: Partial<PrimaryMenuItemInput>) => {
      const items = [...(settings.items ?? [])];
      const curr = items[index];
      if (!curr) return;

      const next: PrimaryMenuItemInput = {
        ...curr,
        ...partial,
        children: Array.isArray(partial.children)
          ? partial.children
          : curr.children ?? [],
      };

      items[index] = next;
      onPatchKV("items", items); // ⬅️ homogénéisé

      if (
        uiErrors.kind === "item" &&
        uiErrors.at === index &&
        next.label.trim() &&
        next.href.trim()
      ) {
        setUiErrors({ kind: "none" });
      }
    },
    [settings.items, onPatchKV, uiErrors]
  );

  const onRemove = useCallback(
    (index: number) => {
      const items = [...(settings.items ?? [])];
      if (index < 0 || index >= items.length) return;
      items.splice(index, 1);
      onPatchKV("items", items); // ⬅️ homogénéisé
      setUiErrors({ kind: "none" });

      setTouchedParentLabel((prev) => {
        const s = new Set(prev);
        s.delete(index);
        return s;
      });
      setTouchedParentHref((prev) => {
        const s = new Set(prev);
        s.delete(index);
        return s;
      });
      setTouchedChildLabel((prev) => {
        const m = new Map(prev);
        m.delete(index);
        return m;
      });
      setTouchedChildHref((prev) => {
        const m = new Map(prev);
        m.delete(index);
        return m;
      });
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
      onPatchKV("items", items); // ⬅️ homogénéisé
      setUiErrors({ kind: "none" });
    },
    [settings.items, onPatchKV]
  );

  const onAddChild = useCallback(
    (parentIndex: number, index?: number) => {
      const items = [...(settings.items ?? [])];
      const parent = items[parentIndex];
      if (!parent) return;

      const children = [...(parent.children ?? [])];
      const next = makeDefaultChild();

      if (typeof index === "number" && index >= 0 && index <= children.length) {
        children.splice(index, 0, next);
      } else {
        children.push(next);
      }

      items[parentIndex] = { ...parent, children };
      onPatchKV("items", items); // ⬅️ homogénéisé
      setUiErrors({ kind: "none" });
    },
    [settings.items, onPatchKV, makeDefaultChild]
  );

  const onUpdateChild = useCallback(
    (
      parentIndex: number,
      childIndex: number,
      partial: Partial<PrimaryMenuItemChildInput>
    ) => {
      const items = [...(settings.items ?? [])];
      const parent = items[parentIndex];
      if (!parent) return;

      const children = [...(parent.children ?? [])];
      const curr = children[childIndex];
      if (!curr) return;

      const next = { ...curr, ...partial };
      children[childIndex] = next;
      items[parentIndex] = { ...parent, children };
      onPatchKV("items", items); // ⬅️ homogénéisé

      if (
        uiErrors.kind === "child" &&
        uiErrors.at === parentIndex &&
        uiErrors.childAt === childIndex &&
        next.label.trim() &&
        next.href.trim()
      ) {
        setUiErrors({ kind: "none" });
      }
    },
    [settings.items, onPatchKV, uiErrors]
  );

  const onRemoveChild = useCallback(
    (parentIndex: number, childIndex: number) => {
      const items = [...(settings.items ?? [])];
      const parent = items[parentIndex];
      if (!parent) return;

      const children = [...(parent.children ?? [])];
      if (childIndex < 0 || childIndex >= children.length) return;

      children.splice(childIndex, 1);
      items[parentIndex] = { ...parent, children };
      onPatchKV("items", items); // ⬅️ homogénéisé
      setUiErrors({ kind: "none" });

      setTouchedChildLabel((prev) => {
        const m = new Map(prev);
        const s = new Set<number>(m.get(parentIndex) ?? new Set<number>());
        if (s.has(childIndex)) {
          s.delete(childIndex);
          m.set(parentIndex, s);
        }
        return m;
      });
      setTouchedChildHref((prev) => {
        const m = new Map(prev);
        const s = new Set<number>(m.get(parentIndex) ?? new Set<number>());
        if (s.has(childIndex)) {
          s.delete(childIndex);
          m.set(parentIndex, s);
        }
        return m;
      });
    },
    [settings.items, onPatchKV]
  );

  const onMoveChild = useCallback(
    (parentIndex: number, from: number, to: number) => {
      const items = [...(settings.items ?? [])];
      const parent = items[parentIndex];
      if (!parent) return;

      const children = [...(parent.children ?? [])];
      if (
        from < 0 ||
        from >= children.length ||
        to < 0 ||
        to >= children.length ||
        from === to
      )
        return;

      const [c] = children.splice(from, 1);
      children.splice(to, 0, c);
      items[parentIndex] = { ...parent, children };
      onPatchKV("items", items); // ⬅️ homogénéisé
      setUiErrors({ kind: "none" });
    },
    [settings.items, onPatchKV]
  );

  /* ── Flags invalid (parents + enfants) ── */
  const invalidParents = useMemo(
    () =>
      (settings.items ?? []).map((it, i) => ({
        label: !initialLoading && touchedParentLabel.has(i) && !it.label.trim(),
        href: !initialLoading && touchedParentHref.has(i) && !it.href.trim(),
      })),
    [settings.items, touchedParentLabel, touchedParentHref, initialLoading]
  );

  const invalidChildren = useMemo(() => {
    const items = settings.items ?? [];
    return items.map((parent, pi) => {
      const children = parent.children ?? [];
      const tLabels = touchedChildLabel.get(pi) ?? new Set<number>();
      const tHrefs = touchedChildHref.get(pi) ?? new Set<number>();
      return children.map((c, ci) => ({
        label: !initialLoading && tLabels.has(ci) && !c.label.trim(),
        href: !initialLoading && tHrefs.has(ci) && !c.href.trim(),
      }));
    });
  }, [settings.items, touchedChildLabel, touchedChildHref, initialLoading]);

  /* ─────────────────────────── Submit ─────────────────────────── */

  const handleSubmit = useCallback(async () => {
    const uiErr = validatePrimaryMenuUi(settings.items ?? []);
    if (uiErr.kind !== "none") {
      setUiErrors(uiErr);

      if (uiErr.kind === "item") {
        touchParentLabel(uiErr.at);
        touchParentHref(uiErr.at);
      } else if (uiErr.kind === "child") {
        touchChildLabel(uiErr.at, uiErr.childAt);
        touchChildHref(uiErr.at, uiErr.childAt);
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
      setUiErrors({ kind: "none" });
      await save(DEFAULT_CONTENT_STATE);
    } catch (e: unknown) {
      if (isValidationError(e)) {
        const paths = extractFirstLevelFieldPaths(e.body);
        const fieldErrors = mapZodPathsToFieldErrors(paths, t, {
          items: "admin.menu.errors.form.invalid",
        });
        if (fieldErrors["items"]) {
          setUiErrors({ kind: "item", at: 0 });
          touchParentLabel(0);
          touchParentHref(0);
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
    touchParentLabel,
    touchParentHref,
    touchChildLabel,
    touchChildHref,
  ]);

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

      {/* Erreurs (uniquement si touché + invalide) */}
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

      <PrimaryMenuForm
        items={settings.items}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onMove={onMove}
        onAddChild={onAddChild}
        onUpdateChild={onUpdateChild}
        onRemoveChild={onRemoveChild}
        onMoveChild={onMoveChild}
        onReset={() => {
          setTouchedParentLabel(new Set());
          setTouchedParentHref(new Set());
          setTouchedChildLabel(new Map());
          setTouchedChildHref(new Map());
          reset();
        }}
        onSubmit={handleSubmit}
        idPrefix="pm"
        skeletonCount={3}
        invalidParents={invalidParents}
        invalidChildren={invalidChildren}
        onParentLabelBlur={touchParentLabel}
        onParentHrefBlur={touchParentHref}
        onChildLabelBlur={touchChildLabel}
        onChildHrefBlur={touchChildHref}
      />

      <Separator />

      <MenuPreview settings={settings} />
    </section>
  );
}
PrimaryMenuSection.displayName = "PrimaryMenuSection";
