"use client";

import { useMemo } from "react";

import { FormGrid } from "@/components/admin/layouts/FormGrid";
import { ActionsBar } from "@/components/admin/molecules/ActionsBar";
import { InputField } from "@/components/admin/molecules/fields/InputField";
import { SelectField } from "@/components/admin/molecules/fields/SelectField";
import { SwitchField } from "@/components/admin/molecules/fields/SwitchField";
import { TextareaField } from "@/components/admin/molecules/fields/TextareaField";
import { FieldPanel } from "@/components/admin/molecules/panels/FieldPanel";

import {
  SEO_DESCRIPTION_MAX,
  SEO_OG_DESCRIPTION_MAX,
} from "@/core/domain/constants/limits";
import { TWITTER_CARD_TYPES } from "@/core/domain/site/seo/constants";

import { useI18n } from "@/i18n/context";

import { abs, brandAssetUrlSafe } from "@/core/domain/urls/href";
import { makeTwitterCardOptions } from "@/i18n/factories/admin/seo";
import type { SeoSettingsInput } from "@/schemas/site/seo/seo";

type SeoFormProps = {
  value: SeoSettingsInput;
  loading?: boolean;
  saving?: boolean;
  isDirty?: boolean;
  onPatch: <K extends keyof SeoSettingsInput>(
    key: K,
    val: SeoSettingsInput[K]
  ) => void;
  onReset: () => void;
  onSubmit: () => void;
  /** Erreurs au blur */
  invalid?: Partial<Record<"defaultTitle", boolean>>;
  /** Marque le champ comme "touched" (pour erreurs au blur) */
  onDefaultTitleBlur?: () => void;
};

