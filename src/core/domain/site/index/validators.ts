/**
 * @file src/core/domain/site/index/validators.ts
 * @intro Validateur d’invariants pour SiteIndex (unicité, existence).
 * @description
 * Règles métier transverses non couvertes par Zod :
 * - Unicité des `id` et des `slug` dans `pages[]`.
 * - (optionnel) Existence des ids/slugs référencés dans le repo ciblé.
 *
 * @layer domain/validators
 * @remarks
 * - À appeler depuis les use-cases (avant persistance/publish).
 * - Ne jette pas : retourne des issues structurées.
 * - Types minimaux, découplés des schémas.
 */

import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import type { BlockingIssue } from "@/core/domain/errors/issue-types";

export type SiteIndexPageRefLike = Readonly<{
  id: string;
  slug: string;
  title: string;
}>;

export type SiteIndexLike = Readonly<{
  pages: ReadonlyArray<SiteIndexPageRefLike>;
}>;

export type SiteIndexIssue = BlockingIssue;

export type SiteIndexKnownLookup = Readonly<{
  /** Ids réellement présents dans le repo (état ciblé). */
  knownIds?: Iterable<string>;
  /** Slugs réellement présents dans le repo (état ciblé). */
  knownSlugs?: Iterable<string>;
}>;

/**
 * Vérifie les invariants d’un SiteIndex.
 */
export function checkSiteIndexInvariants(
  index: SiteIndexLike,
  lookup?: SiteIndexKnownLookup
): ReadonlyArray<SiteIndexIssue> {
  const issues: SiteIndexIssue[] = [];

  const byId = new Map<string, number[]>();
  const bySlug = new Map<string, number[]>();

  index.pages.forEach((p, i) => {
    byId.set(p.id, [...(byId.get(p.id) ?? []), i]);
    bySlug.set(p.slug, [...(bySlug.get(p.slug) ?? []), i]);
  });

  // Doublons d'id
  for (const idxs of byId.values()) {
    if (idxs.length > 1) {
      idxs.slice(1).forEach((i) =>
        issues.push({
          code: EC.SITE_INDEX_DUPLICATE_ID,
          path: ["pages", i, "id"],
          meta: { allOccurrences: idxs },
        })
      );
    }
  }

  // Doublons de slug
  for (const idxs of bySlug.values()) {
    if (idxs.length > 1) {
      idxs.slice(1).forEach((i) =>
        issues.push({
          code: EC.SITE_INDEX_DUPLICATE_SLUG,
          path: ["pages", i, "slug"],
          meta: { allOccurrences: idxs },
        })
      );
    }
  }

  // Existence réelle (optionnelle)
  if (lookup?.knownIds) {
    const known = new Set(lookup.knownIds);
    index.pages.forEach((p, i) => {
      if (!known.has(p.id)) {
        issues.push({
          code: EC.SITE_INDEX_MISSING_PAGE_ID,
          path: ["pages", i, "id"],
        });
      }
    });
  }

  if (lookup?.knownSlugs) {
    const known = new Set(lookup.knownSlugs);
    index.pages.forEach((p, i) => {
      if (!known.has(p.slug)) {
        issues.push({
          code: EC.SITE_INDEX_MISSING_PAGE_SLUG,
          path: ["pages", i, "slug"],
        });
      }
    });
  }

  return issues;
}

/** Vrai si aucune issue n’est détectée. */
export function isSiteIndexValid(
  index: SiteIndexLike,
  lookup?: SiteIndexKnownLookup
): boolean {
  return checkSiteIndexInvariants(index, lookup).length === 0;
}
