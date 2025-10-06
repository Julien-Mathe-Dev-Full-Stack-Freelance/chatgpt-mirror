/**
 * @file src/infrastructure/http/admin/site-settings.client.ts
 * @intro Client HTTP admin — Site Settings (header, footer, menus, identity, social, seo, theme)
 * @description
 * Helpers GET/PATCH vers `/api/admin/site/*`.
 * Transport-only via `apiFetch`, types depuis le barrel **domaine** (`core/domain/site/dto`).
 *
 * @layer infrastructure/http
 */

import type {
  GetFooterResponse,
  PatchFooterResponse,
} from "@/app/api/admin/site/footer/route";
import type {
  GetHeaderResponse,
  PatchHeaderResponse,
} from "@/app/api/admin/site/header/route";
import type {
  GetIdentityResponse,
  PatchIdentityResponse,
} from "@/app/api/admin/site/identity/route";
import type {
  GetLegalMenuResponse,
  PatchLegalMenuResponse,
} from "@/app/api/admin/site/legal-menu/route";
import type {
  GetPrimaryMenuResponse,
  PatchPrimaryMenuResponse,
} from "@/app/api/admin/site/primary-menu/route";
import type {
  GetSeoResponse,
  PatchSeoResponse,
} from "@/app/api/admin/site/seo/route";
import type {
  GetSocialResponse,
  PatchSocialResponse,
} from "@/app/api/admin/site/social/route";
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
import type { UpdateFooterSettingsPatchDTO } from "@/schemas/site/footer/footer-intents";
import type { UpdateHeaderSettingsPatchDTO } from "@/schemas/site/header/header-intents";
import type { UpdateIdentitySettingsPatchDTO } from "@/schemas/site/identity/identity-intents";
import type { UpdateLegalMenuSettingsPatchDTO } from "@/schemas/site/legal-menu/legal-menu-intents";
import type { UpdatePrimaryMenuSettingsPatchDTO } from "@/schemas/site/primary-menu/primary-menu-intents";
import type { UpdateSeoSettingsPatchDTO } from "@/schemas/site/seo/seo-intents";
import type { UpdateSocialSettingsPatchDTO } from "@/schemas/site/social/social-intents";

export const settingsAdminApi = {
  header: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<HeaderSettingsDTO> {
      const { settings } = await apiFetch<GetHeaderResponse>(
        withState(ENDPOINTS.ADMIN.SITE.header, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },

    async patch(
      patch: UpdateHeaderSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<HeaderSettingsDTO> {
      const { settings } = await apiFetch<PatchHeaderResponse>(
        withState(ENDPOINTS.ADMIN.SITE.header, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  footer: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<FooterSettingsDTO> {
      const { settings } = await apiFetch<GetFooterResponse>(
        withState(ENDPOINTS.ADMIN.SITE.footer, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: UpdateFooterSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<FooterSettingsDTO> {
      const { settings } = await apiFetch<PatchFooterResponse>(
        withState(ENDPOINTS.ADMIN.SITE.footer, state),
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
      const { settings } = await apiFetch<GetIdentityResponse>(
        withState(ENDPOINTS.ADMIN.SITE.identity, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },

    async patch(
      patch: UpdateIdentitySettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<IdentitySettingsDTO> {
      const { settings } = await apiFetch<PatchIdentityResponse>(
        withState(ENDPOINTS.ADMIN.SITE.identity, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  legalMenu: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<LegalMenuSettingsDTO> {
      const { settings } = await apiFetch<GetLegalMenuResponse>(
        withState(ENDPOINTS.ADMIN.SITE.legalMenu, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },

    async patch(
      patch: UpdateLegalMenuSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<LegalMenuSettingsDTO> {
      const { settings } = await apiFetch<PatchLegalMenuResponse>(
        withState(ENDPOINTS.ADMIN.SITE.legalMenu, state),
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
      const { settings } = await apiFetch<GetPrimaryMenuResponse>(
        withState(ENDPOINTS.ADMIN.SITE.primaryMenu, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },

    async patch(
      patch: UpdatePrimaryMenuSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<PrimaryMenuSettingsDTO> {
      const { settings } = await apiFetch<PatchPrimaryMenuResponse>(
        withState(ENDPOINTS.ADMIN.SITE.primaryMenu, state),
        {
          method: "PATCH",
          body: JSON.stringify(patch),
          ...(opts ?? {}),
        }
      );
      return settings;
    },
  },

  seo: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<SeoSettingsDTO> {
      const { settings } = await apiFetch<GetSeoResponse>(
        withState(ENDPOINTS.ADMIN.SITE.seo, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: UpdateSeoSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<SeoSettingsDTO> {
      const { settings } = await apiFetch<PatchSeoResponse>(
        withState(ENDPOINTS.ADMIN.SITE.seo, state),
        { method: "PATCH", body: JSON.stringify(patch), ...(opts ?? {}) }
      );
      return settings;
    },
  },

  social: {
    async get(
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<SocialSettingsDTO> {
      const { settings } = await apiFetch<GetSocialResponse>(
        withState(ENDPOINTS.ADMIN.SITE.social, state),
        { method: "GET", ...(opts ?? {}) }
      );
      return settings;
    },
    async patch(
      patch: UpdateSocialSettingsPatchDTO,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ): Promise<SocialSettingsDTO> {
      const { settings } = await apiFetch<PatchSocialResponse>(
        withState(ENDPOINTS.ADMIN.SITE.social, state),
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
