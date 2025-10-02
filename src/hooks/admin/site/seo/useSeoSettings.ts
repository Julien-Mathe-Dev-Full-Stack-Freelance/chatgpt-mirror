"use client";
/**
 * @file src/hooks/admin/site/seo/useSeoSettings.ts
 * @intro State + I/O SEO (GET/PATCH) via hook générique
 * @description
 * Wrapper minimal autour de `useSettingsResource` pour livrer l’API standardisée :
 * `{ settings, initialLoading, saving, isDirty, patch, reset, load, save }`.
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_SEO_SETTINGS } from "@/core/domain/site/defaults/seo";
import type { SeoSettingsDTO } from "@/core/domain/site/dto";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

export type UseSeoSettingsResult = SettingsHookResult<SeoSettingsDTO>;

export function useSeoSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseSeoSettingsResult {
  return useSettingsResource<SeoSettingsDTO>({
    state,
    entity: "seo",
    defaults: DEFAULT_SEO_SETTINGS,
    load: (s, opts) => settingsAdminApi.seo.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.seo.patch(next, s, opts),
  });
}
