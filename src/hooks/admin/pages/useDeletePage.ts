"use client";

/**
 * @file src/hooks/pages/useDeletePage.ts
 * @intro Hook pour supprimer une page via l’API d’admin
 * @layer ui/hooks
 */

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { entityLabel } from "@/constants/shared/entities";
import type { EntityKind } from "@/core/domain/entities/constants";
import { withSaveLogs } from "@/hooks/_shared/utils";
import { pagesAdminApi } from "@/infrastructure/http/admin/pages.client";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { log } from "@/lib/log";
import { notify } from "@/lib/notify";
import { notifyDeleted } from "@/lib/notify-presets";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseDeletePageResult {
  remove: (slug: string) => Promise<void>;
  loadingSlug: string | null;
}

const lg = log.child({ ns: "hook", name: "useDeletePage" });
const ENTITY: EntityKind = "page";
const ENTITY_LABEL = entityLabel(ENTITY);

export function useDeletePage(onSuccess?: () => void): UseDeletePageResult {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  const remove = useCallback(
    async (slug: string): Promise<void> => {
      if (loadingSlug) return;
      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      setLoadingSlug(slug);
      try {
        await withSaveLogs(
          "useDeletePage",
          DEFAULT_CONTENT_STATE,
          () => pagesAdminApi.remove(slug, { signal: ac.signal }),
          { entity: ENTITY, entityLabel: ENTITY_LABEL, slug }
        );
        notifyDeleted(ENTITY, slug);
        lg.info("delete.ok", { slug });
        onSuccess?.();
      } catch (e: unknown) {
        if (isAbortError(e)) {
          lg.debug("delete.abort", { slug });
        } else {
          notify.fromError(e);
          lg.error("delete.failed", { slug, msg: String(e) });
        }
      } finally {
        setLoadingSlug(null);
        ctrlRef.current = null;
        lg.debug("delete.done", { slug });
      }
    },
    [abortCurrent, onSuccess, loadingSlug]
  );

  useEffect(() => abortCurrent, [abortCurrent]);

  return { remove, loadingSlug } as const;
}
