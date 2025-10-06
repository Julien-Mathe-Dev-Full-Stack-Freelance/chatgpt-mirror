"use client";
/**
 * @file src/hooks/admin/site/social/useSocialPreview.ts
 * @intro Lecture simple des liens sociaux (GET-only)
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_SOCIAL_SETTINGS } from "@/core/domain/site/defaults/social";
import type { SocialSettingsDTO } from "@/core/domain/site/dto";
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

export function useSocialPreview(state: ContentState = DEFAULT_CONTENT_STATE) {
  return usePreviewResource<SocialSettingsDTO>(
    "useSocialPreview",
    (s, opts) => settingsAdminApi.social.get(s, opts),
    DEFAULT_SOCIAL_SETTINGS,
    state,
    "social"
  );
}
