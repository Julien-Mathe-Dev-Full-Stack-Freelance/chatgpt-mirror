/**
 * @file src/infrastructure/pages/file-system-pages-repository.ts
 * @intro Implémentation FileSystem du `PagesRepository`
 * @layer infrastructure
 */

import { promises as fs } from "node:fs";
import { join } from "node:path";

import {
  DEFAULT_CONTENT_STATE,
  PUBLISHED_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import type { Page, PageSummary } from "@/core/domain/pages/entities/page";
import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import { isValidSlug } from "@/core/domain/slug/utils";
import { isENOENT } from "@/infrastructure/utils/errors";
import {
  ensureDirForFile,
  InvalidJsonFileError,
  readJsonFile,
  writeFileAtomic,
} from "@/infrastructure/utils/fs";
import { log, logWithDuration } from "@/lib/log";

const lg = log.child({ ns: "infra:pages", kind: "fs" });

// Garde simple anti-traversée (défense en profondeur).
function assertSafeSlug(slug: string) {
  if (!isValidSlug(slug)) {
    throw new Error(`Unsafe slug: "${slug}"`);
  }
}

export class FileSystemPagesRepository implements PagesRepository {
  private readonly root: string;
  constructor(contentRoot = join(process.cwd(), "content")) {
    this.root = contentRoot;
  }

  private dir(state: ContentState) {
    return join(this.root, state, "pages");
  }
  private file(state: ContentState, slug: string) {
    return join(this.dir(state), `${slug}.json`);
  }

  async ensureBase(): Promise<void> {
    return logWithDuration("pages.ensureBase", async () => {
      try {
        // crée les dossiers pour draft/published
        await ensureDirForFile(this.file(DEFAULT_CONTENT_STATE, "placeholder"));
        await ensureDirForFile(
          this.file(PUBLISHED_CONTENT_STATE, "placeholder")
        );
        lg.debug("ensureBase.ok");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        lg.warn("ensureBase.failed", { msg });
        throw e;
      }
    });
  }

  async read(state: ContentState, slug: string): Promise<Page | null> {
    assertSafeSlug(slug);
    const path = this.file(state, slug);

    return logWithDuration("pages.read", async () => {
      try {
        const page = await readJsonFile<Page>(path);
        lg.debug("read.ok", { state, slug });
        return page;
      } catch (e: unknown) {
        const code = (e as { code?: unknown })?.code;
        // page absente
        if (code === isENOENT) {
          lg.debug("read.miss", { state, slug });
          return null;
        }
        if (e instanceof InvalidJsonFileError) {
          lg.warn("read.invalid_json", {
            state,
            slug,
            path: e.path,
            hint: "Corrigez le JSON sur disque ou supprimez le fichier.",
          });
        } else {
          const msg = e instanceof Error ? e.message : String(e);
          lg.warn("read.failed", { state, slug, msg });
        }
        throw e;
      }
    });
  }

  async put(state: ContentState, page: Page): Promise<void> {
    assertSafeSlug(page.slug);
    const path = this.file(state, page.slug);
    return logWithDuration("pages.write", async () => {
      try {
        await writeFileAtomic(path, JSON.stringify(page, null, 2), "utf-8");
        lg.debug("write.ok", { state, slug: page.slug });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        lg.warn("write.failed", {
          state,
          slug: page.slug,
          msg,
        });
        throw e;
      }
    });
  }

  async delete(state: ContentState, slug: string): Promise<void> {
    assertSafeSlug(slug);
    const path = this.file(state, slug);
    return logWithDuration("pages.delete", async () => {
      try {
        await fs.unlink(path);
        lg.debug("delete.ok", { state, slug });
      } catch (e: unknown) {
        const code = (e as { code?: unknown })?.code;
        if (code === isENOENT) {
          lg.debug("delete.idempotent.miss", {
            state,
            slug,
          });
          return;
        }
        const msg = e instanceof Error ? e.message : String(e);
        lg.warn("delete.failed", { state, slug, msg });
        throw e;
      }
    });
  }

  async exists(state: ContentState, slug: string): Promise<boolean> {
    assertSafeSlug(slug);
    try {
      await fs.stat(this.file(state, slug));
      return true;
    } catch {
      return false;
    }
  }

  // NEW
  async list(state: ContentState): Promise<Array<PageSummary>> {
    const dir = this.dir(state);

    return logWithDuration("pages.list", async () => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const jsonFiles = entries.filter(
          (e) => e.isFile() && e.name.endsWith(".json")
        );

        // Lis en parallèle, en tolérant les JSON invalides (warn + skip)
        const results = await Promise.all(
          jsonFiles.map(async (e) => {
            const filePath = join(dir, e.name);
            try {
              const p = await readJsonFile<
                Partial<Pick<Page, "id" | "slug" | "title">>
              >(filePath);

              const slug = p?.slug ?? e.name.replace(/\.json$/i, "");
              const id = p?.id ?? null;
              const title = p?.title ?? null;

              if (!id || !title) {
                const missing: Array<"id" | "title"> = [];
                if (!id) {
                  missing.push("id");
                }
                if (!title) {
                  missing.push("title");
                }
                lg.warn("list.missing_fields", {
                  state,
                  path: filePath,
                  missing,
                });
                return null; // skip ce fichier
              }

              return {
                id,
                slug,
                title,
              };
            } catch (err) {
              if (err instanceof InvalidJsonFileError) {
                lg.warn("list.invalid_json", { state, path: err.path });
                return null; // skip ce fichier
              }
              throw err;
            }
          })
        );

        return results.filter((x): x is PageSummary => x != null);
      } catch (e: unknown) {
        const code = (e as { code?: unknown })?.code;
        if (code === isENOENT) {
          // Dossier pas encore créé → idempotent : []
          return [];
        }
        throw e;
      }
    });
  }
}
