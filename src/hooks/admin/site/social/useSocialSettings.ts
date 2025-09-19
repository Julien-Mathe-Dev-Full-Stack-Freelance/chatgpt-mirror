"use client";

/**
 * @file src/hooks/admin/site/social/useSocialSettings.ts
 * @intro State + I/O SocialLinks (GET/PATCH) + helpers liste
 * @layer ui/hooks
 */
import { useI18n } from "@/i18n/context";
import {
  DEFAULT_CONTENT_STATE,
  type ContentState,
} from "@/core/domain/constants/common";
import { DEFAULT_SOCIAL_SETTINGS } from "@/core/domain/site/defaults/social";
import type { SocialItemDTO, SocialSettingsDTO } from "@/core/domain/site/dto";
import {
  DEFAULT_SOCIAL_HREF,
  DEFAULT_SOCIAL_KIND,
  SOCIAL_KIND_EMAIL,
  SOCIAL_KIND_WEBSITE,
} from "@/core/domain/site/social/constants";
import { useObjectArrayField } from "@/hooks/_shared/list/useObjectArrayField";
import {
  useSettingsResource,
  type SettingsHookResult,
} from "@/hooks/_shared/useSettingsResource";
import { settingsAdminApi } from "@/infrastructure/http/admin/site-settings.client";
import { notifyValidation } from "@/lib/notify-presets";
import { useCallback, useMemo } from "react";
import { brandHrefSafe, href as brandHref } from "@/core/domain/urls/href";
import {
  isRelativeUrl,
  isAbsoluteHttpProtocol,
} from "@/core/domain/constants/web";
import { isMailtoHref } from "@/core/domain/urls/mailto";

function isHttpAbsolute(href: string): boolean {
  try {
    const url = new URL(href);
    return isAbsoluteHttpProtocol(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

type Base = SettingsHookResult<SocialSettingsDTO>;

export type UseSocialSettingsResult = Omit<Base, "save"> &
  Readonly<{
    addItem: (item?: Partial<SocialItemDTO>, index?: number) => void;
    updateItem: (index: number, patch: Partial<SocialItemDTO>) => void;
    removeItem: (index: number) => void;
    moveItem: (from: number, to: number) => void;
    save: (state?: ContentState) => Promise<void>;
  }>;

export function useSocialSettings(
  state: ContentState = DEFAULT_CONTENT_STATE
): UseSocialSettingsResult {
  const { t } = useI18n();
  const base = useSettingsResource<SocialSettingsDTO>({
    state,
    entity: "social",
    defaults: DEFAULT_SOCIAL_SETTINGS,
    load: (s, opts) => settingsAdminApi.social.get(s, opts),
    save: (s, next, opts) => settingsAdminApi.social.patch(next, s, opts),
  });

  const { settings, patch, isDirty } = base;

  const itemsApi = useObjectArrayField<
    SocialSettingsDTO,
    "items",
    SocialItemDTO
  >({
    settings,
    key: "items",
    patch,
  });

  const addItem = useCallback(
    (item?: Partial<SocialItemDTO>, index?: number) => {
      const fallback = brandHref(DEFAULT_SOCIAL_HREF);
      const initialHref = (item?.href && brandHrefSafe(item.href)) ?? fallback;
      const next: SocialItemDTO = {
        kind: (item?.kind ?? DEFAULT_SOCIAL_KIND) as SocialItemDTO["kind"],
        href: initialHref,
      };
      itemsApi.add(next, index);
    },
    [itemsApi]
  );

  const updateItem = useCallback(
    (index: number, p: Partial<SocialItemDTO>) => {
      const current = settings.items?.[index]?.href;
      const nextHref =
        p.href !== undefined ? brandHrefSafe(p.href, current) : undefined;

      itemsApi.merge(index, {
        ...p,
        ...(nextHref ? { href: nextHref } : {}),
      });
    },
    [itemsApi, settings.items]
  );

  const removeItem = useCallback(
    (index: number) => itemsApi.remove(index),
    [itemsApi]
  );
  const moveItem = useCallback(
    (from: number, to: number) => itemsApi.move(from, to),
    [itemsApi]
  );

  const duplicateKindDetail = useMemo(() => {
    if (!settings.items) return null;

    const seen = new Set<string>();
    for (const it of settings.items) {
      const kind = it.kind;
      if (seen.has(kind)) {
        return t("validation.social.item.duplicateKind");
      }
      seen.add(kind);
    }

    return null;
  }, [settings.items, t]);

  const hrefIssueDetail = useMemo(() => {
    const items = settings.items ?? [];

    for (const it of items) {
      const href = it.href?.trim();
      if (!href) continue;

      if (it.kind === SOCIAL_KIND_EMAIL) {
        if (!isMailtoHref(href)) {
          return t("validation.social.href.mailtoRequired");
        }
        continue;
      }

      if (it.kind === SOCIAL_KIND_WEBSITE) {
        const isRel = isRelativeUrl(href);
        const isAbs = isHttpAbsolute(href);
        if (!isRel && !isAbs) {
          return t("validation.social.href.invalidForPlatform");
        }
        continue;
      }

      if (isMailtoHref(href)) {
        return t("validation.social.href.mailtoForbidden");
      }

      if (!isHttpAbsolute(href)) {
        if (isRelativeUrl(href)) {
          return t("validation.social.href.absoluteRequired");
        }
        return t("validation.social.href.invalidForPlatform");
      }
    }

    return null;
  }, [settings.items, t]);

  const hasInvalidItems = useMemo(
    () => (settings.items ?? []).some((it) => !it.href?.trim()),
    [settings.items]
  );

  const save = useCallback(
    async (s: ContentState = DEFAULT_CONTENT_STATE) => {
      if (duplicateKindDetail) {
        notifyValidation("social", duplicateKindDetail);
        return;
      }
      if (hrefIssueDetail) {
        notifyValidation("social", hrefIssueDetail);
        return;
      }
      if (hasInvalidItems) {
        notifyValidation("social", t("validation.social.item.missingHref"));
        return;
      }
      if (!isDirty) return;
      await base.save(s);
    },
    [
      base,
      duplicateKindDetail,
      hrefIssueDetail,
      hasInvalidItems,
      isDirty,
      t,
    ]
  );

  return { ...base, addItem, updateItem, removeItem, moveItem, save } as const;
}
