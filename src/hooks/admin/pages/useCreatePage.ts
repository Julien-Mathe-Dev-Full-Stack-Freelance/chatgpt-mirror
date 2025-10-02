"use client";
/**
 * @file src/hooks/pages/useCreatePage.ts
 * @intro Hook pour créer une page via l’API d’admin
 * @layer ui/hooks
 */
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { entityLabel } from "@/constants/shared/entities";
import type { EntityKind } from "@/core/domain/entities/constants";
import type { CreatePageDTO } from "@/core/domain/pages/dto";
import { withSaveLogs } from "@/hooks/_shared/utils";
import { pagesAdminApi } from "@/infrastructure/http/admin/pages.client";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { log } from "@/lib/log";
import { notify } from "@/lib/notify";
import { notifyCreated } from "@/lib/notify-presets";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCreatePageResult {
  create: (payload: CreatePageDTO) => Promise<void>;
  saving: boolean;
}

const lg = log.child({ ns: "hook", name: "useCreatePage" });
const ENTITY: EntityKind = "page";
const ENTITY_LABEL = entityLabel(ENTITY);

export function useCreatePage(onSuccess?: () => void): UseCreatePageResult {
  const [saving, setSaving] = useState(false);
  const ctrlRef = useRef<AbortController | null>(null);

  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  const create = useCallback(
    async (payload: CreatePageDTO): Promise<void> => {
      if (saving) return;
      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      setSaving(true);
      try {
        const fields = Object.keys(payload ?? {});
        await withSaveLogs(
          "useCreatePage",
          DEFAULT_CONTENT_STATE,
          () => pagesAdminApi.create(payload, { signal: ac.signal }),
          { entity: ENTITY, entityLabel: ENTITY_LABEL, fields }
        );
        notifyCreated(ENTITY, payload.title);
        lg.info("create.ok", { hasSlug: Boolean(payload.slug) });
        onSuccess?.();
      } catch (e: unknown) {
        if (isAbortError(e)) {
          lg.debug("create.abort");
        } else {
          notify.fromError(e);
          lg.error("create.failed", { msg: String(e) });
        }
      } finally {
        setSaving(false);
        ctrlRef.current = null;
        lg.debug("create.done");
      }
    },
    [abortCurrent, onSuccess, saving]
  );

  useEffect(() => abortCurrent, [abortCurrent]);

  return { create, saving } as const;
}
