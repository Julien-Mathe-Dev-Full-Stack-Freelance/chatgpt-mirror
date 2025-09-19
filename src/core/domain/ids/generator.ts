/**
 * @file src/core/domain/ids/generator.ts
 * @intro Générateur d'ids URL-safe (sans dépendance)
 */

import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";

export interface IdGen {
  gen(size: number, allowInsecureFallback?: boolean): string;
}

export const ID_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
const ALPHABET_LEN = ID_ALPHABET.length;

type CryptoLike = {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
};

function getCrypto(): CryptoLike | null {
  const candidate = (globalThis as { crypto?: CryptoLike | undefined }).crypto;
  return candidate ?? null;
}

function cryptoRandomInt(max: number): number | null {
  const cryptoObj = getCrypto();
  if (!cryptoObj) return null;
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let result: number | null = null;
  while (result === null) {
    cryptoObj.getRandomValues(buf);
    const x = buf[0];
    if (x < limit) {
      result = x % max;
    }
  }
  return result;
}

function randIndex(max: number, allowInsecureFallback: boolean): number {
  const x = cryptoRandomInt(max);
  if (x !== null) {
    return x;
  }

  if (!allowInsecureFallback) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message:
        "genId: crypto.getRandomValues unavailable and insecure fallback disabled",
    });
  }

  return Math.floor(Math.random() * max);
}

const DEFAULT_ALLOW_INSECURE_FALLBACK =
  typeof process !== "undefined" && process.env?.NODE_ENV === "production"
    ? false
    : true;

export function genId(size: number, allowInsecureFallback?: boolean): string {
  if (!Number.isInteger(size) || size <= 0)
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message: "genId: size must be a positive integer",
    });
  const fallback = allowInsecureFallback ?? DEFAULT_ALLOW_INSECURE_FALLBACK;
  let out = "";
  for (let i = 0; i < size; i++) {
    out += ID_ALPHABET[randIndex(ALPHABET_LEN, fallback)];
  }
  return out;
}

export const systemIdGen: IdGen = { gen: genId };
