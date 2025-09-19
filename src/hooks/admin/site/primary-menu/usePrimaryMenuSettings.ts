"use client";
import { DEFAULT_MENU_PATH } from "@/core/domain/constants/urls";
import { useI18n } from "@/i18n/context";
/**
 * @file src/hooks/admin/site/primary-menu/usePrimaryMenuSettings.ts
 * @intro State + I/O menu principal (GET/PATCH) + helpers liste (immutables)
 * @description
 * Compose `useSettingsResource` + `useObjectArrayField` pour `items`.
 * URLs brandées via `href()` (Relative|Absolute).
 *
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { DEFAULT_PRIMARY_MENU_SETTINGS } from "@/core/domain/site/defaults/primary-menu";
import type {
  PrimaryMenuItemDTO,
  PrimaryMenuSettingsDTO,
} from "@/core/domain/site/dto";
import { href as brandHref, brandHrefSafe } from "@/core/domain/urls/href";
import { useObjectArrayField } from "@/hooks/_shared/list/useObjectArrayField";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { notifyValidation } from "@/lib/notify-presets";
import { useCallback, useMemo } from "react";

type Base = SettingsHookResult<PrimaryMenuSettingsDTO>;

export type UsePrimaryMenuSettingsResult = Omit<Base, "save"> &
  Readonly<{
    addItem: (item?: Partial<PrimaryMenuItemDTO>, index?: number) => void;
    updateItem: (index: number, patch: Partial<PrimaryMenuItemDTO>) => void;
    removeItem: (index: number) => void;
    moveItem: (from: number, to: number) => void;
    save: (state?: ContentState) => Promise<void>;
  }>;

export function usePrimaryMenuSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UsePrimaryMenuSettingsResult {
  const { t } = useI18n();
  const base = useSettingsResource<PrimaryMenuSettingsDTO>({
    state,
    entity: "primaryMenu",
    defaults: DEFAULT_PRIMARY_MENU_SETTINGS,
    load: (s, opts) => settingsAdminApi.menu.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.menu.patch(next, s, opts),
  });

  const { settings, patch, isDirty } = base;

  const itemsApi = useObjectArrayField<
    PrimaryMenuSettingsDTO,
    "items",
    PrimaryMenuItemDTO
  >({ settings, key: "items", patch });

  const defaultItem = useCallback(
    (over?: Partial<PrimaryMenuItemDTO>): PrimaryMenuItemDTO => ({
      label: over?.label ?? t("admin.primaryMenu.newItem"),
      href: over?.href
        ? brandHref(String(over.href))
        : brandHref(DEFAULT_MENU_PATH),
      newTab: over?.newTab ?? false,
    }),
    [t]
  );

  const addItem = useCallback(
    (item?: Partial<PrimaryMenuItemDTO>, index?: number) => {
      itemsApi.add(defaultItem(item), index);
    },
    [itemsApi, defaultItem]
  );

  const updateItem = useCallback(
    (index: number, p: Partial<PrimaryMenuItemDTO>) => {
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
        notifyValidation(
          "primaryMenu",
          t("validation.menu.item.missingFields")
        );
        return;
      }
      if (!isDirty) return;
      await base.save(s);
    },
    [base, hasInvalidItems, isDirty, t]
  );

  return { ...base, addItem, updateItem, removeItem, moveItem, save } as const;
}
