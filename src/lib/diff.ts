/**
 * @file src/lib/diff.ts
 * @intro Construction de patch minimal (shallow ou deep)
 * @layer lib
 */

// const DELETE_SENTINEL = Symbol("diff.delete");

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
