/**
 * @file src/infrastructure/site/in-memory-site-repository.ts
 * @intro Implémentation InMemory du `SiteRepository` (tests/e2e)
 * @layer infrastructure
 */

import {
  PUBLISHED_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";

import { DEFAULT_ADMIN_SETTINGS } from "@/core/domain/site/defaults/admin";
import { DEFAULT_FOOTER_SETTINGS } from "@/core/domain/site/defaults/footer";
import { DEFAULT_HEADER_SETTINGS } from "@/core/domain/site/defaults/header";
import { DEFAULT_IDENTITY_SETTINGS } from "@/core/domain/site/defaults/identity";
import { DEFAULT_LEGAL_MENU_SETTINGS } from "@/core/domain/site/defaults/legal-menu";
import { DEFAULT_PRIMARY_MENU_SETTINGS } from "@/core/domain/site/defaults/primary-menu";
import { DEFAULT_SEO_SETTINGS } from "@/core/domain/site/defaults/seo";
import { DEFAULT_SOCIAL_SETTINGS } from "@/core/domain/site/defaults/social";
import { DEFAULT_THEME_SETTINGS } from "@/core/domain/site/defaults/theme";

function defaultIndex(): SiteIndex {
  return {
    pages: [],
    updatedAt: new Date().toISOString(),
  };
}

function defaultSettings(): SiteSettings {
  return {
    header: { ...DEFAULT_HEADER_SETTINGS },
    footer: { ...DEFAULT_FOOTER_SETTINGS },
    primaryMenu: { ...DEFAULT_PRIMARY_MENU_SETTINGS },
    legalMenu: { ...DEFAULT_LEGAL_MENU_SETTINGS },
    identity: { ...DEFAULT_IDENTITY_SETTINGS },
    social: { ...DEFAULT_SOCIAL_SETTINGS },
    seo: { ...DEFAULT_SEO_SETTINGS },
    theme: { ...DEFAULT_THEME_SETTINGS },
    admin: { ...DEFAULT_ADMIN_SETTINGS },
  };
}

export class InMemorySiteRepository implements SiteRepository {
  private indexDraft: SiteIndex | null = null;
  private indexPublished: SiteIndex | null = null;
  private settingsDraft: SiteSettings | null = null;
  private settingsPublished: SiteSettings | null = null;

  async ensureBase(): Promise<void> {
    // no-op
  }

  private pickIndex(state: ContentState): SiteIndex | null {
    return state === PUBLISHED_CONTENT_STATE
      ? this.indexPublished
      : this.indexDraft;
  }
  private setIndex(state: ContentState, idx: SiteIndex): void {
    if (state === PUBLISHED_CONTENT_STATE) this.indexPublished = idx;
    else this.indexDraft = idx;
  }

  private pickSettings(state: ContentState): SiteSettings | null {
    return state === PUBLISHED_CONTENT_STATE
      ? this.settingsPublished
      : this.settingsDraft;
  }
  private setSettings(state: ContentState, s: SiteSettings): void {
    if (state === PUBLISHED_CONTENT_STATE) this.settingsPublished = s;
    else this.settingsDraft = s;
  }

  async readIndex(state: ContentState): Promise<SiteIndex> {
    return structuredClone(this.pickIndex(state) ?? defaultIndex());
  }

  async writeIndex(state: ContentState, index: SiteIndex): Promise<void> {
    this.setIndex(state, structuredClone(index));
  }

  async readSettings(state: ContentState): Promise<SiteSettings> {
    return structuredClone(this.pickSettings(state) ?? defaultSettings());
  }

  async writeSettings(
    state: ContentState,
    settings: SiteSettings
  ): Promise<void> {
    this.setSettings(state, structuredClone(settings));
  }
}
