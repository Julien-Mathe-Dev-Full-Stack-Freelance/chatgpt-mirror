"use client";
/**
 * @file src/hooks/admin/site/seo/useSeoSettings.ts
 * @intro State + I/O pour le SEO (GET/PATCH) — modèle **UI** (schéma Zod)
 * @description
 * Fin wrapper autour de `useSettingsResource`, typé sur le modèle **UI** (strings),
 * avec mapping léger DTO(domain) <-> UI + normalisation locale avant save.
 * Aligné sur le pattern d’Identity / Legal menu.
 * @layer ui/hooks
 */

import type { ContentState } from "@/constants/shared/common";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { DEFAULT_SEO_SETTINGS } from "@/core/domain/site/defaults/seo";
import type { SeoSettingsDTO } from "@/core/domain/site/dto";
import { TWITTER_CARD_TYPES } from "@/core/domain/site/seo/constants";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { buildShallowDiff } from "@/lib/diff";
import type { SeoSettingsInput } from "@/schemas/site/seo/seo";
import type { UpdateSeoSettingsPatchDTO } from "@/schemas/site/seo/seo-intents";

/* ------------------------------ mapping UI <-> domaine ------------------------------ */

// Trim "plein" : si string -> .trim(), sinon laisse tel quel (ne convertit JAMAIS "" -> undefined)
const trimKeepEmpty = (s: string | undefined): string | undefined =>
  typeof s === "string" ? s.trim() : s;

/** Domaine (DTO/entité) -> UI (strings) */
function toUi(v: SeoSettingsDTO): SeoSettingsInput {
  return {
    baseUrl: v.baseUrl ?? "",
    defaultTitle: v.defaultTitle ?? "",
    defaultDescription: v.defaultDescription ?? "",
    titleTemplate: v.titleTemplate ?? "",
    canonicalUrl: v.canonicalUrl ?? "",
    robots: v.robots ?? "",
    structuredDataEnabled:
      typeof v.structuredDataEnabled === "boolean"
        ? v.structuredDataEnabled
        : true,
    openGraph: {
      title: v.openGraph?.title ?? "",
      description: v.openGraph?.description ?? "",
      defaultImageUrl:
        (v.openGraph?.defaultImageUrl as string | undefined) ?? "",
      imageAlt: v.openGraph?.imageAlt ?? "",
    },
    twitter: {
      // card : toujours une valeur UI pour contrôle (fallback sur defaults domaine)
      card:
        v.twitter?.card ??
        DEFAULT_SEO_SETTINGS.twitter?.card ??
        TWITTER_CARD_TYPES[1],
      site: v.twitter?.site ?? "",
      creator: v.twitter?.creator ?? "",
    },
  };
}

/** Normalise un objet COMPLET (toutes props existantes) */
function normalizeSeoInput(i: SeoSettingsInput): SeoSettingsInput {
  return {
    baseUrl: trimKeepEmpty(i.baseUrl) ?? "",
    defaultTitle: trimKeepEmpty(i.defaultTitle) ?? "",
    defaultDescription: trimKeepEmpty(i.defaultDescription) ?? "",
    titleTemplate: trimKeepEmpty(i.titleTemplate) ?? "",
    canonicalUrl: trimKeepEmpty(i.canonicalUrl) ?? "",
    robots: trimKeepEmpty(i.robots) ?? "",
    structuredDataEnabled: !!i.structuredDataEnabled,
    openGraph: {
      title: trimKeepEmpty(i.openGraph?.title ?? "") ?? "",
      description: trimKeepEmpty(i.openGraph?.description ?? "") ?? "",
      defaultImageUrl: trimKeepEmpty(i.openGraph?.defaultImageUrl ?? "") ?? "",
      imageAlt: trimKeepEmpty(i.openGraph?.imageAlt ?? "") ?? "",
    },
    twitter: {
      card:
        i.twitter?.card ??
        DEFAULT_SEO_SETTINGS.twitter?.card ??
        TWITTER_CARD_TYPES[1],
      site: trimKeepEmpty(i.twitter?.site ?? "") ?? "",
      creator: trimKeepEmpty(i.twitter?.creator ?? "") ?? "",
    },
  };
}

