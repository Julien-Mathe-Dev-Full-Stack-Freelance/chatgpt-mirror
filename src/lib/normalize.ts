/**
 * @file src/lib/normalize.ts
 * @intro Normalise les données pour l’interface admin.
 */

import { isAbsoluteHttpProtocol } from "@/constants/shared/web";
import { isValidSlug, normalizeSlug } from "@/core/domain/slug/utils";

export function normalizeSlugInput(v: string) {
  const s = v.trim();
  if (!s) return "";
  const out = normalizeSlug(s);
  return isValidSlug(out) ? out : s; // garde l'entrée si non conforme (la validation pilotera l'UX)
}

export function normalizeBaseUrlInput(
  value: string,
  prev?: string
): string | undefined {
  const next = value.trim();
  if (!next) return undefined;

  try {
    const url = new URL(next);
    return isAbsoluteHttpProtocol(url.protocol) && url.hostname ? next : prev;
  } catch {
    return prev;
  }
}

export function normalizeTwitterHandle(v: string) {
  const s = v.trim();
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}

import { SOCIAL_KIND_EMAIL } from "@/core/domain/site/social/constants";

/* -------- communs -------- */
/* -------- communs -------- */
const HTTPS = "https://";
const MAILTO = "mailto:";

export const isHttpAbs = (s: string) => /^https?:\/\//i.test(s?.trim());
export const isMailto = (s: string) => /^mailto:/i.test(s?.trim());
export const hasScheme = (s: string) =>
  /^[A-Za-z][A-Za-z0-9+.-]*:/i.test(s?.trim());

export const isHttpPrefixOnly = (s: string) => {
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

/* -------- menus / external -------- */
export function toExternalDraft(raw: string): string {
  let v = (raw ?? "").trim();

  // empty or obvious incomplete → just prefix
  if (!v || isHttpPrefixOnly(v)) return HTTPS;

  // relative → promote to https://
  if (v.startsWith("/")) return HTTPS;

  // mailto: or any other non-http scheme → drop scheme and start fresh
  if (!isHttpAbs(v) && hasScheme(v)) {
    v = v.replace(/^[A-Za-z][A-Za-z0-9+.-]*:/, "");
  }

  // normalize duplicated http(s) and leading slashes
  v = v.replace(/^(https?:\/\/+)+/i, "").replace(/^\/+/, "");

  return `${HTTPS}${v}`;
}

export const isMailtoPrefixOnly = (s: string) =>
  (s ?? "").trim().toLowerCase() === "mailto:";

/* -------- menus -------- */
export function toInternalDraft(raw: string): string {
  const v = (raw ?? "").trim();
  if (!v || isHttpPrefixOnly(v)) return "/";
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      return (u.pathname || "/") + (u.search || "") + (u.hash || "") || "/";
    } catch {
      const stripped = v.replace(/^https?:\/\/[^/]+/i, "");
      if (!stripped || isHttpPrefixOnly(stripped)) return "/";
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
  if (isHttpAbs(v)) return MAILTO;
  if (isMailto(v)) return v.replace(/^(mailto:)+/i, MAILTO);
  if (v.includes("@")) return `${MAILTO}${v}`;
  return MAILTO;
}

/** Normalise un href en fonction du kind sélectionné */
export function normalizeSocialHref(kind: string, href: string): string {
  return kind === SOCIAL_KIND_EMAIL
    ? toMailtoDraft(href)
    : toExternalDraft(href);
}
