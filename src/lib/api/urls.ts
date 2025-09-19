/**
 * @file src/lib/api/urls.ts
 * @intro Helpers de parsing d’URL côté API (query param `state`)
 * @description
 * Centralise l’extraction et la validation du paramètre `?state=draft|published`
 * depuis les requêtes de l’App Router ou une URL arbitraire.
 *
 * Observabilité :
 * - Aucune (helpers purs).
 *
 * @layer lib/api
 * @remarks
 * - En cas de valeur absente ou invalide, un `fallback` est utilisé (défaut: `"draft"`).
 * - Seule la valeur littérale `"published"` force ce state ; tout le reste retombe sur `fallback`.
 */

import {
  DEFAULT_CONTENT_STATE,
  PUBLISHED_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";

const LOCALHOST_ORIGIN = "http://localhost";

const ABSOLUTE_URL_RE = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

function isAbsoluteUrl(input: string): boolean {
  return ABSOLUTE_URL_RE.test(input) || input.startsWith("//");
}

/**
 * Lit le `ContentState` depuis un objet `Request` (App Router).
 * Vérifie `?state=published`; sinon renvoie le `fallback`.
 *
 * @param req Requête entrante (App Router).
 * @param fallback Valeur de repli si `state` est absent/invalid (défaut: `"draft"`).
 * @returns `"published"` si `state=published`, sinon `fallback`.
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
 *
 * @param urlString URL complète (absolute/relative acceptée par le ctor `URL` avec base implicite côté runtime).
 * @param fallback Valeur de repli si `state` est absent/invalid (défaut: `"draft"`).
 * @returns `"published"` si `state=published`, sinon `fallback`.
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
    const wasAbsolute = isAbsoluteUrl(url);
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
