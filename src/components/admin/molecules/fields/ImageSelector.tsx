"use client";

/**
 * @file src/components/admin/molecules/fields/ImageSelector.tsx
 * @intro Molécule — Sélecteur d’image (file picker + upload + preview élargie)
 */

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/cn";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type ImageSelectorProps = Readonly<{
  id: string;
  label: string;
  url: string;
  onUrlChange: (next: string) => void;
  disabled?: boolean;
  loading?: boolean;
  accept?: string; // default: "image/*"
  previewAlt: string;
  previewBg?: "light" | "dark" | "neutral";
  onFileSelect?: (file: File) => Promise<string>;

  /** Types MIME recommandés (affiche un hint si on choisit autre chose) */
  preferredTypes?: string[];
  /** Message à afficher si le type choisi n’est pas “preferred” */
  preferredTypeHint?: string;

  /** Bouton pour vider l’URL/aperçu */
  onClear?: () => void;
}>;

export function ImageSelector({
  id,
  label,
  url,
  onUrlChange,
  disabled,
  loading,
  accept = "image/*",
  previewAlt,
  previewBg = "neutral",
  onFileSelect,
  preferredTypes,
  preferredTypeHint,
  onClear,
}: ImageSelectorProps) {
  const { t } = useI18n();

  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState<string | undefined>(undefined);
  const [typeHint, setTypeHint] = useState<string | undefined>(undefined);
  const [localPreview, setLocalPreview] = useState<string | undefined>();
  const [pickedName, setPickedName] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const blobRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, []);

  const bgClass = useMemo(() => {
    switch (previewBg) {
      case "light":
        return "bg-white border";
      case "dark":
        return "bg-black border";
      default:
        return "bg-muted border";
    }
  }, [previewBg]);

  const describedByIds: string[] = [];
  if (fileError) describedByIds.push(`${id}-error`);
  if (typeHint) describedByIds.push(`${id}-hint`);

  // nom de fichier : dernier choisi sinon basename de l’URL
  const showName = pickedName || (url ? url.split("/").pop() : "");

  // Preview plus grande : on force un min-height confortable
  const PREVIEW_MIN_H = 160;

  async function handleFileChange(file: File) {
    // 1) validation basique
    if (!file.type.startsWith("image/")) {
      setFileError(t("admin.media.errors.notImage"));
      return;
    }
    setFileError(undefined);

    // 2) preferred type hint (non bloquant)
    if (Array.isArray(preferredTypes) && preferredTypes.length > 0) {
      if (!preferredTypes.includes(file.type)) {
        setTypeHint(preferredTypeHint || t("admin.media.hints.preferredType"));
      } else {
        setTypeHint(undefined);
      }
    } else {
      setTypeHint(undefined);
    }

    // 3) preview locale
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    const u = URL.createObjectURL(file);
    blobRef.current = u;
    setLocalPreview(u);
    setPickedName(file.name);

    // 4) upload (si callback fourni)
    if (onFileSelect) {
      try {
        setUploading(true);
        const publicUrl = await onFileSelect(file);
        onUrlChange(publicUrl);
        // Remplacer la preview locale par l’URL distante (crisp)
        setLocalPreview(publicUrl);
      } catch (err) {
        const msg =
          (err as { message?: string })?.message ||
          t("admin.media.errors.uploadFailed");
        setFileError(msg);
      } finally {
        setUploading(false);
      }
    }
  }

  function clearAll() {
    setPickedName(undefined);
    setLocalPreview(undefined);
    setFileError(undefined);
    setTypeHint(undefined);
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = undefined;
    }
    onUrlChange("");
    onClear?.();
  }

  const busy = disabled || uploading || loading;

  return (
    <div className="grid gap-2">
      {/* Titre */}
      <div className="text-sm font-medium">{label}</div>

      {/* Grille: 2 boutons puis preview en col-span-2 */}
      <div className="grid grid-cols-2 gap-3 items-start">
        {/* input file masqué */}
        <input
          ref={fileInputRef}
          id={`${id}-file`}
          type="file"
          accept={accept}
          disabled={disabled}
          aria-describedby={
            describedByIds.length ? describedByIds.join(" ") : undefined
          }
          onChange={async (e) => {
            const f = e.currentTarget.files?.[0];
            if (!f) return; // si on annule, on ne touche à rien
            await handleFileChange(f);
          }}
          className="sr-only"
        />

        {/* Boutons */}
        <div className="col-span-1 flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
          >
            {t("admin.media.actions.chooseFile")}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={clearAll}
            disabled={busy || (!url && !localPreview && !pickedName)}
          >
            {t("admin.media.actions.clear")}
          </Button>
        </div>

        {/* Espace pour équilibrer la grille à droite (optionnel) */}
        <div className="col-span-1" />

        {/* Preview sur 2 colonnes */}
        <div className="col-span-2">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-md",
              bgClass
            )}
            style={{ height: PREVIEW_MIN_H }}
            aria-label={t("admin.media.preview.label")}
          >
            {localPreview || url ? (
              <Image
                src={localPreview || url}
                alt={previewAlt}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            ) : null}
          </div>

          {/* Nom du fichier sous la preview */}
          <p
            className="mt-1 text-xs opacity-70 truncate"
            title={showName || t("admin.media.preview.empty")}
          >
            {showName || t("admin.media.preview.empty")}
          </p>
        </div>
      </div>

      {/* statut visuel */}
      {(loading || uploading) && (
        <span role="status" aria-live="polite" className="sr-only">
          {t("admin.media.status.uploading")}
        </span>
      )}

      {/* Hints & erreurs */}
      {typeHint && (
        <p id={`${id}-hint`} className="text-xs text-amber-600">
          {typeHint}
        </p>
      )}
      {fileError && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {fileError}
        </p>
      )}
    </div>
  );
}
ImageSelector.displayName = "ImageSelector";
