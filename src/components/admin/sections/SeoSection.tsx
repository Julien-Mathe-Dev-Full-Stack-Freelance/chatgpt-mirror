"use client";

/**
 * @file src/components/admin/sections/SeoSection.tsx
 * @intro Section SEO — erreurs (blocantes) + warnings (non-bloquants) harmonisés (+ confirm list)
 * @layer ui/sections
 *
 * Règle UX : ne pas flagger pendant la frappe, flagger **au blur** (sortie de champ).
 * - On mémorise les champs "touchés" et on n’affiche erreurs/hints qu’alors.
 * - Toast uniquement au submit s’il reste des erreurs.
 */

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import { SeoForm } from "@/components/admin/organisms/forms/SeoForm";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { useSeoSettings } from "@/hooks/admin/site/seo/useSeoSettings";
import {
  useSeoUiWarnings,
  validateSeoUi,
  type SeoUiErrors,
  type SeoWarningKey,
} from "@/hooks/admin/site/seo/validate";

import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";

import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { adaptPatchKV } from "@/lib/patch";

// Helpers partagés UI (mapping Zod -> erreurs de champs)
import {
  extractFirstLevelFieldPaths,
  mapZodPathsToFieldErrors,
} from "@/hooks/_shared/forms";

// Dialog de confirmation (liste) pour warnings — homogène avec les autres sections
import { useConfirmList } from "@/hooks/_shared/useConfirmList";

import type { SeoSettingsInput } from "@/schemas/site/seo/seo";

export function SeoSection() {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useSeoSettings();

  // Patch KV adapté (UI → state hook)
  const onPatchKV = useMemo(
    () => adaptPatchKV<SeoSettingsInput>(patch),
    [patch]
  );

  // Prévisualisation SERP
  const [showPreview, setShowPreview] = useState(true);

  /* ── Warnings non-bloquants (live) ── */
  const warningKeys = useSeoUiWarnings(settings);
  const warningHints = useMemo(
    () =>
      warningKeys.map((k: SeoWarningKey) =>
        t(`admin.seo.hints.${k}`, { placeholder: "%s" })
      ),
    [warningKeys, t]
  );

  /* ── Gestion “au blur” : champs touchés ── */
  const [touched, setTouched] = useState<{ defaultTitle?: boolean }>({});

  const markTouched = useCallback((k: "defaultTitle") => {
    setTouched((prev) => ({ ...prev, [k]: true }));
  }, []);

  /* ── Erreurs (blocantes) — n’affiche que si touché ── */
  const buildErrorHintsFromUiErrors = useCallback(
    (ui: SeoUiErrors): string[] => {
      const arr: string[] = [];
      if (ui.defaultTitle && touched.defaultTitle) {
        arr.push(t("admin.seo.errors.defaultTitle.required"));
      }
      return Array.from(new Set(arr));
    },
    [t, touched.defaultTitle]
  );

  /* ─────────────────────────── Submit ─────────────────────────── */

  const handleSubmit = useCallback(async () => {
    // 1) Validation UI (blocante) — indépendante de "touched"
    const uiErr: SeoUiErrors = validateSeoUi(settings);

    // Si une erreur existe, on marque les champs concernés comme "touched"
    // (pour l'affichage) et on bloque AVANT toute confirmation.
    if (uiErr.defaultTitle) {
      setTouched((prev) => ({ ...prev, defaultTitle: true }));
      notify.error(t("admin.seo.errors.form.invalid"));
      return;
    }

    // 2) Confirm si warnings (uniquement s'il n'y a PAS d'erreurs blocantes)
    const filteredWarnings = initialLoading ? [] : warningHints;
    if (filteredWarnings.length > 0) {
      const ok = await confirmList({
        title: t("admin.seo.confirm.warn.title"),
        intro: t("admin.seo.confirm.warn.desc"),
        items: filteredWarnings,
        confirmLabel: t("admin.actions.continueSave"),
        cancelLabel: t("admin.actions.cancel"),
        requireAckLabel: t("admin.actions.acknowledge"),
        tone: "default",
      });
      if (!ok) return;
    }

    // 3) Save (normalisation gérée par le hook)
    try {
      await save(DEFAULT_CONTENT_STATE);
    } catch (e: unknown) {
      if (isValidationError(e)) {
        const paths = extractFirstLevelFieldPaths(e.body);
        mapZodPathsToFieldErrors(paths, t, {
          defaultTitle: "admin.seo.errors.defaultTitle.required",
          defaultDescription: "admin.seo.errors.defaultDescription.invalid",
          titleTemplate: "admin.seo.errors.titleTemplate.invalid",
          baseUrl: "admin.seo.errors.baseUrl.invalid",
          canonicalUrl: "admin.seo.errors.canonicalUrl.invalid",
          robots: "admin.seo.errors.robots.invalid",
          "openGraph.defaultImageUrl":
            "admin.seo.errors.openGraph.defaultImageUrl.invalid",
          "openGraph.title": "admin.seo.errors.openGraph.title.tooLong",
          "openGraph.description":
            "admin.seo.errors.openGraph.description.tooLong",
          "openGraph.imageAlt": "admin.seo.errors.openGraph.imageAlt.tooLong",
          "twitter.card": "admin.seo.errors.twitter.card.required",
          "twitter.site": "admin.seo.errors.twitter.site.invalid",
          "twitter.creator": "admin.seo.errors.twitter.creator.invalid",
        });
        // Marque les champs serveurs retournés comme "touchés" si besoin
        if (paths.some((p) => p === "defaultTitle")) {
          setTouched((prev) => ({ ...prev, defaultTitle: true }));
        }
        notify.error(t("admin.seo.errors.form.invalid"));
        return;
      }
      if (isHttpError(e)) {
        notify.fromError(e);
        return;
      }
      notify.error(t("admin.seo.errors.form.invalid"));
    }
  }, [settings, initialLoading, warningHints, confirmList, save, t]);

  // Évaluation des erreurs courantes (sans side-effect)
  const uiErrorsAtRender = validateSeoUi(settings);

  // Flags invalid = erreur + champ touché (pas pendant le loading initial)
  const invalidFlags = {
    defaultTitle:
      !initialLoading &&
      touched.defaultTitle &&
      Boolean(uiErrorsAtRender.defaultTitle),
  };

  // Hints à afficher en tête = uniquement pour les champs touchés
  const errorHints = buildErrorHintsFromUiErrors(uiErrorsAtRender);

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

      {/* Erreurs (blocantes) — uniquement si des champs touchés sont invalides */}
      {!initialLoading && errorHints.length > 0 && (
        <HintList
          variant="error"
          title={t("admin.seo.errors.form.invalid")}
          hints={errorHints}
          className="mb-3"
        />
      )}

      {/* Warnings (non-bloquants) */}
      {!initialLoading && warningHints.length > 0 && (
        <HintList
          variant="warning"
          title={t("admin.seo.hints.title")}
          hints={warningHints}
          dense
          className="mb-3"
        />
      )}

      <SeoForm
        value={settings}
        loading={initialLoading}
        saving={saving}
        isDirty={isDirty}
        onPatch={onPatchKV}
        onReset={() => {
          setTouched({});
          reset();
        }}
        onSubmit={handleSubmit}
        invalid={invalidFlags}
        // NEW: remonter le blur pour marquer “touched”
        onDefaultTitleBlur={() => markTouched("defaultTitle")}
      />

      <Separator />

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
    (defaultTitle ?? "").trim() || t("admin.seo.preview.sampleTitle");

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
