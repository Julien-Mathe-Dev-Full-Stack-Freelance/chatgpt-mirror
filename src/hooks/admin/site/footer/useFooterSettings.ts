"use client";
/**
 * @file src/hooks/admin/site/footer/useFooterSettings.ts
 * @intro State + I/O pour les réglages du footer (GET/PATCH)
 * @description
 * Wrapper fin autour de `useSettingsResource` :
 * - GET via settingsAdminApi.footer.get(state, { signal })
 * - PATCH via settingsAdminApi.footer.patch(next, state, { signal })
 * - defaults = DEFAULT_FOOTER_SETTINGS
 *
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_FOOTER_SETTINGS } from "@/core/domain/site/defaults/footer";
import type { FooterSettingsDTO } from "@/core/domain/site/dto";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";

export type UseFooterSettingsResult = SettingsHookResult<FooterSettingsDTO>;

/**
 * Signature uniforme : (state?: ContentState = "draft")
 * → { settings, initialLoading, saving, isDirty, patch, reset, load, save } as const
 */
export function useFooterSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseFooterSettingsResult {
  return useSettingsResource<FooterSettingsDTO>({
    state,
    entity: "footer",
    defaults: DEFAULT_FOOTER_SETTINGS,
    load: (s, opts) => settingsAdminApi.footer.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.footer.patch(next, s, opts),
    buildPatch: (baseline, next) => buildShallowDiff(baseline, next) ?? null,
  });
}