export function SeoForm({
  value,
  loading,
  saving,
  isDirty,
  onPatch,
  onReset,
  onSubmit,
  invalid,
  onDefaultTitleBlur,
}: SeoFormProps) {
  const { t } = useI18n();
  const disabled = !!(saving || loading);

  // OG/Twitter en forme UI partielle (évite les obj non contrôlés)
  const og = useMemo(
    () => ({
      title: value.openGraph?.title,
      description: value.openGraph?.description,
      defaultImageUrl: value.openGraph?.defaultImageUrl,
      imageAlt: value.openGraph?.imageAlt,
    }),
    [value.openGraph]
  );

  const fallbackCard = TWITTER_CARD_TYPES[1]; // e.g. "summary_large_image"
  const twitter = useMemo(
    () => ({
      card: value.twitter?.card ?? fallbackCard, // toujours défini
      site: value.twitter?.site,
      creator: value.twitter?.creator,
    }),
    [value.twitter, fallbackCard]
  );

  const twitterCardItems = useMemo(() => makeTwitterCardOptions(t), [t]);

  // Helper : patch OG en nettoyant les champs vides → undefined
  const patchOpenGraph = (
    patch: Partial<NonNullable<SeoSettingsInput["openGraph"]>>
  ) => {
    const curr = value.openGraph ?? {};
    const next = { ...curr, ...patch };

    const cleaned = {
      title: next.title || undefined,
      description: next.description || undefined,
      defaultImageUrl: next.defaultImageUrl || undefined,
      imageAlt: next.imageAlt || undefined,
    };

    const allEmpty = Object.values(cleaned).every((v) => v == null || v === "");
    onPatch("openGraph", allEmpty ? undefined : cleaned);
  };

  const descriptionTone = (len: number, max?: number) => {
    if (len === 0) return "muted" as const;
    if (len > (max ?? Infinity)) return "destructive" as const;
    if (len < 50) return "warning" as const;
    return "success" as const;
  };

  return (
    <form
      aria-busy={loading || saving}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <FormGrid>
        {/* ===== Base (titre par défaut, template, description) ===== */}
        <FieldPanel>
          <InputField
            id="seo-defaultTitle"
            label={t("admin.seo.defaultTitle.label")}
            value={value.defaultTitle ?? ""}
            onChange={(v) => onPatch("defaultTitle", v)}
            onBlur={onDefaultTitleBlur}
            placeholder={t("admin.seo.defaultTitle.placeholder")}
            help={t("admin.seo.defaultTitle.help")}
            loading={loading}
            disabled={disabled}
            invalid={invalid?.defaultTitle}
          />

          <InputField
            id="seo-titleTemplate"
            label={t("admin.seo.titleTemplate.label")}
            value={value.titleTemplate ?? ""}
            onChange={(v) => onPatch("titleTemplate", v || undefined)}
            placeholder={t("admin.seo.titleTemplate.placeholder")}
            help={t("admin.seo.titleTemplate.help")}
            loading={loading}
            disabled={disabled}
          />
          {/* Chips pour insérer rapidement %s */}
          <HelperChips
            items={["%s", "%s — " + t("admin.seo.preview.sampleTitle")]}
            onPick={(snippet) =>
              onPatch(
                "titleTemplate",
                (
                  (value.titleTemplate ?? "") +
                  (value.titleTemplate ? " " : "") +
                  snippet
                ).trim()
              )
            }
          />
        </FieldPanel>

        <FieldPanel>
          <TextareaField
            id="seo-defaultDescription"
            label={t("admin.seo.defaultDescription.label")}
            value={value.defaultDescription ?? ""}
            onChange={(v) => onPatch("defaultDescription", v || undefined)}
            placeholder={t("admin.seo.defaultDescription.placeholder")}
            rows={6}
            loading={loading}
            disabled={disabled}
            // NEW: aide sous le champ + compteur à droite
            help={t("admin.seo.hints.description.length")}
            showCount
            maxLength={SEO_DESCRIPTION_MAX}
            counterToneFor={descriptionTone}
          />
        </FieldPanel>

        {/* ===== Indexation (baseUrl, canonical, robots, structured data) ===== */}
        <FieldPanel>
          <InputField
            id="seo-baseUrl"
            label={t("admin.seo.baseUrl.label")}
            value={value.baseUrl ?? ""}
            onChange={(v) => onPatch("baseUrl", v || undefined)}
            placeholder="https://www.exemple.com"
            help={t("admin.seo.baseUrl.help")}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            loading={loading}
            disabled={disabled}
          />

          <InputField
            id="seo-canonicalUrl"
            label={t("admin.seo.canonicalUrl.label")}
            value={value.canonicalUrl ?? ""}
            onChange={(v) => onPatch("canonicalUrl", v || undefined)}
            placeholder="https://www.exemple.com"
            help={t("admin.seo.canonicalUrl.help")}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            loading={loading}
            disabled={disabled}
          />

          <InputField
            id="seo-robots"
            label={t("admin.seo.robots.label")}
            value={value.robots ?? ""}
            onChange={(v) => onPatch("robots", v || undefined)}
            placeholder="index,follow"
            help={t("admin.seo.robots.help")}
            loading={loading}
            disabled={disabled}
          />

          <HelperChips
            items={[
              "index",
              "follow",
              "noindex",
              "nofollow",
              "max-snippet:160",
              "max-image-preview:large",
              "max-video-preview:10",
            ]}
            onPick={(it) => {
              const curr = (value.robots ?? "").trim();
              const list = curr
                ? curr
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : [];
              if (!list.includes(it)) list.push(it);
              onPatch("robots", list.join(","));
            }}
          />

          <SwitchField
            id="seo-structured-data"
            label={t("admin.seo.structuredData.label")}
            help={t("admin.seo.structuredData.help")}
            checked={!!value.structuredDataEnabled}
            onCheckedChange={(v) => onPatch("structuredDataEnabled", v)}
            disabled={disabled}
            loading={loading}
          />
        </FieldPanel>

        <FieldPanel>
          <SelectField
            id="seo-twitter-card"
            label={t("admin.seo.twitter.card.label")}
            value={twitter.card}
            onChange={(v) =>
              onPatch("twitter", { ...twitter, card: v as typeof twitter.card })
            }
            items={twitterCardItems}
            placeholder={t("admin.seo.fields.select.placeholder") || "Select…"}
            loading={loading}
            disabled={disabled}
          />

          <InputField
            id="seo-twitter-site"
            label={t("admin.seo.twitter.site.label")}
            value={twitter.site ?? ""}
            onChange={(v) =>
              onPatch("twitter", { ...twitter, site: v || undefined })
            }
            placeholder="@votrecompte"
            help={t("admin.seo.twitter.site.help")}
            loading={loading}
            disabled={disabled}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />

          <InputField
            id="seo-twitter-creator"
            label={t("admin.seo.twitter.creator.label")}
            value={twitter.creator ?? ""}
            onChange={(v) =>
              onPatch("twitter", { ...twitter, creator: v || undefined })
            }
            placeholder="@auteur"
            help={t("admin.seo.twitter.creator.help")}
            loading={loading}
            disabled={disabled}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </FieldPanel>
        {/* ===== Open Graph (image + meta) ===== */}
        <FieldPanel>
          <InputField
            id="seo-ogImage"
            label={t("admin.seo.og.image.label")}
            value={og.defaultImageUrl ?? ""}
            onChange={(v) => {
              const next = brandAssetUrlSafe(v, abs(og.defaultImageUrl ?? ""));
              patchOpenGraph({ defaultImageUrl: next || undefined });
            }}
            placeholder="https://…/og-default.jpg"
            help={t("admin.seo.og.image.help")}
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            loading={loading}
            disabled={disabled}
          />

          <InputField
            id="seo-ogTitle"
            label={t("admin.seo.og.title.label")}
            value={og.title ?? ""}
            onChange={(v) => patchOpenGraph({ title: v || undefined })}
            placeholder={t("admin.seo.og.title.placeholder")}
            help={t("admin.seo.og.title.help")}
            loading={loading}
            disabled={disabled}
          />

          <InputField
            id="seo-ogAlt"
            label={t("admin.seo.og.imageAlt.label")}
            value={og.imageAlt ?? ""}
            onChange={(v) => patchOpenGraph({ imageAlt: v || undefined })}
            placeholder={t("admin.seo.og.imageAlt.placeholder")}
            help={t("admin.seo.og.imageAlt.help")}
            loading={loading}
            disabled={disabled}
          />
        </FieldPanel>
        <FieldPanel>
          <TextareaField
            id="seo-ogDescription"
            label={t("admin.seo.og.description.label")}
            value={og.description ?? ""}
            onChange={(v) => patchOpenGraph({ description: v || undefined })}
            placeholder={t("admin.seo.og.description.placeholder")}
            help={t("admin.seo.og.description.help")}
            rows={6}
            loading={loading}
            disabled={disabled}
            // NEW: compteur aligné sur InputField + tonalité
            showCount
            maxLength={SEO_OG_DESCRIPTION_MAX}
            counterToneFor={descriptionTone}
          />
        </FieldPanel>

        {/* ===== Twitter ===== */}
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

function HelperChips({
  items,
  onPick,
}: {
  items: ReadonlyArray<string>;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {items.map((it) => (
        <button
          key={it}
          type="button"
          onClick={() => onPick(it)}
          className="rounded-md border px-2 py-0.5 text-xs hover:bg-accent"
        >
          {it}
        </button>
      ))}
    </div>
  );
}
