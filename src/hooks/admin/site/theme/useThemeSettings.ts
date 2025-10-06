"use client";
/**
 * @file src/hooks/admin/site/theme/useThemeSettings.ts
 * @intro Lecture + écriture des réglages thème (GET/PATCH)
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_THEME_SETTINGS } from "@/core/domain/site/defaults/theme";
import type { ThemeSettingsDTO } from "@/core/domain/site/dto";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

export function useThemeSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): SettingsHookResult<ThemeSettingsDTO> {
  return useSettingsResource<ThemeSettingsDTO>({
    state,
    entity: "theme",
    defaults: DEFAULT_THEME_SETTINGS,
    load: (s, opts) => settingsAdminApi.theme.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.theme.patch(next, s, opts),
  });
}
