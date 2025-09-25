"use client";
import { DEFAULT_MENU_PATH } from "@/core/domain/constants/urls";
import { useI18n } from "@/i18n/context";
/**
 * @file src/hooks/admin/site/legal-menu/useLegalMenuSettings.ts
 * @intro State + I/O menu légal (GET/PATCH) + helpers liste (immutables)
 * @description
 * Compose `useSettingsResource` (chargement/persistance/baseline/isDirty)
 * et `useObjectArrayField` (add/update/merge/remove/move) pour `items`.
 * Les URLs sont brandées via `href()` (Relative|Absolute) — pas de cast hasardeux.
 *
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";

import { DEFAULT_LEGAL_MENU_SETTINGS } from "@/core/domain/site/defaults/legal-menu";
import type {
  LegalMenuItemDTO,
  LegalMenuSettingsDTO,
} from "@/core/domain/site/dto";
import { href as brandHref, brandHrefSafe } from "@/core/domain/urls/href";
import { useObjectArrayField } from "@/hooks/_shared/list/useObjectArrayField";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildDeepDiff } from "@/lib/diff";
import { notifyValidation } from "@/lib/notify-presets";
import { useCallback, useMemo } from "react";

type Base = SettingsHookResult<LegalMenuSettingsDTO>;

export type UseLegalMenuSettingsResult = Omit<Base, "save"> &
  Readonly<{
    addItem: (item?: Partial<LegalMenuItemDTO>, index?: number) => void;
    updateItem: (index: number, patch: Partial<LegalMenuItemDTO>) => void;
    removeItem: (index: number) => void;
    moveItem: (from: number, to: number) => void;
    save: (state?: ContentState) => Promise<void>;
  }>;

export function useLegalMenuSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseLegalMenuSettingsResult {
  const { t } = useI18n();
  const base = useSettingsResource<LegalMenuSettingsDTO>({
    state,
    entity: "legalMenu",
    defaults: DEFAULT_LEGAL_MENU_SETTINGS,
    load: (s, opts) => settingsAdminApi.legalMenu.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.legalMenu.patch(next, s, opts),
    buildPatch: (baseline, next) => buildDeepDiff(baseline, next) ?? null,
  });

  const { settings, patch, isDirty } = base;

  const itemsApi = useObjectArrayField<
    LegalMenuSettingsDTO,
    "items",
    LegalMenuItemDTO
  >({ settings, key: "items", patch });

  const defaultItem = useCallback(
    (over?: Partial<LegalMenuItemDTO>): LegalMenuItemDTO => ({
      label: over?.label ?? t("admin.legalMenu.newItem"),
      href: over?.href
        ? brandHref(String(over.href))
        : brandHref(DEFAULT_MENU_PATH),
      newTab: over?.newTab ?? false,
    }),
    [t]
  );

  const addItem = useCallback(
    (item?: Partial<LegalMenuItemDTO>, index?: number) => {
      itemsApi.add(defaultItem(item), index);
    },
    [itemsApi, defaultItem]
  );

  const updateItem = useCallback(
    (index: number, p: Partial<LegalMenuItemDTO>) => {
      const currentRaw = settings.items?.[index]?.href;
      const current = currentRaw ? brandHref(currentRaw) : undefined;
      const nextHref =
        p.href !== undefined ? brandHrefSafe(p.href, current) : undefined;

      itemsApi.merge(index, {
        ...p,
        ...(nextHref ? { href: nextHref } : {}),
      });
    },
    [itemsApi, settings.items]
  );

  const removeItem = useCallback(
    (index: number) => itemsApi.remove(index),
    [itemsApi]
  );
  const moveItem = useCallback(
    (from: number, to: number) => itemsApi.move(from, to),
    [itemsApi]
  );

  const hasInvalidItems = useMemo(
    () =>
      (settings.items ?? []).some(
        (it) => !it.label?.trim() || !String(it.href).trim()
      ),
    [settings.items]
  );

  const save = useCallback(
    async (s: ContentState = DEFAULT_CONTENT_STATE) => {
      if (hasInvalidItems) {
        notifyValidation("legalMenu", t("validation.menu.item.missingFields"));
        return;
      }
      if (!isDirty) return;
      await base.save(s);
    },
    [base, hasInvalidItems, isDirty, t]
  );

  return { ...base, addItem, updateItem, removeItem, moveItem, save } as const;
}
