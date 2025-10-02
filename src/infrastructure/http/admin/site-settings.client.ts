/**
 * @file src/infrastructure/http/admin/site-settings.client.ts
 * @intro Client HTTP admin — Site Settings (header, footer, menus, identity, social, seo, theme)
 * @description
 * Helpers GET/PATCH vers `/api/admin/site/*`.
 * Transport-only via `apiFetch`, types depuis le barrel **domaine** (`core/domain/site/dto`).
 *
 * @layer infrastructure/http
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import type {
  FooterSettingsDTO,
  HeaderSettingsDTO,
  IdentitySettingsDTO,
  LegalMenuSettingsDTO,
  PrimaryMenuSettingsDTO,
  SeoSettingsDTO,
  SocialSettingsDTO,
  ThemeSettingsDTO,
} from "@/core/domain/site/dto";
import { ENDPOINTS } from "@/infrastructure/constants/endpoints";
import {
  withState,
  type HttpOpts,
} from "@/infrastructure/http/shared/_internal";
import { apiFetch } from "@/lib/http/api-fetch";
import type { UpdateIdentitySettingsPatchDTO } from "@/schemas/site/identity/identity-intents";
import type { UpdateLegalMenuSettingsPatchDTO } from "@/schemas/site/legal-menu/legal-menu-intents";
import type { UpdatePrimaryMenuSettingsPatchDTO } from "@/schemas/site/primary-menu/primary-menu-intents";
import type {
  UpdateSocialSettingsDTO,
  UpdateSocialSettingsPatchDTO,
} from "@/schemas/site/social/social-intents";

export const settingsAdminApi = {
  header: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await apiFetch<{ settings: HeaderSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.header, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: Partial<HeaderSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await apiFetch<{ settings: HeaderSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.header, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  footer: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await apiFetch<{ settings: FooterSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.footer, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: Partial<FooterSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await apiFetch<{ settings: FooterSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.footer, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  primaryMenu: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<PrimaryMenuSettingsDTO> {
      const { settings } = await apiFetch<{
        settings: PrimaryMenuSettingsDTO;
      }>(withState(ENDPOINTS.ADMIN.SITE.primaryMenu, state), {
        method: "GET",
        ...(opts ?? {}),
      });
      return settings;
    },

    async patch(
      patch: UpdatePrimaryMenuSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await apiFetch<{
        settings: PrimaryMenuSettingsDTO;
      }>(withState(ENDPOINTS.ADMIN.SITE.primaryMenu, state), {
        method: "PATCH",
        body: JSON.stringify(patch),
        ...(opts ?? {}),
      });
      return settings;
    },
  },

  legalMenu: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<LegalMenuSettingsDTO> {
      const { settings } = await apiFetch<{ settings: LegalMenuSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.legalMenu, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: UpdateLegalMenuSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await apiFetch<{ settings: LegalMenuSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.legalMenu, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  identity: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<IdentitySettingsDTO> {
      const { identity } = await apiFetch<{ identity: IdentitySettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.identity, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return identity;
    },
    async patch(
      patch: UpdateIdentitySettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { identity } = await apiFetch<{ identity: IdentitySettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.identity, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return identity;
    },
  },

  social: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<SocialSettingsDTO> {
      const { settings } = await apiFetch<{ settings: SocialSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.social, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: UpdateSocialSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await apiFetch<{ settings: SocialSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.social, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  seo: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await apiFetch<{ settings: SeoSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.seo, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: Partial<SeoSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await apiFetch<{ settings: SeoSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.seo, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  theme: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await apiFetch<{ settings: ThemeSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.theme, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: Partial<ThemeSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await apiFetch<{ settings: ThemeSettingsDTO }>(
        withState(ENDPOINTS.ADMIN.SITE.theme, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },
};
