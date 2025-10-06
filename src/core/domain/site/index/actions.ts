/**
 * @file src/core/domain/site/index/constants.ts
 * @intro SoT — constants du runner `updateSiteIndex`
 * @layer domain/constants
 */

import type { PageRef } from "@/core/domain/site/entities/site-index";
import type { PositionSpecifier } from "@/core/domain/site/index/utils";

export const SITE_INDEX_ACTIONS = {
  ENSURE_PAGE_LISTED: "ensurePageListed",
  REMOVE_BY_SLUG: "removeBySlug",
} as const;

export type SiteIndexActionType =
  (typeof SITE_INDEX_ACTIONS)[keyof typeof SITE_INDEX_ACTIONS];

export type EnsurePageListedAction = Readonly<{
  type: typeof SITE_INDEX_ACTIONS.ENSURE_PAGE_LISTED;
  ref: Readonly<PageRef>;
  position?: Readonly<PositionSpecifier>;
}>;

export type RemoveBySlugAction = Readonly<{
  type: typeof SITE_INDEX_ACTIONS.REMOVE_BY_SLUG;
  slug: string;
}>;

export type SiteIndexAction = EnsurePageListedAction | RemoveBySlugAction;
