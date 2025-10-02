"use client";
/**
 * @file src/hooks/admin/pages/useUpdatePage.ts
 * @intro Mettre à jour une page (PATCH) avec annulation & logs
 * @description
 * Enrobe le client HTTP et expose `{ update, updatingSlug }`.
 * - Annulation via AbortController (évite setState après unmount/changement rapide).
 * - Bloque l’appel si `patch` est vide (micro-UX).
 *
 * @layer ui/hooks
 * @remarks
 * - Les erreurs sont toastées via `notify` (pas d’état d’erreur local).
 * - La validation de forme est assurée côté API (Zod).
 */

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { entityLabel } from "@/constants/shared/entities";
import type { EntityKind } from "@/core/domain/entities/constants";
import type { UpdatePageDTO } from "@/core/domain/pages/dto";
import { withSaveLogs } from "@/hooks/_shared/utils";
import { pagesAdminApi } from "@/infrastructure/http/admin/pages.client";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { notify } from "@/lib/notify";
import { notifyNoChanges, notifyUpdated } from "@/lib/notify-presets";
import { useCallback, useEffect, useRef, useState } from "react";

export type UseUpdatePageResult = Readonly<{
  /** Déclenche la mise à jour d’une page. */
  update: (currentSlug: string, patch: UpdatePageDTO) => Promise<void>;
  /** Slug en cours de mise à jour (pour spinner ciblé/disable bouton). */
  updatingSlug: string | null;
}>;

const ENTITY: EntityKind = "page";
const ENTITY_LABEL = entityLabel(ENTITY);

/**
 * Hook React : met à jour une page (PATCH /api/admin/pages/[slug]).
 * - Affiche des toasts de succès/erreur via `notify`.
 * - Annule proprement si le composant se démonte pendant la requête.
 *
 * @param onSuccess Callback exécuté après succès (ex. recharger la liste).
 * @returns `{ update, updatingSlug }` as const
 */
export function useUpdatePage(onSuccess?: () => void): UseUpdatePageResult {
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);

  // AbortController courant (une requête à la fois)
  const ctrlRef = useRef<AbortController | null>(null);
  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  const update = useCallback(
    async (currentSlug: string, patch: UpdatePageDTO): Promise<void> => {
      if (updatingSlug) return;
      // (0) Safe-guard : patch vide → no-op
      if (!patch || Object.keys(patch).length === 0) {
        notifyNoChanges();
        return;
      }

      // (1) Annule l’éventuelle requête en cours et crée un nouveau signal
      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      setUpdatingSlug(currentSlug);
      const fields = Object.keys(patch ?? {});

      try {
        // (2) Appel HTTP instrumenté (logs homogènes)
        await withSaveLogs(
          "useUpdatePage",
          DEFAULT_CONTENT_STATE,
          () => pagesAdminApi.update(currentSlug, patch, { signal: ac.signal }),
          {
            entity: ENTITY,
            entityLabel: ENTITY_LABEL,
            fields,
            slug: currentSlug,
          }
        );

        // (3) Succès + callback + toast
        notifyUpdated(ENTITY, currentSlug, fields);
        onSuccess?.();
      } catch (e: unknown) {
        if (!isAbortError(e)) {
          notify.fromError(e);
        }
      } finally {
        setUpdatingSlug(null);
        ctrlRef.current = null;
      }
    },
    [abortCurrent, onSuccess, updatingSlug]
  );

  // Cleanup global : annule si unmount
  useEffect(() => abortCurrent, [abortCurrent]);

  return { update, updatingSlug } as const;
}
