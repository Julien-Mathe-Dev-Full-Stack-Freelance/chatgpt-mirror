// src/infrastructure/http/shared/_internal.ts
import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { apiFetch, HttpError } from "@/lib/http/api-fetch";
import { log } from "@/lib/log";

const lg = log.child({ ns: "infra:http" });

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

/** Détection d'URL absolue (http:, https:, data:, etc.) */
function isAbsoluteUrl(s: string) {
  return /^[a-z][a-z0-9+.-]*:/.test(s);
}

/** Join propre de la base + path (ne préfixe pas si path est absolu). */
export function resolveApiUrl(path: string) {
  if (!API_BASE || isAbsoluteUrl(path)) return path;
  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

/** Petit chrono utilitaire si tu en as l’usage ailleurs. */
export async function time<T>(
  _op: string,
  fn: () => Promise<T>
): Promise<{ result: T; ms: number }> {
  const t0 = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - t0 };
}

/* ------------------------------- Type guards ------------------------------- */

type UnknownRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is UnknownRecord =>
  typeof v === "object" && v !== null;

function readStringProp(obj: UnknownRecord, key: string): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}
function readNumberProp(obj: UnknownRecord, key: string): number | undefined {
  const v = obj[key];
  return typeof v === "number" ? v : undefined;
}
function readCodeProp(
  obj: UnknownRecord,
  key: string
): string | number | undefined {
  const v = obj[key];
  return typeof v === "string" || typeof v === "number" ? v : undefined;
}
function readRecordProp(
  obj: UnknownRecord,
  key: string
): UnknownRecord | undefined {
  const v = obj[key];
  return isRecord(v) ? v : undefined;
}

// Garde utilitaire pour détecter un AbortError de manière tolérante.
function isAbortError(e: unknown): boolean {
  if (typeof DOMException !== "undefined" && e instanceof DOMException) {
    // DOMException a bien une propriété name typée
    return e.name === "AbortError";
  }
  return isRecord(e) && readStringProp(e, "name") === "AbortError";
}
/** Extraction robuste de métadonnées d’erreur (status/code) sans `any`. */
function extractHttpErrorMeta(e: unknown): {
  status?: number;
  code?: string | number;
} {
  if (e instanceof HttpError) {
    return { status: e.status, code: e.code };
  }

  if (!isRecord(e)) return {};

  const status =
    readNumberProp(e, "status") ??
    (() => {
      const resp = readRecordProp(e, "response");
      return resp ? readNumberProp(resp, "status") : undefined;
    })();

  const code =
    readCodeProp(e, "code") ??
    (() => {
      const body = readRecordProp(e, "body");
      return body ? readCodeProp(body, "code") : undefined;
    })() ??
    (() => {
      const resp = readRecordProp(e, "response");
      const data = resp ? readRecordProp(resp, "data") : undefined;
      return data ? readCodeProp(data, "code") : undefined;
    })();

  return { status, code };
}

/**
 * Helper générique instrumenté (centralise logs succès/échec + AbortSignal).
 */
export async function request<T>(
  op: string,
  url: string,
  init: RequestInit,
  opts?: HttpOpts
): Promise<T> {
  const t0 = Date.now();
  const method = (init.method ?? "GET").toUpperCase();
  const fullUrl = resolveApiUrl(url);

  lg.debug("http.start", { op, method, url: fullUrl });

  try {
    const res = await apiFetch<T>(fullUrl, { ...init, signal: opts?.signal });
    lg.debug("http.ok", { op, method, url: fullUrl, ms: Date.now() - t0 });
    return res;
  } catch (e: unknown) {
    if (isAbortError(e)) {
      lg.debug("http.abort", {
        op,
        method,
        url: fullUrl,
        ms: Date.now() - t0,
      });
      throw e;
    }
    const { status, code } = extractHttpErrorMeta(e);
    const msg = e instanceof Error ? e.message : undefined;
    lg.warn("http.failed", {
      op,
      method,
      url: fullUrl,
      ms: Date.now() - t0,
      status,
      code,
      msg,
    });
    throw e;
  }
}
