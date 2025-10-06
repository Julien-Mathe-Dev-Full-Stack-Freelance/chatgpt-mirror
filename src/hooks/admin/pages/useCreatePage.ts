"use client";

/**
 * @file src/hooks/admin/pages/useCreatePage.ts
 * @intro Hook pour créer une page via l’API d’admin (UI draft -> Intent DTO)
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
import { log } from "@/lib/log";
import { notify } from "@/lib/notify";
import { notifyCreated } from "@/lib/notify-presets";
import type {
  CreatePageIntentDTO,
  UpdatePageIntentDTO,
} from "@/schemas/pages/page-intents";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------- UI draft + mappers ---------------- */

export type CreatePageDraft = {
  title: string;
  slug?: string;
  state?: ContentState;
  sitemap?: UpdatePageIntentDTO["sitemap"]; // on réutilise le type du patch
};

function normalizeCreateDraft(i: CreatePageDraft): CreatePageDraft {
  return {
    title: (i.title ?? "").trim(),
    slug: (i.slug ?? "").trim(), // on garde "" si vide → sera coalisé côté intent
    state: i.state ?? DEFAULT_CONTENT_STATE,
    sitemap: i.sitemap, // déjà « forme-only » si présent
  };
}

function toCreateIntent(i: CreatePageDraft): CreatePageIntentDTO {
  const n = normalizeCreateDraft(i);
  return {
    title: n.title,
    slug: n.slug || undefined, // évite le bruit "" côté API
    state: n.state,
    sitemap: n.sitemap,
  };
}

/* ---------------- Hook ---------------- */

interface UseCreatePageResult {
  create: (draft: CreatePageDraft) => Promise<void>;
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
    async (draft: CreatePageDraft): Promise<void> => {
      if (saving) return;
      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      // UI -> Intent (pattern identique aux hooks settings)
      const payload = toCreateIntent(draft);

      setSaving(true);
      try {
        const fields = Object.keys(payload ?? {});
        await withSaveLogs(
          "useCreatePage",
          payload.state ?? DEFAULT_CONTENT_STATE,
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
