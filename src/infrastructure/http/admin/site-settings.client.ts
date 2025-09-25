/**
 * @file src/infrastructure/http/admin/site-settings.client.ts
 * @intro Client HTTP admin — Site Settings (header, footer, menus, identity, social, seo, theme)
 * @description
 * Helpers GET/PATCH vers `/api/admin/site/*`.
 * Transport-only via `apiFetch`, types depuis le barrel **domaine** (`core/domain/site/dto`).
 *
 * Observabilité :
 * - `debug` : start/ok (avec durée)
 * - `warn`  : échec (message, durée)
 *
 * @layer infrastructure/http
 * @remarks
 * - Aucune logique métier ici : ce module propage les erreurs HTTP telles quelles.
 * - La validation de forme est faite côté API (Zod dans les routes).
 * @todo (auth) Injecter Authorization quand l’auth sera branchée.
 * @todo (env) Factoriser une base URL si backend séparé.
 * @todo (abort) Support d’un `AbortSignal` optionnel (signature étendue côté méthodes).
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
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
  request,
  withState,
  type HttpOpts,
} from "@/infrastructure/http/shared/_internal";

export const settingsAdminApi = {
  header: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: HeaderSettingsDTO }>(
        "header.get",
        withState(ENDPOINTS.ADMIN.SITE.header, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<HeaderSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: HeaderSettingsDTO }>(
        "header.patch",
        withState(ENDPOINTS.ADMIN.SITE.header, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },

  footer: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: FooterSettingsDTO }>(
        "footer.get",
        withState(ENDPOINTS.ADMIN.SITE.footer, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<FooterSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: FooterSettingsDTO }>(
        "footer.patch",
        withState(ENDPOINTS.ADMIN.SITE.footer, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },

  menu: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: PrimaryMenuSettingsDTO }>(
        "primaryMenu.get",
        withState(ENDPOINTS.ADMIN.SITE.primaryMenu, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<PrimaryMenuSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: PrimaryMenuSettingsDTO }>(
        "primaryMenu.patch",
        withState(ENDPOINTS.ADMIN.SITE.primaryMenu, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },

  legalMenu: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: LegalMenuSettingsDTO }>(
        "legalMenu.get",
        withState(ENDPOINTS.ADMIN.SITE.legalMenu, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<LegalMenuSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: LegalMenuSettingsDTO }>(
        "legalMenu.patch",
        withState(ENDPOINTS.ADMIN.SITE.legalMenu, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },

  identity: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: IdentitySettingsDTO }>(
        "identity.get",
        withState(ENDPOINTS.ADMIN.SITE.identity, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<IdentitySettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: IdentitySettingsDTO }>(
        "identity.patch",
        withState(ENDPOINTS.ADMIN.SITE.identity, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },

  social: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: SocialSettingsDTO }>(
        "social.get",
        withState(ENDPOINTS.ADMIN.SITE.social, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<SocialSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: SocialSettingsDTO }>(
        "social.patch",
        withState(ENDPOINTS.ADMIN.SITE.social, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },

  seo: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: SeoSettingsDTO }>(
        "seo.get",
        withState(ENDPOINTS.ADMIN.SITE.seo, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<SeoSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: SeoSettingsDTO }>(
        "seo.patch",
        withState(ENDPOINTS.ADMIN.SITE.seo, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },

  theme: {
    async get(state: ContentState = DEFAULT_CONTENT_STATE, opts?: HttpOpts) {
      const { settings } = await request<{ settings: ThemeSettingsDTO }>(
        "theme.get",
        withState(ENDPOINTS.ADMIN.SITE.theme, state),
        { method: "GET" },
        opts
      );
      return settings;
    },
    async patch(
      patch: Partial<ThemeSettingsDTO>,
      state: ContentState = DEFAULT_CONTENT_STATE,
      opts?: HttpOpts
    ) {
      const { settings } = await request<{ settings: ThemeSettingsDTO }>(
        "theme.patch",
        withState(ENDPOINTS.ADMIN.SITE.theme, state),
        { method: "PATCH", body: JSON.stringify(patch) },
        opts
      );
      return settings;
    },
  },
};
