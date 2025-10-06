// src/lib/http/api-fetch.ts
/**
 * @file src/lib/http/api-fetch.ts
 * @intro Fetch JSON minimal pour l’admin (client)
 * @description
 * - Force `cache: "no-store"` pour éviter tout stale en UI d’admin.
 * - En cas de statut HTTP non-2xx, lève `HttpError` avec `{ status, code?, message, body? }`.
 * - Tolère `204 No Content` et corps vide → retourne `null`.
 *
 * @layer lib/http
 */

import type { ErrorCode } from "@/core/domain/errors/codes";

/**
 * Erreur HTTP normalisée pour les appels API de l’admin.
 * Contient le statut, un éventuel code “domaine” et le corps de réponse parsé si disponible.
 */
export class HttpError extends Error {
  /** Code HTTP renvoyé par le serveur (ex: 400, 404, 500) */
  readonly status: number;
  /** Code d’erreur applicatif éventuel (ex: "VALIDATION_ERROR") */
  readonly code?: ErrorCode | string;
  /** Corps de la réponse (déjà parsé) lorsque disponible */
  readonly body?: unknown;

  constructor(
    message: string,
    opts: { status: number; code?: ErrorCode | string; body?: unknown }
  ) {
    super(message);
    this.name = "HttpError";
    this.status = opts.status;
    this.code = opts.code;
    this.body = opts.body;
  }
}

/* --------------------------------- Helpers --------------------------------- */

type UnknownRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is UnknownRecord =>
  typeof v === "object" && v !== null;

/** Indique si un ensemble d’en-têtes contient déjà `Content-Type`. */
function hasContentType(headers?: HeadersInit): boolean {
  if (!headers) return false;
  if (headers instanceof Headers) return headers.has("Content-Type");
  if (Array.isArray(headers))
    return headers.some(([k]) => k.toLowerCase() === "content-type");
  return Object.keys(headers).some((k) => k.toLowerCase() === "content-type");
}

/** Garde de forme: { error: string | { code?: string; message?: string } } */
function isErrorEnvelope(x: unknown): x is {
  error: string | { code?: string; message?: string };
} {
  if (!isRecord(x) || !("error" in x)) return false;
  const e = (x as UnknownRecord)["error"];
  return typeof e === "string" || isRecord(e);
}

/** Garde de forme: { message: string } (en dehors d’un envelope error) */
function isMessageOnly(x: unknown): x is { message: string } {
  return isRecord(x) && typeof x["message"] === "string";
}

/* ----------------------------------- API ----------------------------------- */

/**
 * Effectue un `fetch` côté client et tente de parser le JSON de la réponse.
 * @param input URL ou Request
 * @param init Options `fetch` (méthode, en-têtes, corps, `signal`, etc.)
 * @returns Le payload parsé de type `T`, ou `null` si `204`/corps vide.
 * @throws {HttpError} Si `response.ok === false` (statut non-2xx).
 */
export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const hasBody = !!(init && "body" in init && init.body != null);
  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;
  const isUrlEncoded =
    typeof URLSearchParams !== "undefined" &&
    init?.body instanceof URLSearchParams;
  const isBlob = typeof Blob !== "undefined" && init?.body instanceof Blob;

  // Ajoute Content-Type JSON uniquement si :
  // - on envoie un corps
  // - l’appelant n’a pas déjà fourni Content-Type
  // - ce n’est pas un format géré nativement (FormData / URLSearchParams / Blob)
  const shouldAddJsonContentType =
    hasBody &&
    !hasContentType(init?.headers) &&
    !isFormData &&
    !isUrlEncoded &&
    !isBlob;

  const headers: HeadersInit = shouldAddJsonContentType
    ? { "Content-Type": "application/json", ...(init?.headers ?? {}) }
    : init?.headers ?? {};

  const res = await fetch(input, {
    cache: "no-store",
    credentials: "same-origin",
    ...init,
    headers,
  });

  if (!res.ok) {
    let code: ErrorCode | string | undefined;
    let message = res.statusText || `HTTP ${res.status}`;
    let body: unknown;

    try {
      body = await res.json();

      if (isErrorEnvelope(body)) {
        const e = body.error;
        if (typeof e === "string") {
          message = e;
        } else {
          if (typeof e.message === "string") message = e.message;
          if (typeof e.code === "string") code = e.code;
        }
      } else if (isMessageOnly(body)) {
        message = body.message;
      }
    } catch {
      // Corps non JSON ou vide → on garde `statusText` / `HTTP nnn`
    }

    throw new HttpError(message, { status: res.status, code, body });
  }

  // 204 → pas de contenu
  if (res.status === 204) return null as unknown as T;

  // Essaie de parser en JSON. Si impossible (corps vide/non JSON), retourne `null`.
  try {
    return (await res.json()) as T;
  } catch {
    return null as unknown as T;
  }
}

/* ------------------------ Guards réutilisables (UI) ------------------------ */

export function isHttpError(e: unknown): e is HttpError {
  return e instanceof HttpError;
}

export function isValidationError(
  e: unknown
): e is HttpError & { code: "VALIDATION_ERROR" } {
  return e instanceof HttpError && e.code === "VALIDATION_ERROR";
}
