"use client";
/**
 * @file src/hooks/admin/site/legal-menu/useLegalMenuPreview.ts
 * @intro Aperçu (GET) du menu légal
 * @description
 * Wrapper fin autour de `usePreviewResource`.
 *
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_LEGAL_MENU_SETTINGS } from "@/core/domain/site/defaults/legal-menu";
import type { LegalMenuSettingsDTO } from "@/core/domain/site/dto";
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

type UseLegalMenuPreviewResult = Readonly<{
  settings: LegalMenuSettingsDTO;
  loading: boolean;
}>;

export function useLegalMenuPreview(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseLegalMenuPreviewResult {
  return usePreviewResource<LegalMenuSettingsDTO>(
    "useLegalMenuPreview",
    (s, opts) => settingsAdminApi.legalMenu.get(s, opts),
    DEFAULT_LEGAL_MENU_SETTINGS,
    state,
    "legalMenu"
  );
}
