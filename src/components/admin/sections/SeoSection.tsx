"use client";

/**
 * @file src/components/admin/sections/SeoSection.tsx
 */

import Image from "next/image";

import { Heading } from "@/components/admin/atoms/Heading";
import { SeoForm } from "@/components/admin/organisms/forms/SeoForm";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_CONTENT_STATE } from "@/core/domain/constants/common";
import { useSeoSettings } from "@/hooks/admin/site/seo/useSeoSettings";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { adaptPatchKV } from "@/lib/patch";
import type { SeoSettingsDTO } from "@/core/domain/site/dto";
import { useMemo, useState } from "react";

export function SeoSection() {
  const { t } = useI18n();
  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useSeoSettings();

  const [showPreview, setShowPreview] = useState(true);

  // adaptateur: (key, val) -> patch({ [key]: val })
  const onPatchKV = useMemo(
    () => adaptPatchKV<SeoSettingsDTO>(patch),
    [patch]
  );

  return (
    <section
      aria-labelledby="seo-title"
      aria-describedby="seo-desc"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="seo-title" as="h3" visuallyHidden>
        {t("admin.seo.title")}
      </Heading>
      <p id="seo-desc" className={ATOM.srOnly}>
        {t("admin.seo.desc")}
      </p>

      <SeoForm
        value={settings}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onPatch={onPatchKV}
        onReset={reset}
        onSubmit={() => void save(DEFAULT_CONTENT_STATE)}
      />

      <div className="flex items-center gap-2">
        <Switch
          id="showSerpPreview"
          checked={showPreview}
          onCheckedChange={setShowPreview}
        />
        <Label htmlFor="showSerpPreview">{t("admin.seo.preview.toggle")}</Label>
      </div>

      {showPreview && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("admin.seo.preview.legend")}
          </p>
          <SerpPreview
            baseUrl={settings.baseUrl}
            titleTemplate={settings.titleTemplate}
            defaultTitle={settings.defaultTitle}
            defaultDescription={settings.defaultDescription}
            ogImage={settings.openGraph?.defaultImageUrl}
          />
        </div>
      )}
    </section>
  );
}

function SerpPreview({
  baseUrl,
  titleTemplate,
  defaultTitle,
  defaultDescription,
  ogImage,
}: {
  baseUrl?: string;
  titleTemplate?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  ogImage?: string;
}) {
  const { t } = useI18n();
  const examplePageTitle =
    defaultTitle?.trim() || t("admin.seo.preview.sampleTitle");

  const title =
    titleTemplate && titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", examplePageTitle)
      : titleTemplate || examplePageTitle;

  const url =
    (baseUrl?.replace(/\/+$/, "") || t("admin.seo.preview.sampleBase")) +
    "/exemple";

  return (
    <div className="space-y-2 rounded-xl border bg-background p-4">
      <div className="text-sm text-muted-foreground">{url}</div>
      <div className="text-base font-medium text-foreground">{title}</div>
      {defaultDescription ? (
        <div className="line-clamp-2 text-sm text-muted-foreground">
          {defaultDescription}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground opacity-70">
          {t("admin.seo.preview.noDescription")}
        </div>
      )}
      {ogImage ? (
        <div className="relative mt-2 h-24 w-full overflow-hidden rounded">
          <Image
            src={ogImage}
            alt={t("admin.seo.preview.ogAlt")}
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        </div>
      ) : null}
    </div>
  );
}
SeoSection.displayName = "SeoSection";
