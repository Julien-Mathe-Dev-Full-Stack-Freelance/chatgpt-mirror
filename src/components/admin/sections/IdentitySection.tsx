"use client";

/**
 * @file src/components/admin/sections/IdentitySection.tsx
 * @intro Section Identité (titre, logos, favicons) — erreurs (blocantes) + warnings (non-bloquants) harmonisés
 * @layer ui/sections
 *
 * Règle UX : ne pas flagger pendant la frappe, flagger **au blur** (sortie de champ).
 * - On mémorise les champs "touchés" et on n’affiche erreurs/hints qu’alors.
 * - Toast uniquement au submit s’il reste des erreurs.
 */

import { useCallback, useMemo, useState } from "react";

import { Heading } from "@/components/admin/atoms/Heading";
import { HintList } from "@/components/admin/molecules/HintList";
import { IdentityForm } from "@/components/admin/organisms/forms/IdentityForm";
import { Separator } from "@/components/ui/separator";

import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import { useIdentitySettings } from "@/hooks/admin/site/identity/useIdentitySettings";
import {
  useIdentityUiWarnings,
  validateIdentityUi,
  type IdentityUiErrors,
  type IdentityWarningKey,
} from "@/hooks/admin/site/identity/validate";

import { useI18n } from "@/i18n/context";
import { uploadImage } from "@/infrastructure/http/admin/media.client";
import { ATOM } from "@/infrastructure/ui/atoms";

import { isHttpError, isValidationError } from "@/lib/http/api-fetch";
import { notify } from "@/lib/notify";
import { adaptPatchKV } from "@/lib/patch";

// Helpers partagés UI (mapping Zod -> erreurs de champs)
import {
  extractFirstLevelFieldPaths,
  mapZodPathsToFieldErrors,
} from "@/hooks/_shared/forms";

// Dialog de confirmation (liste) pour warnings
import { useConfirmList } from "@/hooks/_shared/useConfirmList";
import type { IdentitySettingsInput } from "@/schemas/site/identity/identity";

