/**
 * @file src/lib/http/abortError.ts
 * @intro Détection SSR/CSR sûre d'un AbortError
 */

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

export function newAbort(): AbortController {
  return new AbortController();
}

export function isAbortError(error: unknown): boolean {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    return error.name === "AbortError";
  }

  if (isRecord(error) && typeof error["name"] === "string") {
    return error["name"] === "AbortError";
  }

  return false;
}
