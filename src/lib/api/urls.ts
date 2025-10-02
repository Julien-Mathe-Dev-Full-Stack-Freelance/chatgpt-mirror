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
import { isAbsoluteUrlLike } from "@/core/domain/constants/web";

const LOCALHOST_ORIGIN = "http://localhost";

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

/**
 * Variante basée sur une `URL` sous forme de string.
 * Vérifie `?state=published`; sinon renvoie le `fallback`.
 */
export function parseContentStateFromUrl(
  urlString: string,
  fallback: ContentState = DEFAULT_CONTENT_STATE
): ContentState {
  const url = new URL(urlString, LOCALHOST_ORIGIN); // base required if relative in some runtimes
  const s = url.searchParams.get("state");
  return s === PUBLISHED_CONTENT_STATE ? PUBLISHED_CONTENT_STATE : fallback;
}

/**
 * Ajoute/force le paramètre `state` sur une URL.
 * - Entrée absolue → renvoie une URL absolue.
 * - Entrée relative → renvoie une URL relative (préfixe base retiré).
 */
export function withContentState(url: string | URL, state: ContentState) {
  if (typeof url === "string") {
    const wasAbsolute = isAbsoluteUrlLike(url);
    const instance = new URL(url, LOCALHOST_ORIGIN);
    instance.searchParams.set("state", state);

    if (wasAbsolute) {
      return instance.toString();
    }

    if (url.startsWith("?")) {
      return `${instance.search}${instance.hash}`;
    }

    if (url.startsWith("#")) {
      return `${instance.search}${instance.hash}`;
    }

    const pathname = instance.pathname.startsWith("/")
      ? instance.pathname.slice(1)
      : instance.pathname;

    if (!url.startsWith("/") && !url.startsWith(".")) {
      return `${pathname}${instance.search}${instance.hash}`;
    }

    return `${instance.pathname}${instance.search}${instance.hash}`;
  }

  const instance = new URL(url.toString());
  instance.searchParams.set("state", state);
  return instance.toString();
}