export function IdentitySection() {
  const { t } = useI18n();
  const confirmList = useConfirmList();

  const { settings, initialLoading, saving, isDirty, patch, reset, save } =
    useIdentitySettings();

  // Patch KV adapté (UI → state hook)
  const onPatchKV = useMemo(
    () => adaptPatchKV<IdentitySettingsInput>(patch),
    [patch]
  );

  // Upload image (retourne l’URL à stocker)
  const onUploadImage = useCallback(async (file: File): Promise<string> => {
    const { url } = await uploadImage(file);
    return url;
  }, []);

  /* ── Warnings non-bloquants (live) ── */
  const warningKeys = useIdentityUiWarnings({
    logoLightUrl: settings.logoLightUrl,
    logoDarkUrl: settings.logoDarkUrl,
    faviconLightUrl: settings.faviconLightUrl,
    faviconDarkUrl: settings.faviconDarkUrl,
  });

  const warningHints = useMemo(
    () =>
      warningKeys.map((k: IdentityWarningKey) =>
        t(`admin.identity.warnings.${k}`)
      ),
    [warningKeys, t]
  );

  /* ── Gestion “au blur” : champs touchés ── */
  const [touched, setTouched] = useState<{
    title?: boolean;
    logoAlt?: boolean;
  }>({});

  const markTouched = useCallback((k: "title" | "logoAlt") => {
    setTouched((prev) => ({ ...prev, [k]: true }));
  }, []);

  /* ── Erreurs (blocantes) — même logique, mais n’affiche que si touché ── */
  const buildErrorHintsFromUiErrors = useCallback(
    (ui: IdentityUiErrors): string[] => {
      const arr: string[] = [];
      if (ui.title && touched.title) {
        arr.push(t("admin.identity.errors.title.required"));
      }
      if (ui.logoAlt && touched.logoAlt) {
        arr.push(t("admin.identity.errors.logoAlt.required"));
      }
      return Array.from(new Set(arr));
    },
    [t, touched.title, touched.logoAlt]
  );

  /* ── Submit ── */
  const handleSubmit = useCallback(async () => {
    // 1) Validation UI (blocante)
    const uiErr: IdentityUiErrors = validateIdentityUi({
      title: settings.title,
      logoAlt: settings.logoAlt,
    });

    // Si erreurs → on marque comme touché les champs invalides pour afficher hints
    if (uiErr.title || uiErr.logoAlt) {
      setTouched((prev) => ({
        ...prev,
        title: prev.title || Boolean(uiErr.title),
        logoAlt: prev.logoAlt || Boolean(uiErr.logoAlt),
      }));
    }

    const errorHints = buildErrorHintsFromUiErrors(uiErr);
    if (errorHints.length > 0) {
      notify.error(t("admin.identity.errors.form.invalid"));
      return;
    }

    // 2) Confirmation si warnings présents
    if (warningHints.length > 0) {
      const ok = await confirmList({
        title: t("admin.menu.confirm.warn.title"),
        intro: t("admin.menu.confirm.warn.desc"),
        items: warningHints,
        confirmLabel: t("admin.actions.continueSave"),
        cancelLabel: t("admin.actions.cancel"),
        requireAckLabel: t("admin.actions.acknowledge"),
        tone: "default",
      });
      if (!ok) return;
    }

    //  Save + mapping erreurs 400 (Zod)
    try {
      await save(DEFAULT_CONTENT_STATE);
      // Optionnel : on pourrait reset les “touched” après un save réussi si tu veux
      // setTouched({});
    } catch (e: unknown) {
      if (isValidationError(e)) {
        const paths = extractFirstLevelFieldPaths(e.body);
        const fieldErrors = mapZodPathsToFieldErrors(paths, t, {
          title: "admin.identity.errors.title.required",
          logoAlt: "admin.identity.errors.logoAlt.required",
          tagline: "admin.identity.errors.tagline.tooLong",
        });

        // Marquer touché les champs mentionnés par Zod pour faire apparaître le style/hint
        setTouched((prev) => ({
          ...prev,
          title: prev.title || Boolean(fieldErrors["title"]),
          logoAlt: prev.logoAlt || Boolean(fieldErrors["logoAlt"]),
        }));

        notify.error(t("admin.identity.errors.form.invalid"));
        return;
      }

      if (isHttpError(e)) {
        notify.fromError(e);
        return;
      }

      notify.error(t("admin.identity.errors.form.invalid"));
    }
  }, [
    settings.title,
    settings.logoAlt,
    save,
    t,
    warningHints,
    confirmList,
    buildErrorHintsFromUiErrors,
  ]);

  // Évaluation des erreurs courantes (sans side-effect)
  const uiErrorsAtRender = validateIdentityUi({
    title: settings.title,
    logoAlt: settings.logoAlt,
  });

  // Flags invalid = erreur + champ touché (pas pendant le loading initial)
  const invalidFlags = {
    title: !initialLoading && touched.title && Boolean(uiErrorsAtRender.title),
    logoAlt:
      !initialLoading && touched.logoAlt && Boolean(uiErrorsAtRender.logoAlt),
  };

  // Hints à afficher en tête = uniquement pour les champs touchés
  const errorHints = buildErrorHintsFromUiErrors(uiErrorsAtRender);

  return (
    <section
      aria-labelledby="identity-title"
      aria-busy={initialLoading || saving || undefined}
      className={ATOM.space.sectionGap}
    >
      <Heading id="identity-title" as="h3" visuallyHidden>
        {t("admin.identity.title")}
      </Heading>

      {/* Erreurs (blocantes) — uniquement si des champs touchés sont invalides */}
      {!initialLoading && errorHints.length > 0 && (
        <HintList
          variant="error"
          title={t("admin.identity.errors.form.invalid")}
          hints={errorHints}
          className="mb-3"
        />
      )}

      {/* Warnings (non-bloquants) */}
      {!initialLoading && warningHints.length > 0 && (
        <HintList
          variant="warning"
          title={t("admin.menu.hints.title")}
          hints={warningHints}
          dense
          className="mb-3"
        />
      )}

      <IdentityForm
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
        onUploadImage={onUploadImage}
        invalid={invalidFlags}
        // NEW: remonter les blur pour marquer “touched”
        onTitleBlur={() => markTouched("title")}
        onLogoAltBlur={() => markTouched("logoAlt")}
      />

      <Separator />
    </section>
  );
}
