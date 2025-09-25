/**
 * @file src/core/domain/pages/dto.ts
 * @intro DTOs exposés pour le module Pages
 * @layer domain/dto
 * @remarks
 * - Les DTOs servent de contrat aux adapters (API/UI). Ils peuvent diverger de
 *   l’entité `Page` si la frontière l’exige (ex. champs optionnels lors de la
 *   création).
 * - La validation de forme est assurée par les schémas Zod côté adapter.
 */

import type { Block } from "@/core/domain/blocks/model";
import type { Page, PageLayout } from "@/core/domain/pages/entities/page";
import type { PageId } from "@/core/domain/ids/schema";

/** DTO complet (lecture) aligné sur l’entité domaine. */
export type PageDTO = Readonly<Page>;

/** DTO d’entrée pour la création d’une page. */
export type CreatePageDTO = Readonly<{
  title: Page["title"];
  slug?: Page["slug"];
  layout?: Partial<PageLayout>;
  blocks?: ReadonlyArray<Block>;
  /** Payload libre laissé aux adapters pour sérialiser des blocks custom. */
  content?: unknown;
}>;

/** DTO pour la mise à jour partielle d’une page existante. */
export type UpdatePageDTO = Readonly<{
  id: PageId;
  title?: Page["title"];
  slug?: Page["slug"];
  layout?: Partial<PageLayout>;
  blocks?: ReadonlyArray<Block>;
  content?: unknown;
}>;

export type DeletePageDTO = Readonly<{ id: PageId }>;

export type PatchPageDTO = Readonly<{
  id: PageId;
  ops: ReadonlyArray<
    | { op: "replace"; path: string; value: unknown }
    | { op: "remove"; path: string }
    | { op: "add"; path: string; value: unknown }
  >;
}>;
