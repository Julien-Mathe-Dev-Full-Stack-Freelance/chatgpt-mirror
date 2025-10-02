import {
  ensureDirForFile,
  InvalidJsonFileError,
  readJsonFile,
  writeFileAtomic,
} from "@/infrastructure/utils/fs";
import { join } from "node:path";

import {
  type ContentState,
  DEFAULT_CONTENT_STATE,
} from "@/constants/shared/common";
import { DEFAULT_ADMIN_SETTINGS } from "@/core/domain/site/defaults/admin";
import { DEFAULT_FOOTER_SETTINGS } from "@/core/domain/site/defaults/footer";
import { DEFAULT_HEADER_SETTINGS } from "@/core/domain/site/defaults/header";
import { DEFAULT_IDENTITY_SETTINGS } from "@/core/domain/site/defaults/identity";
import { DEFAULT_LEGAL_MENU_SETTINGS } from "@/core/domain/site/defaults/legal-menu";
import { DEFAULT_PRIMARY_MENU_SETTINGS } from "@/core/domain/site/defaults/primary-menu";
import { DEFAULT_SEO_SETTINGS } from "@/core/domain/site/defaults/seo";
import { DEFAULT_SOCIAL_SETTINGS } from "@/core/domain/site/defaults/social";
import { DEFAULT_THEME_SETTINGS } from "@/core/domain/site/defaults/theme";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";
import { isENOENT } from "@/infrastructure/utils/errors";
import { log } from "@/lib/log";

const lg = log.child({ ns: "infra:site", impl: "fs" });

/** Toggle backups : SITE_SETTINGS_HISTORY=1|true */
const HISTORY_ENABLED =
  String(process.env["SITE_SETTINGS_HISTORY"] ?? "").toLowerCase() === "true" ||
  process.env["SITE_SETTINGS_HISTORY"] === "1";

function tsForFile(d = new Date()) {
  // 2025-09-13T12-34-56.123Z (safe Windows)
  return d.toISOString().replace(/[:]/g, "-");
}

export class FileSystemSiteRepository implements SiteRepository {
  private readonly root: string;
  constructor(contentRoot = join(process.cwd(), "content")) {
    this.root = contentRoot;
  }

  private indexPath(s: ContentState) {
    return join(this.root, s, "index.json");
  }
  private settingsPath(s: ContentState) {
    return join(this.root, s, "settings", "site.json");
  }
  private settingsHistoryPath(s: ContentState) {
    return join(
      this.root,
      s,
      "settings",
      ".history",
      `site-${tsForFile()}.json`
    );
  }

  async ensureBase(): Promise<void> {
    lg.debug("ensureBase.start", { root: this.root });
    await ensureDirForFile(this.indexPath(DEFAULT_CONTENT_STATE));
    await ensureDirForFile(this.settingsPath(DEFAULT_CONTENT_STATE));
    lg.debug("ensureBase.ok");
  }

  async readIndex(state: ContentState): Promise<SiteIndex> {
    const file = this.indexPath(state);
    try {
      const parsed = await readJsonFile<SiteIndex>(file);
      lg.debug("readIndex.ok", { state });
      return parsed;
    } catch (e: unknown) {
      if (isENOENT(e)) {
        lg.debug("readIndex.fallback.default", { state });
        return { pages: [], updatedAt: new Date().toISOString() };
      }
      if (e instanceof InvalidJsonFileError) {
        lg.warn("readIndex.invalid_json", {
          state,
          path: e.path,
          hint: "Corrigez le JSON dans index.json ou supprimez-le.",
        });
      } else {
        const msg = e instanceof Error ? e.message : String(e);
        lg.error("readIndex.unexpected", { state, msg });
      }
      throw e;
    }
  }

  async writeIndex(state: ContentState, index: SiteIndex): Promise<void> {
    const file = this.indexPath(state);
    await ensureDirForFile(file);
    await writeFileAtomic(file, JSON.stringify(index, null, 2), "utf-8");
    lg.debug("writeIndex.ok", { state });
  }

  async readSettings(state: ContentState): Promise<SiteSettings> {
    const file = this.settingsPath(state);
    try {
      const parsed = await readJsonFile<Partial<SiteSettings>>(file);
      lg.debug("readSettings.ok", { state });
      // Complète avec defaults si des clés manquent
      return {
        header: parsed.header ?? { ...DEFAULT_HEADER_SETTINGS },
        footer: parsed.footer ?? { ...DEFAULT_FOOTER_SETTINGS },
        primaryMenu: parsed.primaryMenu ?? { ...DEFAULT_PRIMARY_MENU_SETTINGS },
        legalMenu: parsed.legalMenu ?? { ...DEFAULT_LEGAL_MENU_SETTINGS },
        identity: parsed.identity ?? { ...DEFAULT_IDENTITY_SETTINGS },
        social: parsed.social ?? { ...DEFAULT_SOCIAL_SETTINGS },
        seo: parsed.seo ?? { ...DEFAULT_SEO_SETTINGS },
        theme: parsed.theme ?? { ...DEFAULT_THEME_SETTINGS },
        admin: parsed.admin ?? { ...DEFAULT_ADMIN_SETTINGS },
      };
    } catch (e: unknown) {
      if (isENOENT(e)) {
        lg.debug("readSettings.fallback.defaults", { state });
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
      if (e instanceof InvalidJsonFileError) {
        lg.warn("readSettings.invalid_json", {
          state,
          path: e.path,
          hint: "Corrigez le JSON dans settings/site.json ou supprimez-le.",
        });
      } else {
        const msg = e instanceof Error ? e.message : String(e);
        lg.error("readSettings.unexpected", { state, msg });
      }
      throw e;
    }
  }

  async writeSettings(
    state: ContentState,
    settings: SiteSettings
  ): Promise<void> {
    const file = this.settingsPath(state);
    await ensureDirForFile(file);

    const json = JSON.stringify(settings, null, 2);

    // Backup optionnel avant overwrite
    if (HISTORY_ENABLED) {
      const hist = this.settingsHistoryPath(state);
      await ensureDirForFile(hist);
      await writeFileAtomic(hist, json, "utf-8");
      lg.debug("writeSettings.backup", { state, hist });
    }

    await writeFileAtomic(file, json, "utf-8");
    lg.debug("writeSettings.ok", { state });
  }
}
