/**
 * @file src/lib/equality.ts
 * @intro Égalité profonde légère + hash stable (pour dirty volumineux)
 * @layer lib
 */

type Json = null | boolean | number | string | JsonArray | JsonObject;
type JsonObject = { readonly [k: string]: Json };
type JsonArray = readonly Json[];

type ComparableObject = Record<string, unknown>;

/** Deep equal lightweight (objets/arrays/valeurs simples). */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  return deepEqual(a, b, new WeakMap<object, WeakSet<object>>());
}

function deepEqual(
  a: unknown,
  b: unknown,
  visited: WeakMap<object, WeakSet<object>>
): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;

  if (a === null || b === null) {
    return a === b;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (markVisited(a, b, visited)) {
      return true;
    }
    for (let index = 0; index < a.length; index += 1) {
      if (!deepEqual(a[index], b[index], visited)) {
        return false;
      }
    }
    return true;
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    if (markVisited(a, b, visited)) {
      return true;
    }
    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (let index = 0; index < keysA.length; index += 1) {
      const key = keysA[index];
      if (key !== keysB[index]) {
        return false;
      }
      if (!deepEqual(a[key], b[key], visited)) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function isPlainObject(value: unknown): value is ComparableObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

function markVisited(
  a: object,
  b: object,
  visited: WeakMap<object, WeakSet<object>>
): boolean {
  const mapForA = visited.get(a);
  if (mapForA?.has(b)) {
    return true;
  }
  const setForA = mapForA ?? new WeakSet<object>();
  if (!mapForA) {
    visited.set(a, setForA);
  }
  setForA.add(b);
  return false;
}
