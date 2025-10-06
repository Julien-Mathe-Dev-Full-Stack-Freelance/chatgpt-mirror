/**
 * @file src/core/domain/pages/dto.ts
 * @intro DTOs exposés pour le module Pages (V0.5)
 * @layer domain/dto
 * @description
 * Contrats “read” alignés sur les entités du domaine, à destination des adapters
 * (API/infra). On conserve la liberté d’introduire plus tard des transformations
 * spécifiques à la frontière sans impacter le cœur du domaine.
 */

import type {
  Page,
  PageSitemap,
  PageSummary,
  SitemapChangeFreq,
} from "@/core/domain/pages/entities/page";

/** DTO complet (lecture) aligné sur l’entité Page. */
export type PageDTO = Readonly<Page>;

/** DTO résumé pour les listes/admin (slug, title, id). */
export type PageSummaryDTO = Readonly<PageSummary>;

/** DTO du sous-objet sitemap (exposé tel quel si nécessaire côté admin). */
export type PageSitemapDTO = Readonly<PageSitemap>;

/** Enum métier exportée pour typage UI/schemas (fréquence sitemap). */
export type SitemapChangeFreqDTO = SitemapChangeFreq;
