/**
 * @file src/core/domain/slug/validator.ts
 * @intro Validateur de slug — invariant générique + wrappers contexte Page + warnings UI
 * @layer core/domain
 *
 * @description
 * - `assertSlug(raw, opts)` : invariant **générique** (forme + réservations) → lève `DomainError` avec des `ErrorCode` **valides**.
 * - `getSlugUiWarnings(raw, path?)` : avertissements **UI** non-bloquants (aujourd’hui : normalisation différente).
 * - Wrappers **Page** :
 *    - `assertPageSlug(raw, path?)` : mappe les erreurs vers `ERROR_CODES.PAGE_*`.
 *    - `getPageSlugUiWarnings(raw, path?)` : alias typé pour l’UI.
 *
 * Rappels :
 * - La normalisation finale, la gestion des collisions et la persistance vivent dans les use-cases.
 * - Les messages sont gérés côté UI/i18n ; ici on expose des **codes stables** + `details`.
 */

import { ERROR_CODES, type ErrorCode } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";
import type { UiWarning } from "@/core/domain/errors/issue-types";
import { SLUG_FINAL_RE } from "@/core/domain/slug/constants";
import { isReservedSlug, normalizeSlug } from "@/core/domain/slug/utils";

/** Avertissements UI (non-bloquants) — codes **locaux** (pas dans ERROR_CODES). */
export type SlugWarning = UiWarning<"SLUG_NORMALIZED_DIFFERENT">;

/** Options pour l’invariant générique de slug. */
type SlugAssertOptions = Readonly<{
  /** Détection des slugs réservés pour ce contexte (défaut : `isReservedSlug`). */
  reserved?: (normalized: string) => boolean;
  /** Codes d’erreur **métier** à lever. */
  codes: Readonly<{
    required: ErrorCode;
    invalid: ErrorCode;
    reserved: ErrorCode;
  }>;
  /** Chemin par défaut pour `details.path`. */
  pathDefault?: ReadonlyArray<string | number>;
}>;

/**
 * Invariant **générique** pour un slug.
 * - Trim/normalize → contrôle vide/format/réservation.
 * - Lève `DomainError` avec des `ErrorCode` **valides** (typés).
 */
export function assertSlug(
  raw: string | undefined,
  opts: SlugAssertOptions
): void {
  const path = (opts.pathDefault ?? ["slug"]) as (string | number)[];
  const normalized = normalizeSlug(raw ?? "");

  if (!normalized) {
    throw new DomainError({
      code: opts.codes.required,
      message: "Slug is required.",
      details: { path, meta: { reason: "emptyAfterNormalization" } },
    });
  }

  if (!SLUG_FINAL_RE.test(normalized)) {
    throw new DomainError({
      code: opts.codes.invalid,
      message: "Slug has an invalid format.",
      details: { path, meta: { normalized } },
    });
  }

  const isRes = (opts.reserved ?? isReservedSlug)(normalized);
  if (isRes) {
    throw new DomainError({
      code: opts.codes.reserved,
      message: "Slug is reserved.",
      details: { path, meta: { normalized } },
    });
  }
}

/**
 * Avertissements UI **non-bloquants** lors de l’édition d’un slug.
 * - Aujourd’hui : “différent après normalisation” (pour proposer un autocorrect).
 */
export function getSlugUiWarnings(
  raw: string | undefined,
  path: (string | number)[] = ["slug"]
): SlugWarning[] {
  const out: SlugWarning[] = [];
  const normalized = normalizeSlug(raw ?? "");
  if (raw && normalized && raw !== normalized) {
    out.push({ code: "SLUG_NORMALIZED_DIFFERENT", path, meta: { normalized } });
  }
  return out;
}

/* ─────────────────────────── Wrappers — Contexte Page ─────────────────────────── */

/** Invariant **Page** : délègue au générique avec les codes `PAGE_*`. */
export function assertPageSlug(
  raw: string | undefined,
  path: (string | number)[] = ["slug"]
): void {
  assertSlug(raw, {
    codes: {
      required: ERROR_CODES.PAGE_SLUG_REQUIRED,
      invalid: ERROR_CODES.PAGE_SLUG_INVALID_FORMAT,
      reserved: ERROR_CODES.PAGE_SLUG_RESERVED,
    },
    reserved: isReservedSlug,
    pathDefault: path,
  });
}

/** Warnings UI **Page** (alias typé). */
export function getPageSlugUiWarnings(
  raw: string | undefined,
  path: (string | number)[] = ["slug"]
): SlugWarning[] {
  return getSlugUiWarnings(raw, path);
}
