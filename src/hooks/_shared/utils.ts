/**
 * @file src/hooks/_shared/utils.ts
 * @intro Aides minimales pour hooks (AbortController, erreurs, logs unitaires)
 * @layer hooks/shared
 * @remarks
 * - Pas de logger spécifique : on réutilise log/logWithDuration.
 * - Évite tout `any` dans les catch via `errorMessage(e)` + `isAbortError(e)`.
 */

import type { ContentState } from "@/constants/shared/common";
import { isAbortError } from "@/lib/http/abortError";
import { log, logWithDuration } from "@/lib/log";

const lg = log.child({ ns: "hooks" });

/** Message d’erreur typé (évite `any` dans les catch). */
function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/**
 * Wrapper de chargement avec logs homogènes (start/ok/failed + ms).
 * @param scope ex: "useHeaderPreview"
 */
export async function withLoadLogs<T>(
  scope: string,
  state: ContentState,
  fn: () => Promise<T>,
  meta?: Record<string, unknown>
): Promise<T> {
  return logWithDuration(`${scope}.load`, async () => {
    try {
      const res = await fn();
      lg.debug("load.ok", { scope, op: "load", state, ...(meta || {}) });
      return res;
    } catch (e: unknown) {
      if (isAbortError(e)) {
        lg.debug("load.abort", {
          scope,
          op: "load",
          state,
          ...(meta || {}),
        });
      } else {
        lg.warn("load.failed", {
          scope,
          op: "load",
          state,
          msg: errorMessage(e),
          ...(meta || {}),
        });
      }
      throw e;
    }
  });
}

/**
 * Wrapper de sauvegarde avec logs homogènes (start/ok/failed + ms).
 * @param scope ex: "useHeaderSettings"
 */
export async function withSaveLogs<T>(
  scope: string,
  state: ContentState,
  fn: () => Promise<T>,
  meta?: Record<string, unknown>
): Promise<T> {
  return logWithDuration(`${scope}.save`, async () => {
    try {
      const res = await fn();
      lg.debug("save.ok", { scope, op: "save", state, ...(meta || {}) });
      return res;
    } catch (e: unknown) {
      if (isAbortError(e)) {
        lg.debug("save.abort", { scope, op: "save", state, ...(meta || {}) });
      } else {
        lg.warn("save.failed", {
          scope,
          op: "save",
          state,
          msg: errorMessage(e),
          ...(meta || {}),
        });
      }
      throw e;
    }
  });
}
