"use client";
/**
 * @file src/hooks/admin/site/header/useHeaderSettings.ts
 * @intro State + I/O pour les réglages du header (GET/PATCH)
 * @description
 * Wrapper fin autour de `useSettingsResource`.
 *
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_HEADER_SETTINGS } from "@/core/domain/site/defaults/header";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";
import type { HeaderSettingsInput } from "@/schemas/site/header/header";

type UseHeaderSettingsResult = SettingsHookResult<HeaderSettingsInput>;

export function useHeaderSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseHeaderSettingsResult {
  return useSettingsResource<HeaderSettingsInput>({
    state,
    entity: "header",
    defaults: DEFAULT_HEADER_SETTINGS,
    load: (s, opts) => settingsAdminApi.header.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.header.patch(next, s, opts),
    buildPatch: (baseline, next) => buildShallowDiff(baseline, next) ?? null,
  });
}
