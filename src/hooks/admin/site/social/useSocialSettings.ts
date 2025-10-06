"use client";

/**
 * @file src/hooks/admin/site/social/useSocialSettings.ts
 * @intro State + I/O pour SocialLinks (GET/PATCH) — modèle **UI** (schéma Zod)
 * @description
 * Fin wrapper autour de `useSettingsResource`, typé sur le modèle **UI** (strings),
 * avec mapping léger DTO(domain) <-> UI + normalisation locale avant save.
 * Aligné sur le pattern d’Identity & Legal.
 * @layer ui/hooks
 */

import type { ContentState } from "@/constants/shared/common";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { DEFAULT_SOCIAL_SETTINGS } from "@/core/domain/site/defaults/social";
import type { SocialSettingsDTO } from "@/core/domain/site/dto";
import type { SocialItem } from "@/core/domain/site/entities/social";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";
import type {
  SocialItemInput,
  SocialSettingsInput,
} from "@/schemas/site/social/social";
import type { UpdateSocialSettingsPatchDTO } from "@/schemas/site/social/social-intents";

/* ------------------------------ mapping Domaine (DTO) -> UI ------------------------------ */

function toUi(v: SocialSettingsDTO): SocialSettingsInput {
  return {
    items: (v.items ?? []).map((it: SocialItem) => ({
      kind: it.kind,
      href: it.href as unknown as string, // débrand vers string pour l’UI
    })),
  };
}

/* ------------------------------ normalisation UI ------------------------------ */

const coerceHref = (s: string) => s.trim();

/** Normalise **un item** complet (UI) */
function normalizeSocialItemInput(i: SocialItemInput): SocialItemInput {
  return {
    kind: i.kind,
    href: coerceHref(i.href),
  };
}

/** Normalise un objet COMPLET (toutes props existantes) */
function normalizeSocialInput(s: SocialSettingsInput): SocialSettingsInput {
  return {
    items: Array.isArray(s.items) ? s.items.map(normalizeSocialItemInput) : [],
  };
}

/** Normalise un PATCH PARTIEL — ne touche que les clés présentes */
function normalizeSocialPatch(
  p: Partial<SocialSettingsInput>
): UpdateSocialSettingsPatchDTO {
  const out: UpdateSocialSettingsPatchDTO = {};
  if ("items" in p && Array.isArray(p.items)) {
    out.items = p.items.map(normalizeSocialItemInput);
  }
  return out;
}

/** Defaults UI dérivés des defaults domaine */
const DEFAULT_SOCIAL_INPUT: SocialSettingsInput = toUi(DEFAULT_SOCIAL_SETTINGS);

/* ------------------------------------- hook ------------------------------------- */

type UseSocialSettingsResult = SettingsHookResult<SocialSettingsInput>;

export function useSocialSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseSocialSettingsResult {
  return useSettingsResource<SocialSettingsInput>({
    state,
    entity: "social",
    defaults: normalizeSocialInput(DEFAULT_SOCIAL_INPUT),

    // GET published/draft → DTO domaine → UI → normalize
    load: async (s, opts) => {
      const dto = await settingsAdminApi.social.get(s, opts);
      return normalizeSocialInput(toUi(dto));
    },

    // PATCH draft (body UI) → normalize avant diff/save → DTO → UI → normalize
    save: async (s, next, opts) => {
      const normalizedPatch = normalizeSocialPatch(next);
      const dto = await settingsAdminApi.social.patch(normalizedPatch, s, opts);
      return normalizeSocialInput(toUi(dto));
    },

    // Diff minimal sur valeurs normalisées (même approche que Identity/Legal)
    buildPatch: (baseline, next) =>
      buildShallowDiff(
        normalizeSocialInput(baseline),
        normalizeSocialInput(next)
      ) ?? null,

    onLoaded: (val) => normalizeSocialInput(val),
    beforeSave: (val) => normalizeSocialInput(val),
  });
}
