"use client";
/**
 * @file src/hooks/admin/pages/useReadPage.ts
 * @intro Lire une page (GET) avec annulation & logs
 * @description
 * Lit une page via l’API d’admin et expose `{ page, loading, reload }`.
 * - Annulation via AbortController (évite les setState après unmount/changement rapide).
 * - Micro-polish : remet `page` à `null` quand `slug` change pour afficher un skeleton frais.
 *
 * @layer ui/hooks
 * @remarks
 * - Les erreurs sont notifiées via `notify` et non stockées localement.
 * - La validation de forme est réalisée à la frontière API (Zod).
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { entityLabel } from "@/constants/shared/entities";
import type { EntityKind } from "@/core/domain/entities/constants";
import type { PageDTO } from "@/core/domain/pages/dto";
import { withLoadLogs } from "@/hooks/_shared/utils";
import { pagesAdminApi } from "@/infrastructure/http/admin/pages.client";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { notify } from "@/lib/notify";
import { useCallback, useEffect, useRef, useState } from "react";

const ENTITY: EntityKind = "page";
const ENTITY_LABEL = entityLabel(ENTITY);

/** Contrat de retour du hook. */
type UseReadPageResult = Readonly<{
  page: PageDTO | null;
  loading: boolean;
  reload: () => Promise<void>;
}>;

/**
 * Hook React : lit une page (GET /api/admin/pages/[slug]).
 * @param slug  Slug cible (kebab-case). Si vide, aucun appel n’est déclenché.
 * @param state Espace logique ("draft" par défaut).
 * @returns `{ page, loading, reload }` as const
 */
export function useReadPage(
  slug: string,
  state: ContentState = DEFAULT_CONTENT_STATE
): UseReadPageResult {
  const [page, setPage] = useState<PageDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // AbortController en cours (load courant)
  const ctrlRef = useRef<AbortController | null>(null);
  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  const load = useCallback(async (): Promise<void> => {
    // Si slug vide → pas d’appel, on sort proprement
    if (!slug || slug.trim() === "") {
      setPage(null);
      setLoading(false);
      return;
    }

    // Annule un éventuel en-cours puis (re)crée un AC
    abortCurrent();
    const ac = newAbort();
    ctrlRef.current = ac;

    setLoading(true);
    try {
      const p = await withLoadLogs(
        "useReadPage",
        state,
        () => pagesAdminApi.get(slug, state, { signal: ac.signal }),
        { entity: ENTITY, entityLabel: ENTITY_LABEL, slug }
      );
      setPage(p);
    } catch (e: unknown) {
      if (!isAbortError(e)) {
        notify.fromError(e);
      }
      // En cas d’échec (hors abort), on remet la page à null
      setPage(null);
      throw e;
    } finally {
      setLoading(false);
      ctrlRef.current = null;
    }
  }, [slug, state, abortCurrent]);

  // Chargement initial + à chaque changement de slug/state
  useEffect(() => {
    // Vider l'affichage et ne pas afficher de spinner inutile si slug vide
    setPage(null);
    if (!slug?.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    load().catch(() => void 0);
    // cleanup : annule la requête si le composant se démonte ou si deps changent vite
    return abortCurrent;
  }, [slug, state, load, abortCurrent]);

  return { page, loading, reload: load } as const;
}
