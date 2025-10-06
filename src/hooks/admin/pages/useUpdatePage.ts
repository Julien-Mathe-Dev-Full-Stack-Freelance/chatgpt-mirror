"use client";

/**
 * @file src/hooks/admin/pages/useUpdatePage.ts
 * @intro Hook pour mettre à jour une page (PATCH) — UI draft -> Intent DTO
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { entityLabel } from "@/constants/shared/entities";
import type { EntityKind } from "@/core/domain/entities/constants";
import { withSaveLogs } from "@/hooks/_shared/utils";
import { pagesAdminApi } from "@/infrastructure/http/admin/pages.client";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { notify } from "@/lib/notify";
import { notifyNoChanges, notifyUpdated } from "@/lib/notify-presets";
import type { UpdatePageIntentDTO } from "@/schemas/pages/page-intents";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------- UI patch draft + mapper ---------------- */

export type UpdatePageDraft = Partial<{
  title: string;
  slug: string;
  sitemap: NonNullable<UpdatePageIntentDTO["sitemap"]>;
  state: ContentState;
}>;

function toUpdateIntent(p: UpdatePageDraft): UpdatePageIntentDTO {
  const out: UpdatePageIntentDTO = {};
  if ("title" in p) out.title = (p.title ?? "").trim();
  if ("slug" in p) {
    const s = (p.slug ?? "").trim();
    out.slug = s || undefined; // évite de pousser "" côté API
  }
  if ("sitemap" in p) out.sitemap = p.sitemap;
  if ("state" in p) out.state = p.state;
  return out;
}

/* ---------------- Hook ---------------- */

type UseUpdatePageResult = Readonly<{
  update: (currentSlug: string, draft: UpdatePageDraft) => Promise<void>;
  updatingSlug: string | null;
}>;

const ENTITY: EntityKind = "page";
const ENTITY_LABEL = entityLabel(ENTITY);

export function useUpdatePage(onSuccess?: () => void): UseUpdatePageResult {
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  const update = useCallback(
    async (currentSlug: string, draft: UpdatePageDraft): Promise<void> => {
      if (updatingSlug) return;

      // UI -> Intent
      const payload = toUpdateIntent(draft);
      if (!payload || Object.keys(payload).length === 0) {
        notifyNoChanges();
        return;
      }

      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      setUpdatingSlug(currentSlug);
      const fields = Object.keys(payload ?? {});

      try {
        await withSaveLogs(
          "useUpdatePage",
          payload.state ?? DEFAULT_CONTENT_STATE,
          () =>
            pagesAdminApi.update(currentSlug, payload, { signal: ac.signal }),
          {
            entity: ENTITY,
            entityLabel: ENTITY_LABEL,
            fields,
            slug: currentSlug,
          }
        );

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

  useEffect(() => abortCurrent, [abortCurrent]);

  return { update, updatingSlug } as const;
}
