"use client";
import { entityLabel } from "@/constants/shared/entities";
/**
 * @file src/hooks/_shared/usePreviewResource.ts
 * @intro Hook générique pour previews (GET only + AbortSignal)
 * @layer hooks/shared
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import type { EntityKind } from "@/core/domain/entities/constants";
import { withLoadLogs } from "@/hooks/_shared/utils";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { useCallback, useEffect, useRef, useState } from "react";

type Loader<T> = (
  state: ContentState,
  opts?: { signal?: AbortSignal }
) => Promise<T>;

type PreviewHookResult<T> = Readonly<{
  /** Valeurs courantes (defaults pendant le 1er chargement) */
  settings: T;
  /** Chargement en cours (true au mount/refresh) */
  loading: boolean;
}>;

/**
 * Signature uniforme :
 * - `state?: ContentState = "draft"`
 * - retourne `{ settings, loading } as const`
 */
export function usePreviewResource<T>(
  scope: string,
  load: Loader<T>,
  defaults: T,
  state: ContentState = DEFAULT_CONTENT_STATE,
  entity: EntityKind
): PreviewHookResult<T> {
  const [settings, setSettings] = useState<T>(defaults);
  const [loading, setLoading] = useState<boolean>(true);
  const ctrlRef = useRef<AbortController | null>(null);
  const loaderRef = useRef(load);
  const entityName = entityLabel(entity);

  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  useEffect(() => {
    loaderRef.current = load;
  }, [load]);

  const doLoad = useCallback(
    async (s: ContentState) => {
      abortCurrent(); // annule un éventuel call précédent
      const ac = newAbort();
      ctrlRef.current = ac;
      setLoading(true);
      try {
        const value = await withLoadLogs(
          scope,
          s,
          () => loaderRef.current(s, { signal: ac.signal }),
          { entity: entityName } // tag cohérent pour les logs
        );
        setSettings(value);
      } catch (e: unknown) {
        if (!isAbortError(e)) {
          // Les erreurs réseau/API sont déjà loggées côté withLoadLogs
          // La UI peut toaster via notify.fromError si besoin, au consommateur
        }
      } finally {
        setLoading(false);
        ctrlRef.current = null;
      }
    },
    [abortCurrent, scope, entityName]
  );

  useEffect(() => {
    void doLoad(state);
  }, [doLoad, state]);

  // cleanup unmount
  useEffect(() => abortCurrent, [abortCurrent]);

  return { settings, loading } as const;
}
