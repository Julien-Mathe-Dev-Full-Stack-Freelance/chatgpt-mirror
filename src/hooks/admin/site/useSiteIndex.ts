"use client";

/**
 * @file src/hooks/admin/site/useSiteIndex.ts
 * @intro Charger l’index du site (+ refresh manuel)
 * @description
 * Wrappe le service HTTP admin des pages et expose une API minimaliste :
 * `{ index, loading, reload }`. Les erreurs ne sont **pas** stockées localement ;
 * elles sont remontées via `notify` sous forme de toast et le dernier état connu
 * est conservé côté hook.
 *
 * Observabilité :
 * - `info`   : reload.start / reload.ok (avec petites métriques utiles)
 * - `error`  : reload.failed (réseau/HTTP)
 * - `debug`  : reload.done (fin de cycle)
 *
 * @layer ui/hooks
 * @remarks
 * - `loading` couvre le cycle de (re)chargement courant.
 * - Si tu as besoin de distinguer le premier chargement d’un refresh, scinde
 *   `loading` en `initialLoading` + `refreshing` (voir TODO).
 * - On évite de logger l’objet `index` en entier (bruit/sensibilité).
 *
 * @todo Séparer `initialLoading` vs. `refreshing` si une UX plus fine est nécessaire.
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import type { SiteIndexDTO } from "@/core/domain/site/dto";
import { pagesAdminApi } from "@/infrastructure/http/admin/pages.client";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { log } from "@/lib/log";
import { notify } from "@/lib/notify";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSiteIndexResult {
  /** Dernier index chargé (ou `null` tant que rien n’a été récupéré). */
  index: SiteIndexDTO | null;
  /** `true` pendant un (re)chargement. */
  loading: boolean;
  /**
   * Relance un chargement manuel depuis l’API.
   * @param state Espace logique ciblé (`"draft"` par défaut).
   */
  reload: (state?: ContentState) => Promise<void>;
}

const lg = log.child({ ns: "hook", name: "useSiteIndex" });

/**
 * Hook React : charge l’index du site (`draft` par défaut) et expose un `reload`.
 * - Pas de persistance d’erreur : `notify.fromError(e)` se charge du feedback UX.
 *
 * @param defaultState Espace logique par défaut (`"draft"` | `"published"`).
 * @returns `{ index, loading, reload }`
 */
export function useSiteIndex(
  defaultState: ContentState = DEFAULT_CONTENT_STATE
): UseSiteIndexResult {
  const [index, setIndex] = useState<SiteIndexDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const ctrlRef = useRef<AbortController | null>(null);

  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  const reload = useCallback(
    async (state: ContentState = defaultState): Promise<void> => {
      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      setLoading(true);
      lg.info("reload.start", { op: "load", state });
      try {
        const data = await pagesAdminApi.getIndex(state, { signal: ac.signal });
        setIndex(data);
        lg.info("reload.ok", {
          op: "load",
          state,
          pages: data.pages?.length ?? 0,
        });
      } catch (e: unknown) {
        if (isAbortError(e)) {
          lg.debug("reload.abort", { op: "load", state });
        } else {
          const msg = e instanceof Error ? e.message : String(e);
          notify.fromError(e);
          lg.error("reload.failed", { op: "load", state, msg });
        }
      } finally {
        setLoading(false);
        ctrlRef.current = null;
        lg.debug("reload.done", { op: "load", state });
      }
    },
    [abortCurrent, defaultState]
  );

  useEffect(() => {
    void reload(defaultState);
    return abortCurrent;
  }, [reload, defaultState, abortCurrent]);

  return { index, loading, reload };
}
