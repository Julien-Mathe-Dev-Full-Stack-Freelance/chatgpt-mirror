"use client";
/**
 * @file src/hooks/admin/site/header/useHeaderPreview.ts
 * @intro Lecture simple des réglages header pour l’aperçu
 * @description
 * Wrapper fin autour de `usePreviewResource`.
 *
 * @layer ui/hooks
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { DEFAULT_HEADER_SETTINGS } from "@/core/domain/site/defaults/header";
import type { HeaderSettingsDTO } from "@/core/domain/site/dto";
import { usePreviewResource } from "@/hooks/_shared/usePreviewResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";

type UseHeaderPreviewResult = Readonly<{
  settings: HeaderSettingsDTO;
  loading: boolean;
}>;

export function useHeaderPreview(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseHeaderPreviewResult {
  return usePreviewResource<HeaderSettingsDTO>(
    "useHeaderPreview",
    (s, opts) => settingsAdminApi.header.get(s, opts),
    DEFAULT_HEADER_SETTINGS,
    state,
    "header"
  );
}
