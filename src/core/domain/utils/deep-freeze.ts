/**
 * @file src/core/domain/utils/deep-freeze.ts
 * @intro Helper pour geler récursivement des objets
 * @layer domain/utils
 * @remarks
 * - Utilise une `WeakSet` pour éviter les cycles.
 * - Gèle aussi bien les objets que les tableaux (structure immuable).
 */

/**
 * Gèle récursivement un objet ou un tableau.
 * @param value - Valeur à geler.
 * @returns La même valeur, désormais gelée.
 */
export function deepFreeze<T>(value: T): T {
  if (value === null) {
    return value;
  }

  const type = typeof value;
  if (type !== "object" && type !== "function") {
    return value;
  }

  return internalDeepFreeze(value as object, new WeakSet()) as T;
}

function internalDeepFreeze(value: object, seen: WeakSet<object>): object {
  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  if (!Object.isFrozen(value)) {
    for (const key of Reflect.ownKeys(value)) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !("value" in descriptor)) {
        continue;
      }

      const prop = descriptor.value;
      if (prop === null) {
        continue;
      }

      const propType = typeof prop;
      if (propType === "object" || propType === "function") {
        internalDeepFreeze(prop as object, seen);
      }
    }

    Object.freeze(value);
  }

  return value;
}
