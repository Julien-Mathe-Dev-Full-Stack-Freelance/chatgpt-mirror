/**
 * @file src/core/domain/site/ports/site-repository.ts
 * @intro Port de persistance pour l’agrégat Site (index + settings)
 * @description
 * Contrat unique pour l’agrégat “site” : **index** (ordre de navigation) + **settings** (header, …).
 * Aucune logique ici ; l’infrastructure fournit une implémentation (FS, DB, etc.).
 *
 * @layer domain/ports
 *
 * @todo(concurrency) Garantir l’atomicité `writeIndex`/`writeSettings` si l’impl le permet.
 * @todo(versioning) Envisager une clé `version` dans `SiteSettings` pour migrations futures.
 * @todo(perf) Offrir des méthodes partielles (ex. `readHeaderSettings`) si besoin ciblé.
 */

import type { SiteIndex } from "@/core/domain/site/entities/site-index";
import type { SiteSettings } from "@/core/domain/site/entities/site-settings";
import type { ContentState } from "@/core/domain/constants/common";

/**
 * Port de persistance pour l’agrégat Site.
 * Les méthodes doivent être **idempotentes** autant que possible.
 */
export interface SiteRepository {
  /**
   * Prépare le support de persistance (dossiers/fichiers, tables…).
   * Doit être **sans effet** si déjà initialisé.
   */
  ensureBase(): Promise<void>;

  /** Lit l’index (ordre des pages) pour l’état donné. */
  readIndex(state: ContentState): Promise<SiteIndex>;

  /** Écrit/remplace l’index pour l’état donné. */
  writeIndex(state: ContentState, index: Readonly<SiteIndex>): Promise<void>;

  /** Lit les réglages du site (ex. header) pour l’état donné. */
  readSettings(state: ContentState): Promise<SiteSettings>;

  /** Écrit/remplace les réglages du site pour l’état donné. */
  writeSettings(
    state: ContentState,
    settings: Readonly<SiteSettings>
  ): Promise<void>;
}
