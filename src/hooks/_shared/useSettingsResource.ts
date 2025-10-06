"use client";

/**
 * @file src/hooks/_shared/useSettingsResource.ts
 * @intro Hook générique *Settings (GET/PATCH + baseline + dirty + diff minimal)
 * @layer hooks/shared
 */

import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/constants/shared/common";
import { entityLabel } from "@/constants/shared/entities";
import type { EntityKind } from "@/core/domain/entities/constants";
import { withLoadLogs, withSaveLogs } from "@/hooks/_shared/utils";
import { isDeepEqual } from "@/lib/equality";
import { isAbortError, newAbort } from "@/lib/http/abortError";
import { HttpError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { notifyNoChanges, notifySaved } from "@/lib/notify-presets";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type HttpOpts = { signal?: AbortSignal };

const LOG_SCOPE = "useSettingsResource";

export type SettingsHookResult<T> = Readonly<{
  settings: T;
  initialLoading: boolean;
  saving: boolean;
  isDirty: boolean;
  patch: (partial: Partial<T>) => void;
  reset: () => void;
  load: (nextState?: ContentState) => Promise<void>;
  save: (nextState?: ContentState) => Promise<void>;
}>;

type UseSettingsResourceParams<T> = Readonly<{
  state?: ContentState;
  defaults: T;
  entity: EntityKind;
  load: (state: ContentState, opts?: HttpOpts) => Promise<T>;
  save: (
    state: ContentState,
    next: Partial<T> | T,
    opts?: HttpOpts
  ) => Promise<T>;
  /** Transforme la valeur lue AVANT stockage (ex: attacher des `_uid`). */
  onLoaded?: (value: T) => T | void;
  /** Effet latéral APRÈS save (ex: refresh externe). */
  onSaved?: (value: T) => void;
  /** Transforme la valeur AVANT save (ex: strip `_uid`, merge profond, etc.). */
  beforeSave?: (value: T) => Partial<T> | T;
  /** Si fourni, construit un patch minimal depuis `baseline` → `settings`. */
  buildPatch?: (baseline: T, next: T) => Partial<T> | null;
  autoLoad?: boolean;
}>;

export function useSettingsResource<T extends object>({
  state = DEFAULT_CONTENT_STATE,
  defaults,
  entity,
  load: loader,
  save: saver,
  onLoaded,
  onSaved,
  beforeSave,
  buildPatch,
  autoLoad = true,
}: UseSettingsResourceParams<T>): SettingsHookResult<T> {
  const [settings, setSettings] = useState<T>(defaults);
  const [baseline, setBaseline] = useState<T>(defaults);
  const [initialLoading, setInitialLoading] = useState<boolean>(!!autoLoad);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState<ContentState>(state);
  const entityName = entityLabel(entity);

  const ctrlRef = useRef<AbortController | null>(null);
  const hasLoadedOnceRef = useRef<boolean>(false);
  const pendingLoadsRef = useRef<number>(0);
  const abortCurrent = useCallback(() => {
    ctrlRef.current?.abort();
    ctrlRef.current = null;
  }, []);

  const loaderRef = useRef(loader);
  const saverRef = useRef(saver);
  const onLoadedRef = useRef(onLoaded);
  const onSavedRef = useRef(onSaved);
  const beforeSaveRef = useRef(beforeSave);
  const buildPatchRef = useRef(buildPatch);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    saverRef.current = saver;
  }, [saver]);

  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  useEffect(() => {
    onSavedRef.current = onSaved;
  }, [onSaved]);

  useEffect(() => {
    beforeSaveRef.current = beforeSave;
  }, [beforeSave]);

  useEffect(() => {
    buildPatchRef.current = buildPatch;
  }, [buildPatch]);

  const isDirty = useMemo(
    () => !isDeepEqual(settings, baseline),
    [settings, baseline]
  );

  const patch = useCallback((partial: Partial<T>) => {
    setSettings((prev) => Object.assign({}, prev, partial));
  }, []);

  const reset = useCallback(() => {
    setSettings(baseline);
  }, [baseline]);

  const load = useCallback(
    async (nextState?: ContentState) => {
      const s = nextState ?? currentState;
      setCurrentState(s);
      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      pendingLoadsRef.current += 1;
      if (!hasLoadedOnceRef.current) {
        setInitialLoading(true);
      }
      try {
        const data = await withLoadLogs(
          LOG_SCOPE,
          s,
          () => loaderRef.current(s, { signal: ac.signal }),
          { entity: entityName }
        );
        const normalized = (onLoadedRef.current?.(data) ?? data) as T;
        setSettings(normalized);
        setBaseline(normalized);
        if (!hasLoadedOnceRef.current) {
          hasLoadedOnceRef.current = true;
          setInitialLoading(false);
        }
      } catch (e: unknown) {
        if (!isAbortError(e)) {
          notify.fromError(e);
          if (!hasLoadedOnceRef.current) {
            hasLoadedOnceRef.current = true;
            setInitialLoading(false);
          }
        }
        throw e;
      } finally {
        pendingLoadsRef.current = Math.max(0, pendingLoadsRef.current - 1);
        if (hasLoadedOnceRef.current && pendingLoadsRef.current === 0) {
          setInitialLoading(false);
        }
        ctrlRef.current = null;
      }
    },
    [currentState, abortCurrent, entityName]
  );

  const save = useCallback(
    async (nextState?: ContentState) => {
      if (!isDirty) {
        notifyNoChanges();
        return;
      }
      const s = nextState ?? currentState;
      abortCurrent();
      const ac = newAbort();
      ctrlRef.current = ac;

      setSaving(true);
      try {
        // (1) Transformations locales avant diff (ex: strip `_uid`)
        const beforeSaveFn = beforeSaveRef.current;
        const buildPatchFn = buildPatchRef.current;
        const saverFn = saverRef.current;
        const onSavedFn = onSavedRef.current;

        const candidate = (
          beforeSaveFn ? beforeSaveFn(settings) : settings
        ) as T;

        // (2) Patch minimal optionnel
        const payload: Partial<T> | T =
          buildPatchFn?.(baseline, candidate) ?? candidate;

        const fields = buildPatchFn
          ? Object.keys(payload as Record<string, unknown>)
          : undefined;

        const saved = await withSaveLogs(
          LOG_SCOPE,
          s,
          () => saverFn(s, payload, { signal: ac.signal }),
          { entity: entityName, fields } // <— meta homogène
        );

        setSettings(saved);
        setBaseline(saved);
        onSavedFn?.(saved);
        notifySaved(entity);
      } catch (e: unknown) {
        if (!isAbortError(e)) {
          // ⬇️ Ne pas toaster ici les erreurs de validation (400 VALIDATION_ERROR).
          if (!(e instanceof HttpError && e.code === "VALIDATION_ERROR")) {
            notify.fromError(e);
          }
        }
        throw e;
      } finally {
        setSaving(false);
        ctrlRef.current = null;
      }
    },
    [
      currentState,
      settings,
      baseline,
      isDirty,
      abortCurrent,
      entityName,
      entity,
    ]
  );

  useEffect(() => {
    if (!autoLoad) return;
    load().catch(() => void 0);
  }, [autoLoad, load]);

  useEffect(() => abortCurrent, [abortCurrent]);

  return {
    settings,
    initialLoading,
    saving,
    isDirty,
    patch,
    reset,
    load,
    save,
  } as const;
}
