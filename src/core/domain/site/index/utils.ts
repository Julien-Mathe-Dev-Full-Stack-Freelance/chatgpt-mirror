/**
 * @file src/core/domain/site/index/utils.ts
 * @intro Helpers purs pour manipuler l’index (immutables)
 * @layer domain/helpers
 */

import { POS_APPEND, POS_PREPEND } from "@/core/domain/constants/common";
import type { PageId } from "@/core/domain/ids/schema";
import type {
  PageRef,
  SiteIndex,
} from "@/core/domain/site/entities/site-index";

/** Positionnement optionnel lors d’un ajout. */
export type PositionSpecifier =
  | typeof POS_APPEND
  | typeof POS_PREPEND
  | { beforeId: PageId }
  | { afterId: PageId };

function alreadyHasId(pages: SiteIndex["pages"], id: string) {
  return pages.some((p) => p.id === id);
}

/** Insertion avec position — **no-op ⇒ même référence**. */
function insertWithPosition(
  pages: SiteIndex["pages"],
  ref: Readonly<PageRef>,
  position: Readonly<PositionSpecifier> = POS_APPEND
): SiteIndex["pages"] {
  if (alreadyHasId(pages, ref.id)) return pages; // ⬅️ no-op: même ref

  const next = [...pages];
  if (position === POS_APPEND) {
    next.push({ ...ref });
  } else if (position === POS_PREPEND) {
    next.unshift({ ...ref });
  } else if ("beforeId" in position) {
    const i = next.findIndex((p) => p.id === position.beforeId);
    if (i >= 0) next.splice(i, 0, { ...ref });
    else next.push({ ...ref });
  } else if ("afterId" in position) {
    const i = next.findIndex((p) => p.id === position.afterId);
    if (i >= 0) next.splice(i + 1, 0, { ...ref });
    else next.push({ ...ref });
  }
  return next;
}

/** Upsert par id — **no-op ⇒ mêmes références**. */
export function upsertPageRef(
  index: SiteIndex,
  ref: Readonly<PageRef>,
  position: Readonly<PositionSpecifier> = POS_APPEND
): SiteIndex {
  const i = index.pages.findIndex((p) => p.id === ref.id);
  if (i >= 0) {
    const prev = index.pages[i];
    // Si rien ne change, renvoyer l’index **inchangé** (même refs)
    if (prev.slug === ref.slug && prev.title === ref.title) return index;
    const pages = index.pages.slice();
    pages[i] = { ...prev, ...ref };
    return { ...index, pages };
  }
  return { ...index, pages: insertWithPosition(index.pages, ref, position) };
}

/** Remove par slug — no-op ⇒ même référence. */
export function removePageBySlug(
  index: SiteIndex,
  slug: string
): { next: SiteIndex; removed: boolean } {
  const before = index.pages.length;
  const pages = index.pages.filter((p) => p.slug !== slug);
  if (pages.length === before) return { next: index, removed: false };
  return { next: { ...index, pages }, removed: true };
}

/** Remove par id — no-op ⇒ même référence. */
export function removePageById(
  index: SiteIndex,
  id: string
): { next: SiteIndex; removed: boolean } {
  const before = index.pages.length;
  const pages = index.pages.filter((p) => p.id !== id);
  if (pages.length === before) return { next: index, removed: false };
  return { next: { ...index, pages }, removed: true };
}

/** Déplacement — no-op ⇒ même référence (déjà le cas). */
// function movePage(
//   pages: SiteIndex["pages"],
//   id: string,
//   toIndex: number
// ): SiteIndex["pages"] {
//   const src = pages.findIndex((p) => p.id === id);
//   if (src < 0) return pages; // no-op: même ref
//   const bounded = Math.max(0, Math.min(toIndex, pages.length - 1));
//   if (bounded === src) return pages; // no-op: même ref
//   const next = [...pages];
//   const [it] = next.splice(src, 1);
//   next.splice(bounded, 0, it);
//   return next;
// }

// function hasUniqueIdsAndSlugs(index: Readonly<SiteIndex>): boolean {
//   const ids = new Set<string>();
//   const slugs = new Set<string>();
//   for (const p of index.pages) {
//     if (ids.has(p.id) || slugs.has(p.slug)) return false;
//     ids.add(p.id);
//     slugs.add(p.slug);
//   }
//   return true;
// }
