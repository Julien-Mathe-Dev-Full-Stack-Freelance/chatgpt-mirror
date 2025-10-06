"use client";

/**
 * @file src/hooks/admin/site/primary-menu/usePrimaryMenuSettings.ts
 * @intro State + I/O pour le menu principal (GET/PATCH) — modèle **UI** (schéma Zod)
 * @layer ui/hooks
 */

import type { ContentState } from "@/constants/shared/common";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { DEFAULT_PRIMARY_MENU_SETTINGS } from "@/core/domain/site/defaults/primary-menu";
import type { PrimaryMenuSettingsDTO } from "@/core/domain/site/dto";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";
import type {
  PrimaryMenuItemInput,
  PrimaryMenuSettingsInput,
} from "@/schemas/site/primary-menu/primary-menu";
import type { UpdatePrimaryMenuSettingsPatchDTO } from "@/schemas/site/primary-menu/primary-menu-intents";

// Domaine (DTO) -> UI (strings)
function toUi(v: PrimaryMenuSettingsDTO): PrimaryMenuSettingsInput {
  return {
    items: (v.items ?? []).map((it) => ({
      label: it.label,
      href: it.href as string,
      newTab: it.newTab,
      isExternal: it.isExternal,
      children: (it.children ?? []).map((c) => ({
        label: c.label,
        href: c.href as string,
        newTab: c.newTab,
        isExternal: c.isExternal,
      })),
    })),
  };
}

/* ------------------------------ helpers (normalisation UI) ------------------------------ */

const coerceString = (s: string) => s.trim();
const coerceBool = (b: boolean) => !!b;

/** 👈 même naming qu’en legal: normalizeLegalItemInput */
function normalizePrimaryItemInput(
  i: PrimaryMenuItemInput
): PrimaryMenuItemInput {
  return {
    label: coerceString(i.label),
    href: coerceString(i.href),
    newTab: coerceBool(i.newTab),
    isExternal: coerceBool(i.isExternal),
    children: (i.children ?? []).map((c) => ({
      label: coerceString(c.label),
      href: coerceString(c.href),
      newTab: coerceBool(c.newTab),
      isExternal: coerceBool(c.isExternal),
    })),
  };
}

// Normalise un objet COMPLET
function normalizePrimaryInput(
  s: PrimaryMenuSettingsInput
): PrimaryMenuSettingsInput {
  return {
    items: Array.isArray(s.items) ? s.items.map(normalizePrimaryItemInput) : [],
  };
}

// Normalise un PATCH PARTIEL — ne touche que les clés présentes
function normalizePrimaryPatch(
  p: Partial<PrimaryMenuSettingsInput>
): UpdatePrimaryMenuSettingsPatchDTO {
  const out: UpdatePrimaryMenuSettingsPatchDTO = {};
  if ("items" in p && Array.isArray(p.items)) {
    out.items = p.items.map(normalizePrimaryItemInput);
  }
  return out;
}

/** Defaults UI dérivés des defaults domaine */
const DEFAULT_PRIMARY_INPUT: PrimaryMenuSettingsInput = toUi(
  DEFAULT_PRIMARY_MENU_SETTINGS
);

/* ------------------------------------- hook ------------------------------------- */

type UsePrimaryMenuSettingsResult =
  SettingsHookResult<PrimaryMenuSettingsInput>;

export function usePrimaryMenuSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UsePrimaryMenuSettingsResult {
  return useSettingsResource<PrimaryMenuSettingsInput>({
    state,
    entity: "primaryMenu",
    defaults: normalizePrimaryInput(DEFAULT_PRIMARY_INPUT),

    // GET → DTO → UI → normalize
    load: async (s, opts) => {
      const dto = await settingsAdminApi.primaryMenu.get(s, opts);
      return normalizePrimaryInput(toUi(dto));
    },

    // PATCH → normalize(UI) → API → DTO → UI → normalize
    save: async (s, next, opts) => {
      const normalizedPatch = normalizePrimaryPatch(next);
      const dto = await settingsAdminApi.primaryMenu.patch(
        normalizedPatch,
        s,
        opts
      );
      return normalizePrimaryInput(toUi(dto));
    },

    // Diff minimal sur valeurs normalisées
    buildPatch: (baseline, next) =>
      buildShallowDiff(
        normalizePrimaryInput(baseline),
        normalizePrimaryInput(next)
      ) ?? null,

    onLoaded: (val) => normalizePrimaryInput(val),
    beforeSave: (val) => normalizePrimaryInput(val),
  });
}
