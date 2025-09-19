/**
 * @file src/core/domain/pages/entities/page.ts
 * @intro Entité métier Page (source de vérité côté domaine)
 * @description
 * Représente une page éditable (titre, slug, layout, blocks, métadonnées).
 * Les defaults/validations fortes sont gérés côté schémas Zod + use-cases.
 *
 * @layer domain/entity
 * @remarks
 * - Persistance via les ports du domaine (ex. PagesRepository).
 * - Aucune logique ici : structure de données pure.
 * - ID: voir SoT des IDs (prefix "pg_", size 24) dans `core/domain/ids/schema.ts`.
 * - Blocks: voir SoT `core/domain/blocks/model.ts` (union discriminée).
 */

import type {
  SectionAlignX,
  SectionMaxWidth,
  SectionSpacingY,
} from "@/core/domain/constants/layout";
import type { Block } from "@/core/domain/blocks/model";
import type { PageId } from "@/core/domain/ids/schema";

/** Mise en page disponible pour une page. */
export interface PageLayout {
  /** Largeur maximale du contenu. */
  maxWidth: SectionMaxWidth;
  /** Espacement vertical entre sections/blocks. */
  spacingY: SectionSpacingY;
  /** Alignement horizontal du contenu principal. */
  align: SectionAlignX;
}

/** Métadonnées de gestion (timestamps ISO 8601). */
export interface PageMeta {
  /** Chaîne ISO UTC (ex: 2023-10-31T12:34:56.789Z). Validée côté schéma. */
  createdAt: string;
  updatedAt: string;
}

/** Entité principale. */
export interface Page {
  /** Identifiant page (cf. ID_SCHEMAS.page: prefix "pg_", size 24). */
  id: PageId;
  /** Slug (kebab-case), normalisé (cf. SoT slugs). */
  slug: string;
  /** Titre de la page (limites cf. constants/limits). */
  title: string;
  /** Layout canonique (Section*). */
  layout: PageLayout;
  /** Blocs typés via union discriminée (SoT blocks/model). */
  blocks: ReadonlyArray<Block>;
  /** Métadonnées. */
  meta: PageMeta;
}

/** Index d’une page basé sur l’entité (sans dépendre du Site). */
export type PageSummary = Pick<Page, "id" | "slug" | "title">;
