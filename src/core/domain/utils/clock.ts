/**
 * @file src/core/domain/utils/clock.ts
 * @intro Helpers pour gérer l’heure (immutables)
 * @layer domain/helpers
 */

interface Clock {
  /** Date.now() en ms. */
  nowMs(): number;
  /** new Date() */
  now(): Date;
  /** ISO UTC (compatible IsoDateStringSchema) */
  nowIso(): string;
}

/** Horloge système par défaut (prod/dev). */
export const systemClock: Clock = {
  nowMs: () => Date.now(),
  now: () => new Date(),
  nowIso: () => new Date().toISOString(),
};

/** Helper pratique quand l’injection n’est pas nécessaire. */
// const nowIso = () => systemClock.nowIso();
