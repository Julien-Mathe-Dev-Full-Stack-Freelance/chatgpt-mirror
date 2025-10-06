/**
 * @file src/core/domain/pages/validators/page.ts
 * @intro Invariants métier — Page (V0.5)
 * @layer core/domain
 * @description
 * - Bloquants : `title` non vide (trim) + `slug` valide (via wrapper local `assertPageSlug`).
 * - Warnings UI : `getPageSlugUiWarnings` (proxy typé vers le validateur générique).
 * - Délègue la logique de forme au validateur générique de slug (`core/domain/slug/validator.ts`).
 */

import { ERROR_CODES as EC } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type { Page } from "@/core/domain/pages/entities/page";
import {
  assertSlug,
  getSlugUiWarnings,
  type SlugWarning,
} from "@/core/domain/slug/validator";

/* ─────────────────────────── Wrappers contexte Page ─────────────────────────── */

/**
 * Invariant **Page** — valide le slug en mappant vers les codes `PAGE_*`.
 * @throws DomainError avec codes `PAGE_SLUG_*` si invalide.
 */
export function assertPageSlug(
  raw: string | undefined,
  path: (string | number)[] = ["slug"]
): void {
  assertSlug(raw, {
    codes: {
      required: EC.PAGE_SLUG_REQUIRED,
      invalid: EC.PAGE_SLUG_INVALID_FORMAT,
      reserved: EC.PAGE_SLUG_RESERVED,
    },
    pathDefault: path,
  });
}

/**
 * Warnings UI (non-bloquants) pour l’édition du slug d’une Page.
 * - Aujourd’hui : “différent après normalisation”.
 */
export function getPageSlugUiWarnings(
  raw: string | undefined,
  path: (string | number)[] = ["slug"]
): SlugWarning[] {
  return getSlugUiWarnings(raw, path);
}

/* ─────────────────────────── Invariant Page (global) ─────────────────────────── */

/**
 * Invariants bloquants V0.5 pour une `Page`.
 * - `title` requis (trim, non vide)
 * - `slug` valide (cf. `assertPageSlug`)
 */
export function assertPage(page: Page): void {
  const title = page.title?.trim() ?? "";
  if (title.length === 0) {
    throw new DomainError({
      code: EC.PAGE_TITLE_REQUIRED,
      message: "Page.title is required.",
      details: { path: ["page", "title"] },
    });
  }

  // Slug (codes PAGE_*)
  assertPageSlug(page.slug, ["page", "slug"]);

  // V0.5 : pas d’autres invariants (sitemap, etc. non bloquants).
}
