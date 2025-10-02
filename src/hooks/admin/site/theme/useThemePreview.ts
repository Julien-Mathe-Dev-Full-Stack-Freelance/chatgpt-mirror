"use client";
/**
 * @file src/hooks/admin/site/theme/useThemePreview.ts
 * @intro Lecture simple des réglages thème (GET-only)
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_THEME_SETTINGS } from "@/core/domain/site/defaults/theme";
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

export function useThemePreview(state: ContentState = DEFAULT_CONTENT_STATE) {
  return usePreviewResource<ThemeSettingsDTO>(
    "useThemePreview",
    (s, opts) => settingsAdminApi.theme.get(s, opts),
    DEFAULT_THEME_SETTINGS,
    state,
    "theme"
  );
}
