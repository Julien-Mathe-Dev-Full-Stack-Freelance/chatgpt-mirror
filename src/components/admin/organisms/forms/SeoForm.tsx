"use client";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { SelectField } from "@/components/admin/molecules/fields/SelectField";
import { TextareaField } from "@/components/admin/molecules/fields/TextareaField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";
import { getTwitterCardItems } from "@/constants/admin/options";
import { useI18n } from "@/i18n/context";
import { SEO_DESCRIPTION_MAX } from "@/core/domain/constants/limits";
import type { SeoSettingsDTO } from "@/core/domain/site/dto";
import type {
  OpenGraphSettings,
  TwitterSettings,
} from "@/core/domain/site/entities/seo";
import { DEFAULT_TWITTER_CARD } from "@/core/domain/site/defaults/seo";
import { brandAssetUrlSafe } from "@/core/domain/urls/tools";
import { cn } from "@/lib/cn";
import { normalizeBaseUrlInput } from "@/lib/normalize";
import { useMemo } from "react";
import { ATOM } from "@/infrastructure/ui/atoms";

export type SeoFormProps = {
  value: SeoSettingsDTO;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onPatch: <K extends keyof SeoSettingsDTO>(
    key: K,
    val: SeoSettingsDTO[K]
  ) => void;
  onReset: () => void;
  onSubmit: () => void;
};

export function SeoForm({
  value,
  loading,
  saving,
  isDirty,
  onPatch,
  onReset,
  onSubmit,
}: SeoFormProps) {
  const { t } = useI18n();
  const disabled = !!(saving || loading);

  const og = useMemo<OpenGraphSettings>(
    () => ({ defaultImageUrl: value.openGraph?.defaultImageUrl }),
    [value.openGraph]
  );

  const twitter = useMemo<TwitterSettings>(
    () => ({
      card: value.twitter?.card ?? DEFAULT_TWITTER_CARD,
      site: value.twitter?.site,
      creator: value.twitter?.creator,
    }),
    [value.twitter]
  );

  const twitterCardItems = useMemo(() => getTwitterCardItems(), []);

  const descLen = (value.defaultDescription ?? "").trim().length;

  return (
    <form
      aria-busy={loading || saving}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      {(loading || saving) && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {loading ? t("admin.ui.loading") : t("ui.actions.saving")}
        </span>
      )}

      <FormGrid>
        <FieldPanel>
          <InputField
            id="seo-baseUrl"
            label={t("ui.seo.baseUrl.label")}
            value={value.baseUrl ?? ""}
            onChange={(v) =>
              onPatch("baseUrl", normalizeBaseUrlInput(v, value.baseUrl))
            }
            placeholder={t("ui.seo.baseUrl.placeholder")}
            help={t("ui.seo.baseUrl.help")}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <InputField
            id="seo-defaultTitle"
            label={t("ui.seo.defaultTitle.label")}
            value={value.defaultTitle ?? ""}
            onChange={(v) => onPatch("defaultTitle", v)}
            placeholder={t("ui.seo.defaultTitle.placeholder")}
            help={t("ui.seo.defaultTitle.help")}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel full>
          <TextareaField
            id="seo-defaultDescription"
            label={t("ui.seo.defaultDescription.label")}
            value={value.defaultDescription ?? ""}
            onChange={(v) => onPatch("defaultDescription", v || undefined)}
            placeholder={t("ui.seo.defaultDescription.placeholder")}
            rows={3}
            loading={loading}
            disabled={disabled}
          />
          <div
            className={cn(
              "text-right text-xs",
              descLen > SEO_DESCRIPTION_MAX
                ? "text-destructive"
                : ATOM.textMuted
            )}
          >
            {descLen}/{SEO_DESCRIPTION_MAX}
          </div>

          <InputField
            id="seo-titleTemplate"
            label={t("ui.seo.titleTemplate.label")}
            value={value.titleTemplate ?? ""}
            onChange={(v) => onPatch("titleTemplate", v || undefined)}
            placeholder={t("ui.seo.titleTemplate.placeholder")}
            help={t("ui.seo.titleTemplate.help")}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <InputField
            id="seo-ogImage"
            label={t("ui.seo.og.image.label")}
            value={og.defaultImageUrl ?? ""}
            onChange={(v) => {
              const next = brandAssetUrlSafe(v, og.defaultImageUrl);
              onPatch(
                "openGraph",
                next
                  ? ({ defaultImageUrl: next } as OpenGraphSettings)
                  : undefined
              );
            }}
            placeholder="https://…/og-default.jpg"
            help={t("ui.seo.og.image.help")}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>

        <FieldPanel>
          <SelectField
            id="seo-twitter-card"
            label={t("ui.seo.twitter.card.label")}
            value={twitter.card ?? "summary_large_image"}
            onChange={(v) =>
              onPatch("twitter", {
                ...twitter,
                card: v as TwitterSettings["card"],
              })
            }
            items={twitterCardItems}
            placeholder={t("admin.ui.fields.select.placeholder") || "Select…"}
            loading={loading}
            disabled={disabled}
          />

          <InputField
            id="seo-twitter-site"
            label={t("ui.seo.twitter.site.label")}
            value={twitter.site ?? ""}
            onChange={(v) =>
              onPatch("twitter", { ...twitter, site: v || undefined })
            }
            placeholder="@votrecompte"
            loading={loading}
            disabled={disabled}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />

          <InputField
            id="seo-twitter-creator"
            label={t("ui.seo.twitter.creator.label")}
            value={twitter.creator ?? ""}
            onChange={(v) =>
              onPatch("twitter", { ...twitter, creator: v || undefined })
            }
            placeholder="@auteur"
            loading={loading}
            disabled={disabled}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </FieldPanel>
      </FormGrid>

      <ActionsBar
        variant="resetSubmit"
        loading={loading}
        saving={saving}
        isDirty={isDirty}
        onReset={onReset}
      />
    </form>
  );
}
