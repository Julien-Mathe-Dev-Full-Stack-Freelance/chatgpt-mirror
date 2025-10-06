/**
 * @file src/core/domain/pages/use-cases/create-page.types.ts
 * @intro Types du use-case `CreatePage` (intent métier pur)
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { PageId } from "@/core/domain/ids/schema";
import type { Page, PageSitemap } from "@/core/domain/pages/entities/page";
import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { RunUpdateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index.types";

/** Dépendances (ports + utilitaires injectables). */
export interface CreatePageDeps {
  pages: PagesRepository;
  siteIndex: RunUpdateSiteIndex;
  nowIso?: () => string;
  genId?: () => PageId;
}

/** Entrée UC : intention minimale pour créer une page. */
export type CreatePageInput = {
  /** Titre obligatoire (le UC applique le trim + validations métier). */
  title: string;

  /** Slug “raw” optionnel (sinon dérivé du titre) — normalisé/validé dans le UC. */
  slug?: string;

  /** Flags sitemap optionnels (le UC applique les defaults domaine). */
  sitemap?: Partial<PageSitemap>;

  /** Espace logique (défaut appliqué dans le UC : "draft"). */
  state?: ContentState;
};

/** Sortie UC : page créée + index synchronisé. */
export interface CreatePageResult {
  page: Page;
  index: SiteIndex;
}
