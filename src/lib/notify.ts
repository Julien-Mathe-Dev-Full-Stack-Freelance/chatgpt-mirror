"use client";

/**
 * @file src/lib/notify.ts
 * @intro Notifications globales (Sonner)
 * @description
 * Fournit une façade simple pour afficher des toasts cohérents :
 * - `success|info|warning|error(title, description?, opts?)`
 * - `fromError(err[, fallback, opts])` : extrait un message lisible d’un `unknown`
 *   et mappe éventuellement un `error.code` vers un message FR.
 *
 * @layer lib/ui
 * @remarks
 * - Requiert un `<Toaster />` monté au niveau racine de l’app (ex. `app/layout.tsx`).
 * - Les messages mappés par code s’appuient sur l’i18n (catalogue `ErrorCode → message`).
 * - `fromError` reconnaît :
 *   - AbortError (DOM/Fetch) → info “Opération annulée”
 *   - `HttpError` (levée par `apiFetch`) → map `error.code`, sinon fallback i18n
 *   - Forme `{ error: { code, message } }` renvoyée par l’API
 *   - `Error` / `string` / objet générique → fallback i18n
 */

import type { ErrorCode } from "@/core/domain/errors/codes";
import { ERROR_CODES } from "@/core/domain/errors/codes";
import type { Locale } from "@/i18n";
import {
  DEFAULT_LOCALE,
  MESSAGES,
  getErrorMsgSafe,
  getMsg,
  isLocale,
} from "@/i18n";
import { isAbortError } from "@/lib/http/abortError";
import { HttpError } from "@/lib/http/api-fetch";
import { toast as sonner, type ExternalToast } from "sonner";

/* --------------------------------- Messages -------------------------------- */
const KNOWN_ERROR_CODES = new Set<ErrorCode>(
  Object.values(ERROR_CODES) as ErrorCode[]
);

/* ------------------------------- Configuration ------------------------------ */

const DEFAULTS: ExternalToast = { duration: 3500 };

const withDefaults = (opts?: ExternalToast): ExternalToast => ({
  ...DEFAULTS,
  ...(opts ?? {}),
});

/* --------------------------------- Helpers --------------------------------- */

type UnknownRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is UnknownRecord =>
  typeof v === "object" && v !== null;

type ApiErrorPayload = { error: { code?: string; message?: string } };
function isApiErrorPayload(x: unknown): x is ApiErrorPayload {
  if (!isRecord(x) || !("error" in x)) return false;
  const inner = (x as UnknownRecord)["error"];
  if (!isRecord(inner)) return false;
  const codeOk =
    !("code" in inner) || typeof (inner as UnknownRecord)["code"] === "string";
  const messageOk =
    !("message" in inner) ||
    typeof (inner as UnknownRecord)["message"] === "string";
  return codeOk && messageOk;
}

export function resolveLocale(): Locale {
  if (typeof document !== "undefined") {
    const attr =
      document.documentElement.getAttribute("lang") ||
      document.documentElement.lang;
    if (isLocale(attr)) return attr;
  }
  return DEFAULT_LOCALE;
}

function messageFromCode(
  locale: Locale,
  code: unknown,
  fallbackText: string
): string {
  if (typeof code !== "string") return fallbackText;
  return KNOWN_ERROR_CODES.has(code as ErrorCode)
    ? getErrorMsgSafe(locale, code as ErrorCode, { fallbackText })
    : fallbackText;
}

function getNotifyText(locale: Locale, key: string, fallback: string): string {
  const primary = getMsg(MESSAGES[locale], key);
  if (typeof primary === "string") return primary;

  const fallbackLocaleMsg = getMsg(MESSAGES[DEFAULT_LOCALE], key);
  if (typeof fallbackLocaleMsg === "string") return fallbackLocaleMsg;

  return fallback;
}

/* ------------------------------- API Publique ------------------------------- */

export const notify = {
  success: (title: string, description?: string, opts?: ExternalToast) =>
    sonner.success(title, { description, ...withDefaults(opts) }),

  info: (title: string, description?: string, opts?: ExternalToast) =>
    sonner(title, { description, ...withDefaults(opts) }),

  warning: (title: string, description?: string, opts?: ExternalToast) =>
    sonner.warning(title, { description, ...withDefaults(opts) }),

  error: (title: string, description?: string, opts?: ExternalToast) =>
    sonner.error(title, { description, ...withDefaults(opts) }),

  /**
   * Affiche un toast d’erreur à partir d’un `unknown`.
   */
  fromError(
    error: unknown,
    fallback = "Une erreur est survenue.",
    opts?: ExternalToast
  ) {
    const locale = resolveLocale();
    const errorTitle = getNotifyText(locale, "notify.error.title", "Erreur");
    const abortTitle = getNotifyText(
      locale,
      "notify.abort.title",
      "Opération annulée"
    );
    const abortDescription = getNotifyText(
      locale,
      "notify.abort.description",
      "La requête a été interrompue."
    );

    // 1) Annulation
    if (isAbortError(error)) {
      return sonner.info(abortTitle, {
        description: abortDescription,
        ...withDefaults(opts),
      });
    }

    const fallbackText = getErrorMsgSafe(locale, ERROR_CODES.UNKNOWN, {
      fallbackText: fallback,
    });

    // 2) HttpError (levée par apiFetch)
    if (error instanceof HttpError) {
      const mapped = messageFromCode(locale, error.code, fallbackText);
      return sonner.error(errorTitle, {
        description: mapped,
        ...withDefaults(opts),
      });
    }

    // 3) Forme API { error: { code, message } }
    if (isApiErrorPayload(error)) {
      const { code } = error.error;
      const mapped = messageFromCode(locale, code, fallbackText);
      return sonner.error(errorTitle, {
        description: mapped,
        ...withDefaults(opts),
      });
    }

    // 4) Error / string / objet générique
    return sonner.error(errorTitle, {
      description: fallbackText,
      ...withDefaults(opts),
    });
  },
};
