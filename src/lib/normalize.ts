/**
 * @file src/lib/normalize.ts
 * @intro Normalise les données pour l’interface admin.
 */

import { SOCIAL_KIND_EMAIL } from "@/core/domain/site/social/constants";

/* -------- communs -------- */
const HTTPS = "https://";
const MAILTO = "mailto:";

const hasScheme = (s: string) => /^[A-Za-z][A-Za-z0-9+.-]*:/i.test(s?.trim());

export const looksLikeAbsoluteHttp = (s: string) =>
  /^https?:\/\//i.test(s?.trim());

export const looksLikeMailto = (s: string) => /^mailto:/i.test(s?.trim());

export const looksLikeHttpPrefixOnly = (s: string) => {
  const v = (s ?? "").trim().toLowerCase();
  return (
    v === "http" ||
    v === "https" ||
    v === "http:" ||
    v === "https:" ||
    v === "http:/" ||
    v === "https:/" ||
    v === "http://" ||
    v === "https://"
  );
};

export const looksLikeMailtoPrefixOnly = (s: string) =>
  (s ?? "").trim().toLowerCase() === "mailto:";

/* -------- menus / external -------- */
export function toExternalDraft(raw: string): string {
  let v = (raw ?? "").trim();

  // empty or obvious incomplete → just prefix
  if (!v || looksLikeHttpPrefixOnly(v)) return HTTPS;

  // relative → promote to https://
  if (v.startsWith("/")) return HTTPS;

  // mailto: or any other non-http scheme → drop scheme and start fresh
  if (!looksLikeAbsoluteHttp(v) && hasScheme(v)) {
    v = v.replace(/^[A-Za-z][A-Za-z0-9+.-]*:/, "");
  }

  // normalize duplicated http(s) and leading slashes
  v = v.replace(/^(https?:\/\/+)+/i, "").replace(/^\/+/, "");

  return `${HTTPS}${v}`;
}

/* -------- menus -------- */
export function toInternalDraft(raw: string): string {
  const v = (raw ?? "").trim();
  if (!v || looksLikeHttpPrefixOnly(v)) return "/";
  if (looksLikeAbsoluteHttp(v)) {
    try {
      const u = new URL(v);
      return (u.pathname || "/") + (u.search || "") + (u.hash || "") || "/";
    } catch {
      const stripped = v.replace(/^https?:\/\/[^/]+/i, "");
      if (!stripped || looksLikeHttpPrefixOnly(stripped)) return "/";
      return stripped.startsWith("/")
        ? stripped
        : `/${stripped.replace(/^\/+/, "")}`;
    }
  }
  return v.startsWith("/") ? v || "/" : `/${v.replace(/^\/+/, "")}`;
}

export function toMailtoDraft(raw: string): string {
  let v = (raw ?? "").trim();
  if (!v) return MAILTO;
  if (looksLikeAbsoluteHttp(v)) return MAILTO;
  if (looksLikeMailto(v)) return v.replace(/^(mailto:)+/i, MAILTO);
  if (v.includes("@")) return `${MAILTO}${v}`;
  return MAILTO;
}

/** Normalise un href en fonction du kind sélectionné */
export function normalizeSocialHref(kind: string, href: string): string {
  return kind === SOCIAL_KIND_EMAIL
    ? toMailtoDraft(href)
    : toExternalDraft(href);
}
