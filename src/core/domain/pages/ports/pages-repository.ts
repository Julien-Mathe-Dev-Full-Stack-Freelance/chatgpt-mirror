/**
 * @file src/core/domain/pages/ports/pages-repository.ts
 * @intro Port de persistance pour les pages
 * @description
 * Interface minimale pour un stockage **fichier-par-page** (ou équivalent) :
 * - `read/write` pour charger/écrire une page
 * - `exists` pour détecter les collisions de slug
 * - `delete?` optionnel pour permettre un renommage propre (write + delete)
 *
 * Les règles métier (normalisation slug, collisions, renommage, sync d’index)
 * sont gérées dans les **use-cases**. Le dépôt reste agnostique.
 *
 * @layer domain/ports
 */

import type { ContentState } from "@/core/domain/constants/common";
import type { Page, PageSummary } from "@/core/domain/pages/entities/page";

export interface PagesRepository {
  /**
   * Initialise le support de persistance si nécessaire
   * (ex. création de dossiers de base).
   * Doit être idempotent.
   */
  ensureBase(): Promise<void>;

  /**
   * Lit une page par `slug` dans l’espace logique donné.
   * @param state - "draft" | "published"
   * @param slug  - Slug (kebab-case) identifiant la page
   * @returns La page ou `null` si non trouvée
   */
  read(state: ContentState, slug: string): Promise<Page | null>;

  /**
   * Écrit (upsert) une page dans l’espace logique donné.
   * @param state - "draft" | "published"
   * @param page  - Entité complète à persister
   * @remarks
   * - Le use-case garantit l’unicité du slug en amont (collisions résolues).
   * - En cas de renommage, le use-case peut appeler `delete` sur l’ancien slug.
   */
  put(state: ContentState, page: Page): Promise<void>;

  /**
   * Supprime une page par `slug` (optionnel).
   * Fourni si le backend peut réellement retirer l’ancien artefact (ex. fichier).
   * @param state - "draft" | "published"
   * @param slug  - Slug à supprimer
   */
  delete(state: ContentState, slug: string): Promise<void>;

  /**
   * Indique si une page existe pour un `slug` donné.
   * Utilisé par les use-cases pour gérer les collisions de slug.
   * @param state - "draft" | "published"
   * @param slug  - Slug à tester
   */
  exists(state: ContentState, slug: string): Promise<boolean>;

  /**
   * Liste des pages (id/slug/title) **triées par `slug` ASC** pour un `state`.
   */
  list(state: ContentState): Promise<ReadonlyArray<PageSummary>>;
}
