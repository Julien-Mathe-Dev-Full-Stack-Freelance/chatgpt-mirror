/**
 * @file src/core/domain/urls/compare.ts
 * @intro Clés de comparaison pour href/label (détection de doublons)
 * @layer domain/utils
 *
 * NOTE: normalisation "safe" pour COMPARER uniquement (ne pas persister).
 */

import { isAbsoluteHttpProtocol } from "@/core/domain/constants/web";
import { parseMailto } from "@/core/domain/urls/mailto";

/** Normalise une URL relative pour comparaison. */
function normalizeRelativePath(input: string): string {
  let p = input.trim();
  if (!p.startsWith("/")) return p;
  p = p.replace(/\/{2,}/g, "/");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/** Trie/ordonne proprement les query params pour comparaison. */
function orderedSearchParams(raw: string): string {
  const params = new URLSearchParams(raw);
  const ordered = new URLSearchParams();
  Array.from(new Set(Array.from(params.keys()).sort())).forEach((k) => {
    const vals = params.getAll(k);
    vals.sort();
    vals.forEach((v) => ordered.append(k, v));
  });
  const out = ordered.toString();
  return out ? `?${out}` : "";
}

/** http(s): lower-case protocole/host, drop port par défaut, normalise path/query. */
function normalizeHttpLike(href: string): string | null {
  try {
    const u = new URL(href);
    if (!isAbsoluteHttpProtocol(u.protocol)) return null;

    const protocol = u.protocol.toLowerCase();
    const host = u.hostname.toLowerCase();

    const isDefaultPort =
      (protocol === "http:" && (u.port === "" || u.port === "80")) ||
      (protocol === "https:" && (u.port === "" || u.port === "443"));

    let path = u.pathname.replace(/\/{2,}/g, "/");
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    const search = orderedSearchParams(u.search);
    const hash = u.hash; // on garde le fragment

    return `${protocol}//${host}${
      isDefaultPort ? "" : `:${u.port}`
    }${path}${search}${hash}`;
  } catch {
    return null;
  }
}

/** mailto: lower-case destinataires, unique+triés, params ordonnés. */
function normalizeMailto(href: string): string | null {
  const parsed = parseMailto(href);
  if (!parsed) return null;
  const to = Array.from(
    new Set(parsed.recipients.map((r) => r.toLowerCase()))
  ).sort();
  const params = new URLSearchParams();
  Array.from(new Set(Array.from(parsed.params.keys()).sort())).forEach((k) => {
    const vals = parsed.params.getAll(k);
    vals.sort();
    vals.forEach((v) => params.append(k, v));
  });
  const q = params.toString();
  return `mailto:${to.join(",")}${q ? `?${q}` : ""}`;
}

/** Clé de comparaison href (relative/http(s)/mailto). */
export function hrefCompareKey(raw: string): string {
  const s = raw.trim();
  const i = s.indexOf(":");
  if (i > 0) {
    const proto = s.slice(0, i + 1).toLowerCase();
    if (proto === "mailto:") return normalizeMailto(s) ?? s;
    const http = normalizeHttpLike(s);
    if (http) return http;
  }
  return normalizeRelativePath(s);
}

/** Clé de comparaison label (trim + lower-case). */
export function labelCompareKey(label: string): string {
  return label.trim().toLowerCase();
}
