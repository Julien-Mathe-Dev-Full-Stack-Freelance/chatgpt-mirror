/**
 * @file src/core/domain/site/use-cases/site-index/update-site-index.types.ts
 * @intro Types du use-case `updateSiteIndex` (pattern homogénéisé).
 * @layer domain/use-case
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { SiteIndexAction } from "@/core/domain/site/index/actions";
import type { SiteRepository } from "@/core/domain/site/ports/site-repository";

export interface UpdateSiteIndexDeps {
  /** Dépôt agrégat “site” (index + settings). */
  repo: SiteRepository;
  /** Horloge ISO injectable (tests/déterminisme). */
  nowIso?: () => string;
}

export interface UpdateSiteIndexInput {
  state?: ContentState; // défaut dans l’implémentation → "draft"
  action: SiteIndexAction; // ← SoT unique (actions.ts)
}

export interface UpdateSiteIndexResult {
  index: SiteIndex;
}

/** Runner type pour DI/tests */
export type RunUpdateSiteIndex = (
  input: UpdateSiteIndexInput
) => Promise<UpdateSiteIndexResult>;
