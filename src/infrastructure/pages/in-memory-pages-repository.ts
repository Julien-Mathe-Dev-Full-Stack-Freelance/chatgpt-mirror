/**
 * @file src/infrastructure/pages/in-memory-pages-repository.ts
 * @intro Implémentation InMemory du `PagesRepository` (tests/e2e)
 * @layer infrastructure
 */

import {
  PUBLISHED_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import type { Page, PageSummary } from "@/core/domain/pages/entities/page";
import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";

type Store = Map<string, Page>; // key = slug

export class InMemoryPagesRepository implements PagesRepository {
  private draft: Store = new Map();
  private published: Store = new Map();

  async ensureBase(): Promise<void> {
    // no-op
  }

  private getStore(state: ContentState): Store {
    return state === PUBLISHED_CONTENT_STATE ? this.published : this.draft;
  }

  async read(state: ContentState, slug: string): Promise<Page | null> {
    const p = this.getStore(state).get(slug);
    return p ? structuredClone(p) : null;
  }

  async put(state: ContentState, page: Page): Promise<void> {
    this.getStore(state).set(page.slug, structuredClone(page));
  }

  async delete(state: ContentState, slug: string): Promise<void> {
    this.getStore(state).delete(slug);
  }

  async exists(state: ContentState, slug: string): Promise<boolean> {
    return this.getStore(state).has(slug);
  }

  async list(state: ContentState): Promise<PageSummary[]> {
    const out: PageSummary[] = [];
    for (const p of this.getStore(state).values()) {
      out.push({ id: p.id, slug: p.slug, title: p.title });
    }
    return out;
  }
}
