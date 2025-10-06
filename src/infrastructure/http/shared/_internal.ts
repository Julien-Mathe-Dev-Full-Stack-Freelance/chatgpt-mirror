/**
 * @file src/infrastructure/http/shared/_internal.ts
 * @intro Helpers pour l’admin (client)
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";

// ————————————————————————————————————————————————
// Petits helpers HTTP “infra” côté client (admin)
// ————————————————————————————————————————————————

/** Ajoute ?state=… uniquement si state !== "draft". */
export function withState(path: string, state: ContentState) {
  return state === DEFAULT_CONTENT_STATE ? path : `${path}?state=${state}`;
}

/** Option standard pour tous les appels HTTP (annulation UX). */
export type HttpOpts = { signal?: AbortSignal };

/** Encodage centralisé des slugs. */
export function encodeSlug(slug: string) {
  return encodeURIComponent(slug.trim());
}
