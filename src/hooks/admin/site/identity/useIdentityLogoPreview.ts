"use client";
/**
 * @file src/hooks/admin/site/identity/useIdentityLogoPreview.ts
 * @intro Aperçu (GET) de l'identité (titre + logo)
 * @description
 * Wrapper fin autour de `usePreviewResource` :
 * - GET via settingsAdminApi.identity.get(state, { signal })
 * - defaults = DEFAULT_IDENTITY_SETTINGS
 *
 * @layer ui/hooks
 */
import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_IDENTITY_SETTINGS } from "@/core/domain/site/defaults/identity";
import type { IdentitySettingsDTO } from "@/core/domain/site/dto";
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

type UseIdentityLogoPreviewResult = Readonly<{
  settings: IdentitySettingsDTO;
  loading: boolean;
}>;

export function useIdentityLogoPreview(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseIdentityLogoPreviewResult {
  return usePreviewResource<IdentitySettingsDTO>(
    "useIdentityLogoPreview",
    (s, opts) => settingsAdminApi.identity.get(s, opts),
    DEFAULT_IDENTITY_SETTINGS,
    state,
    "identity"
  );
}
