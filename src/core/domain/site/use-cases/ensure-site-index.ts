/**
 * @file src/core/domain/site/use-cases/ensure-site-index.ts
 * @intro Use-case — “ensure” du SiteIndex (seed-once au premier accès)
 * @layer domain/use-case
 *
 * Principe :
 * - On lit via repo.find(state).
 * - Si inexistant → on persiste un SEED fourni (UI/route/i18n) puis on le retourne.
 * - Si existant  → on retourne tel quel (aucun reseed).
 *
 * Remarques :
 * - Le seed peut être neutre (DEFAULT_SITE_INDEX) ou localisé côté UI/route.
 * - Aucune logique métier ici : pas d’ordonnancement/validation (la logique reste
 *   dans les use-cases ou validators dédiés).
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { SiteIndex } from "@/core/domain/site/entities/site-index";

/** Mini-port pour l’index (utile côté adapters/route). */
export interface SiteIndexRepo {
  /** Retourne l’index pour `state`, ou `null` s’il n’existe pas encore. */
  find(state: ContentState): Promise<SiteIndex | null>;
  /** Persiste l’index pour `state` (écrase/remplace si déjà présent). */
  save(next: SiteIndex, state: ContentState): Promise<void>;
}

/**
 * Ensure — SiteIndex
 * @param repo Port minimaliste (find/save) implémenté par l’adapter.
 * @param seed Index de seed si absent (peut venir d’une factory i18n).
 * @param state Espace logique (draft/published).
 * @returns L’index existant ou le seed fraîchement persisté.
 */
export async function ensureSiteIndex(
  repo: SiteIndexRepo,
  seed: SiteIndex,
  state: ContentState
): Promise<SiteIndex> {
  const current = await repo.find(state);
  if (current) return current;
  await repo.save(seed, state);
  return seed;
}
