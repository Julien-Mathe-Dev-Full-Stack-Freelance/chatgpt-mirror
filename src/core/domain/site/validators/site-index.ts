/**
 * @file src/core/domain/site/validators/site-index.ts
 * @intro Invariants métier — SiteIndex (SoT)
 * @layer core/domain
 * @description
 * Valide les règles *bloquantes* pour l’index du site :
 * - Unicité des `id` dans pages[]
 * - Unicité des `slug` dans pages[]
 *
 * Lève DomainError en cas d’incohérence (code: DOMAIN_RULE_VIOLATION).
 * Les validations de forme (id/slug/title) sont déjà couvertes par Zod côté schémas.
 */

import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type {
  PageRef,
  SiteIndex,
} from "@/core/domain/site/entities/site-index";

type DupPositions = { value: string; positions: number[] };

function findDuplicatesBy<K extends "id" | "slug">(
  arr: ReadonlyArray<PageRef>,
  key: K
): DupPositions[] {
  const pos = new Map<string, number[]>();
  arr.forEach((it, i) => {
    // id et slug sont des string dans PageRef → pas besoin d’index signature
    const v = it[key]; // type: string
    const list = pos.get(v);
    if (list) list.push(i);
    else pos.set(v, [i]);
  });
  const out: DupPositions[] = [];
  for (const [value, positions] of pos) {
    if (positions.length > 1) out.push({ value, positions });
  }
  return out;
}

/** Invariants globaux pour SiteIndex. Jette DomainError si non conforme. */
export function assertSiteIndex(index: SiteIndex): void {
  const pages = index.pages ?? [];

  // Unicité par id
  const dupIds = findDuplicatesBy(pages, "id");
  // Unicité par slug
  const dupSlugs = findDuplicatesBy(pages, "slug");

  if (dupIds.length === 0 && dupSlugs.length === 0) return;

  // On lève UNE erreur agrégée (comme dans le reste de ton domaine)
  throw new DomainError({
    code: ERROR_CODES.DOMAIN_RULE_VIOLATION,
    message: "SiteIndex invariants violated (duplicates detected).",
    details: {
      path: ["index", "pages"],
      issues: {
        duplicateIds: dupIds, // [{ value: "pg_xxx", positions: [0, 3] }, ...]
        duplicateSlugs: dupSlugs, // [{ value: "about", positions: [1, 2] }, ...]
      },
    },
  });
}
