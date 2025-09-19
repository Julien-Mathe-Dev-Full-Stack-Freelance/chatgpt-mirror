"use client";
/**
 * @file src/hooks/admin/site/primary-menu/usePrimaryMenuPreview.ts
 * @intro Aperçu (GET) du menu principal
 * @description
 * Wrapper fin autour de `usePreviewResource`.
 *
 * @layer ui/hooks
 */

import type { ContentState } from "@/core/domain/constants/common";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import { DEFAULT_PRIMARY_MENU_SETTINGS } from "@/core/domain/site/defaults/primary-menu";
import type { PrimaryMenuSettingsDTO } from "@/core/domain/site/dto";
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

export type UsePrimaryMenuPreviewResult = Readonly<{
  settings: PrimaryMenuSettingsDTO;
  loading: boolean;
}>;

export function usePrimaryMenuPreview(
  state: ContentState = DEFAULT_CONTENT_STATE
): UsePrimaryMenuPreviewResult {
  return usePreviewResource<PrimaryMenuSettingsDTO>(
    "usePrimaryMenuPreview",
    (s, opts) => settingsAdminApi.menu.get(s, opts),
    DEFAULT_PRIMARY_MENU_SETTINGS,
    state,
    "primaryMenu"
  );
}
