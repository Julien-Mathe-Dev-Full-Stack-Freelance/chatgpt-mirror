"use client";
/**
 * @file src/hooks/admin/site/identity/useIdentitySettings.ts
 * @intro State + I/O pour l'identité (GET/PATCH)
 * @description
 * Wrapper fin autour de `useSettingsResource`.
 *
 * @layer ui/hooks
 */

import type { ContentState } from "@/core/domain/constants/common";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import { DEFAULT_IDENTITY_SETTINGS } from "@/core/domain/site/defaults/identity";
import type { IdentitySettingsDTO } from "@/core/domain/site/dto";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";

export type UseIdentitySettingsResult = SettingsHookResult<IdentitySettingsDTO>;

export function useIdentitySettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseIdentitySettingsResult {
  return useSettingsResource<IdentitySettingsDTO>({
    state,
    entity: "identity",
    defaults: DEFAULT_IDENTITY_SETTINGS,
    load: (s, opts) => settingsAdminApi.identity.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.identity.patch(next, s, opts),
    buildPatch: (baseline, next) => buildShallowDiff(baseline, next) ?? null,
  });
}
