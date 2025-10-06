"use client";
/**
 * @file src/hooks/admin/site/primary-menu/usePrimaryMenuPreview.ts
 * @intro Aperçu (GET) du menu principal
 * @description
 * Wrapper fin autour de `usePreviewResource`.
 *
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_PRIMARY_MENU_SETTINGS } from "@/core/domain/site/defaults/primary-menu";
import type { PrimaryMenuSettingsDTO } from "@/core/domain/site/dto";
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

type UsePrimaryMenuPreviewResult = Readonly<{
  settings: PrimaryMenuSettingsDTO;
  loading: boolean;
}>;

export function usePrimaryMenuPreview(
  state: ContentState = DEFAULT_CONTENT_STATE
): UsePrimaryMenuPreviewResult {
  return usePreviewResource<PrimaryMenuSettingsDTO>(
    "usePrimaryMenuPreview",
    (s, opts) => settingsAdminApi.primaryMenu.get(s, opts),
    DEFAULT_PRIMARY_MENU_SETTINGS,
    state,
    "primaryMenu"
  );
}
