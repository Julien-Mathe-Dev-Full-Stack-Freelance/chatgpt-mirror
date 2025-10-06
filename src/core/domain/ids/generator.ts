/**
 * @file src/core/domain/ids/generator.ts
 * @intro Générateur d'identifiants URL-safe (crypto-first, sans dépendance).
 * @layer domain/ids
 * @sot docs/bible/domain/ids/README.md#generator
 * @description
 * - `genId(size, allowInsecureFallback?)` : génère un ID en alphabet URL-safe.
 * - Crypto-first : utilise `crypto.getRandomValues`; fallback **optionnel** non-cryptographique.
 * - Politique par défaut : fallback **désactivé en production**, **activé en dev/test**.
 * - Jette une `DomainError` (code `INTERNAL`) en cas de mauvais `size` ou crypto indisponible sans fallback.
 * @remarks
 * - Alphabet (`ID_ALPHABET`) : 0–9 A–Z _ a–z -  → sûr pour URLs/paths (sans encodage).
 */

import { ERROR_CODES } from "@/core/domain/errors/codes";
import { DomainError } from "@/core/domain/errors/domain-error";

interface IdGen {
  gen(size: number, allowInsecureFallback?: boolean): string;
}

/** Alphabet URL-safe (sans `+`/`/`/`=`) */
const ID_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
const ALPHABET_LEN = ID_ALPHABET.length;

type CryptoLike = {
  getRandomValues<T extends ArrayBufferView>(array: T): T;
};

function getCrypto(): CryptoLike | null {
  const candidate = (globalThis as { crypto?: CryptoLike | undefined }).crypto;
  return candidate ?? null;
}

/** Retourne un entier aléatoire ∈ [0, max) via crypto; `null` si indisponible. */
function cryptoRandomInt(max: number): number | null {
  const cryptoObj = getCrypto();
  if (!cryptoObj) return null;
  const buf = new Uint32Array(1);
  // Rejet pour éviter le modulo bias
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

/** Index aléatoire avec crypto, sinon fallback si explicitement autorisé. */
function randIndex(max: number, allowInsecureFallback: boolean): number {
  const x = cryptoRandomInt(max);
  if (x !== null) return x;

  if (!allowInsecureFallback) {
    throw new DomainError({
      code: ERROR_CODES.INTERNAL,
      message:
        "genId: crypto.getRandomValues unavailable and insecure fallback disabled",
    });
  }

  // Fallback non-cryptographique (Math.random) — usage dev/test
  return Math.floor(Math.random() * max);
}

/** Par défaut : fallback autorisé en dev/test, interdit en production. */
const DEFAULT_ALLOW_INSECURE_FALLBACK =
  typeof process !== "undefined" && process.env?.NODE_ENV === "production"
    ? false
    : true;

/**
 * Génère un identifiant URL-safe de longueur `size`.
 * @throws DomainError(INTERNAL) si `size` ≤ 0 ou crypto indisponible sans fallback.
 */
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

/** Implémentation par défaut d'un générateur d'ID. */
export const systemIdGen: IdGen = { gen: genId };
