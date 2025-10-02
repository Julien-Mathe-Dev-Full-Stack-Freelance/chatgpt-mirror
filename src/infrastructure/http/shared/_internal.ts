/**
 * @file src/infrastructure/http/shared/_internal.ts
 * @intro Helpers pour l’admin (client)
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { isAbsoluteUrlLike } from "@/core/domain/constants/web";

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

/** Base API mémoïsée pour éviter de relire process.env. */
const API_BASE = (() => {
  const raw =
    process.env["NEXT_PUBLIC_API_BASE_URL"] ??
    process.env["API_BASE_URL"] ??
    "";
  return raw.replace(/\/+$/, "");
})();

/** Join propre de la base + path (ne préfixe pas si path est absolu). */
export function resolveApiUrl(path: string) {
  if (!API_BASE || isAbsoluteUrlLike(path)) return path;
  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}
