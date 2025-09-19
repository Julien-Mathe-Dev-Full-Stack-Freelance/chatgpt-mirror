/**
 * @file src/core/domain/site/index/actions.ts
 * @intro SoT — actions du runner `updateSiteIndex`
 * @layer domain/constants
 */

export const SITE_INDEX_ACTIONS = {
  ENSURE_PAGE_LISTED: "ensurePageListed",
  REMOVE_BY_SLUG: "removeBySlug",
} as const;

export type SiteIndexActionType =
  (typeof SITE_INDEX_ACTIONS)[keyof typeof SITE_INDEX_ACTIONS];
