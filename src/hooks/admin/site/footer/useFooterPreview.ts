"use client";
/**
 * @file src/hooks/admin/site/footer/useFooterPreview.ts
 * @intro Lecture simple des réglages footer pour l’aperçu
 * @description
 * Wrapper fin autour de `usePreviewResource` :
 * - GET via settingsAdminApi.footer.get(state, { signal })
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
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

type UseFooterPreviewResult = Readonly<{
  settings: FooterSettingsDTO;
  loading: boolean;
}>;

/**
 * Signature uniforme : (state?: ContentState = "draft") => { settings, loading } as const
 */
export function useFooterPreview(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseFooterPreviewResult {
  return usePreviewResource<FooterSettingsDTO>(
    "useFooterPreview",
    (s, opts) => settingsAdminApi.footer.get(s, opts),
    DEFAULT_FOOTER_SETTINGS,
    state,
    "footer"
  );
}
