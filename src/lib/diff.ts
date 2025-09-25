/**
 * @file src/lib/diff.ts
 * @intro Construction de patch minimal (shallow ou deep)
 * @layer lib
 */

export const DELETE_SENTINEL = Symbol("diff.delete");

export function buildShallowDiff<T extends Record<string, unknown>>(
  prev: T,
  next: T
): Partial<T> | null {
  const out: Partial<T> = {};
  let changed = false;
  for (const k of Object.keys(next) as (keyof T)[]) {
    if (!Object.is(prev[k], next[k])) {
      out[k] = next[k];
      changed = true;
    }
  }
  return changed ? out : null;
}

export function buildDeepDiff<T>(prev: T, next: T): Partial<T> | null {
  const res = _deepDiff(prev as DiffValue, next as DiffValue);
  if (res === null) return null;
  // Si res est un objet (non-null) et vide, null pour no-op
  if (typeof res === "object" && !Array.isArray(res) && Object.keys(res).length === 0) {
    return null;
  }
  return res as Partial<T>;
}

type DiffPrimitive = string | number | boolean | null | undefined | symbol;
interface DiffObject {
  [key: string]: DiffValue;
}
type DiffValue = DiffPrimitive | DiffObject | ReadonlyArray<DiffValue>;

function _deepDiff(
  a: DiffValue,
  b: DiffValue,
  seen: WeakMap<object, WeakSet<object>> = new WeakMap()
): DiffValue | null {
  if (Object.is(a, b)) return null;
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return b; // valeur remplacée
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    // stratégie simple : on remplace le tableau (plus sûr pour notre cas)
    return b;
  }
  const mapped = seen.get(a as DiffObject);
  if (mapped?.has(b as DiffObject)) {
    return null;
  }
  const nextMap = mapped ?? new WeakSet<object>();
  if (!mapped) {
    seen.set(a as DiffObject, nextMap);
  }
  nextMap.add(b as DiffObject);

  const objA = a as DiffObject;
  const objB = b as DiffObject;
  const out: DiffObject = {};
  const keys = new Set([...Object.keys(objA), ...Object.keys(objB)]);
  let changed = false;
  for (const k of keys) {
    const hasB = Object.prototype.hasOwnProperty.call(objB, k);
    if (!hasB) {
      out[k] = DELETE_SENTINEL;
      changed = true;
      continue;
    }
    const d = _deepDiff(objA[k], objB[k], seen);
    if (d !== null) {
      out[k] = d;
      changed = true;
    }
  }
  return changed ? out : null;
}
