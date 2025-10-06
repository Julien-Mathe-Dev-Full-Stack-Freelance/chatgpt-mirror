/**
 * @file src/lib/api/urls.ts
 * @intro Helpers de parsing d’URL côté API (query param `state`)
 * @layer lib/api
 */

import {
  DEFAULT_CONTENT_STATE,
  PUBLISHED_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";

// const LOCALHOST_ORIGIN = "http://localhost";

/**
 * Lit le `ContentState` depuis un objet `Request` (App Router).
 * Vérifie `?state=published`; sinon renvoie le `fallback`.
 */
export function parseContentStateFromRequest(
  req: Request,
  fallback: ContentState = DEFAULT_CONTENT_STATE
): ContentState {
  const url = new URL(req.url);
  const s = url.searchParams.get("state");
  return s === PUBLISHED_CONTENT_STATE ? PUBLISHED_CONTENT_STATE : fallback;
}
