/**
 * @file src/core/domain/pages/use-cases/update-page.types.ts
 * @intro Types du use-case `UpdatePage` (intent « patch » ciblée)
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { Page, PageSitemap } from "@/core/domain/pages/entities/page";
import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { RunUpdateSiteIndex } from "@/core/domain/site/use-cases/site-index/update-site-index.types";
import type { PageId } from "../../ids/schema";

/** Intention UC : patch ciblé + identifiant fonctionnel (currentSlug). */
export type UpdatePageInput = {
  /** Slug courant identifiant la page à modifier. */
  currentSlug: string;

  /** Nouveau titre (optionnel). */
  title?: string;

  /** Nouveau slug “raw” (optionnel) — normalisé/validé dans le UC. */
  slug?: string;

  /** Patch sitemap optionnel (include/changefreq/priority). */
  sitemap?: Partial<PageSitemap>;

  /** Espace logique ciblé. Défaut dans l’implémentation : "draft". */
  state?: ContentState;
};

/** Résultat : page mise à jour + index synchronisé. */
export interface UpdatePageResult {
  page: Page;
  index: SiteIndex;
}

/** Dépendances techniques injectées (IoC). */
export interface UpdatePageDeps {
  pages: PagesRepository;
  siteIndex: RunUpdateSiteIndex;
  nowIso?: () => string;
}