/** Normalise un PATCH PARTIEL — ne touche que les clés présentes */
function normalizeSeoInputPartial(
  p: Partial<SeoSettingsInput>
): UpdateSeoSettingsPatchDTO {
  const out: UpdateSeoSettingsPatchDTO = {};

  // Racine
  if ("baseUrl" in p) out.baseUrl = trimKeepEmpty(p.baseUrl) ?? "";
  if ("defaultTitle" in p)
    out.defaultTitle = trimKeepEmpty(p.defaultTitle) ?? "";
  if ("defaultDescription" in p)
    out.defaultDescription = trimKeepEmpty(p.defaultDescription) ?? "";
  if ("titleTemplate" in p)
    out.titleTemplate = trimKeepEmpty(p.titleTemplate) ?? "";
  if ("canonicalUrl" in p)
    out.canonicalUrl = trimKeepEmpty(p.canonicalUrl) ?? "";
  if ("robots" in p) out.robots = trimKeepEmpty(p.robots) ?? "";
  if ("structuredDataEnabled" in p)
    out.structuredDataEnabled = !!p.structuredDataEnabled;

  // OpenGraph
  if ("openGraph" in p && p.openGraph) {
    out.openGraph = {};
    if ("title" in p.openGraph!)
      out.openGraph.title = trimKeepEmpty(p.openGraph!.title) ?? "";
    if ("description" in p.openGraph!)
      out.openGraph.description = trimKeepEmpty(p.openGraph!.description) ?? "";
    if ("defaultImageUrl" in p.openGraph!)
      out.openGraph.defaultImageUrl =
        trimKeepEmpty(p.openGraph!.defaultImageUrl) ?? "";
    if ("imageAlt" in p.openGraph!)
      out.openGraph.imageAlt = trimKeepEmpty(p.openGraph!.imageAlt) ?? "";
    // si aucun champ dedans, on laisse Zod gérer (ne rien envoyer)
    if (
      out.openGraph &&
      Object.keys(out.openGraph as Record<string, unknown>).length === 0
    ) {
      delete (out as any).openGraph;
    }
  }

  // Twitter
  if ("twitter" in p && p.twitter) {
    const fallbackCard =
      DEFAULT_SEO_SETTINGS.twitter?.card ?? TWITTER_CARD_TYPES[1];

    // on construit un PARTIAL…
    const tw: Partial<SeoSettingsInput["twitter"]> = {};

    if ("card" in p.twitter) tw.card = p.twitter.card!;
    if ("site" in p.twitter) tw.site = trimKeepEmpty(p.twitter.site) ?? "";
    if ("creator" in p.twitter)
      tw.creator = trimKeepEmpty(p.twitter.creator) ?? "";

    // …et on n’envoie le bloc que s’il y a au moins une clé
    if (Object.keys(tw).length > 0) {
      // ⚠️ card est requise par TwitterSchema → garantir une valeur
      if (!("card" in tw) || !tw.card) tw.card = fallbackCard;

      // cast ok : on garantit la présence de `card`
      out.twitter = tw as SeoSettingsInput["twitter"];
    }
  }

  return out;
}

/** Defaults UI dérivés des defaults domaine */
const DEFAULT_SEO_INPUT: SeoSettingsInput = toUi(DEFAULT_SEO_SETTINGS);

/* ------------------------------------- hook ------------------------------------- */

type UseSeoSettingsResult = SettingsHookResult<SeoSettingsInput>;

/**
 * Hook SEO — exposé en **modèle UI** (strings)
 * - load: GET DTO -> map UI -> normalize
 * - save: PATCH UI(normalize) -> DTO -> UI -> normalize
 * - diff: shallow (après normalize) pour éviter les patchs bruités
 */
export function useSeoSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseSeoSettingsResult {
  return useSettingsResource<SeoSettingsInput>({
    state,
    entity: "seo",
    defaults: normalizeSeoInput(DEFAULT_SEO_INPUT),

    // GET published/draft → DTO domaine → UI → normalize
    load: async (s, opts) => {
      const dto = await settingsAdminApi.seo.get(s, opts);
      return normalizeSeoInput(toUi(dto));
    },

    // PATCH draft (body UI) → normalize avant diff/save → DTO → UI → normalize
    save: async (s, next, opts) => {
      const normalizedPatch = normalizeSeoInputPartial(next);
      const dto = await settingsAdminApi.seo.patch(normalizedPatch, s, opts);
      return normalizeSeoInput(toUi(dto));
    },

    // Diff minimal sur valeurs normalisées
    buildPatch: (baseline, next) =>
      buildShallowDiff(normalizeSeoInput(baseline), normalizeSeoInput(next)) ??
      null,

    // Garantit un state interne toujours normalisé
    onLoaded: (val) => normalizeSeoInput(val),
    beforeSave: (val) => normalizeSeoInput(val),
  });
}
