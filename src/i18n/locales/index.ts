/**
 * @file src/i18n/locales/index.ts
 * @intro i18n — catalogues (UI & erreurs par code)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-catalogue.md
 * @remarks
 * - UI : `MESSAGES[locale]` (ne contient pas les codes d’erreur, sauf `errors.generic`).
 * - Erreurs : `ERROR_MESSAGES[locale]` (mapping `ErrorCode → string`) depuis ./errors/*.ts.
 * - Imports **relatifs** (anti-cycle).
 */
import { ERROR_CODES, type ErrorCode } from "@/core/domain/errors/codes";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/meta";
import type { MessagesTree } from "@/i18n/types";

import en from "@/i18n/locales/en";
import fr from "@/i18n/locales/fr";

import { CONTENT_STATES } from "@/constants/shared/common";
import { BLOCK_TYPES_VALUES } from "@/core/domain/blocks/constants";

import { CONTAINER_VALUES } from "@/core/domain/constants/theme";
import { ENTITY_KINDS } from "@/core/domain/entities/constants";
import { SOCIAL_KINDS } from "@/core/domain/site/social/constants";
import enErrors from "@/i18n/locales/errors/en";
import frErrors from "@/i18n/locales/errors/fr";

import { log } from "@/lib/log";
const i18nLog = log.child({ ns: "i18n" });

/** Registre statique (compile-time) des catalogues UI par locale. */
const UI_REGISTRY = {
  fr,
  en,
} as const satisfies Record<Locale, MessagesTree>;

/** Registre statique (compile-time) des catalogues d'erreurs par locale. */
const ERRORS_REGISTRY = {
  fr: frErrors,
  en: enErrors,
} as const satisfies Record<Locale, Partial<Record<ErrorCode, string>>>;

/** Catalogue UI complet, dérivé de la SoT des locales. */
export const MESSAGES: Record<Locale, MessagesTree> = SUPPORTED_LOCALES.reduce(
  (acc, locale) => {
    const dict = UI_REGISTRY[locale];
    if (process.env.NODE_ENV !== "production" && !dict) {
      i18nLog.warn("i18n.missingUICatalogue", { locale });
    }
    acc[locale] = dict;
    return acc;
  },
  {} as Record<Locale, MessagesTree>
);

/** Catalogue d'erreurs (ErrorCode → message), dérivé de la SoT des locales. */
export const ERROR_MESSAGES: Record<
  Locale,
  Partial<Record<ErrorCode, string>>
> = SUPPORTED_LOCALES.reduce((acc, locale) => {
  acc[locale] = ERRORS_REGISTRY[locale] ?? {};
  return acc;
}, {} as Record<Locale, Partial<Record<ErrorCode, string>>>);

/* ---- Dev checks (assouplis) ---- */
if (process.env.NODE_ENV !== "production") {
  const peek = (dict: MessagesTree, path: string): unknown =>
    path.split(".").reduce<unknown>((acc, k) => {
      if (!acc || typeof acc !== "object") return undefined;
      return (acc as Record<string, unknown>)[k];
    }, dict);

  const warn = (msg: string, ctx?: Record<string, unknown>) => {
    i18nLog.warn(msg, ctx);
  };

  // 1) Présence d'ERROR_MESSAGES pour chaque locale (warn-only)
  for (const loc of SUPPORTED_LOCALES) {
    if (!(loc in ERROR_MESSAGES)) {
      warn("i18n.missingErrorMap", { locale: loc });
    }
  }

  // 2) Parité domaine ↔ i18n (warn-only)
  for (const loc of SUPPORTED_LOCALES) {
    for (const kind of SOCIAL_KINDS) {
      const key = `admin.social.kind.${kind}`;
      if (typeof peek(MESSAGES[loc], key) !== "string") {
        warn("i18n.missingLabel", { key, locale: loc });
      }
    }
    for (const ek of ENTITY_KINDS) {
      const key = `admin.entities.${ek}`;
      if (typeof peek(MESSAGES[loc], key) !== "string") {
        warn("i18n.missingLabel", { key, locale: loc });
      }
    }
    for (const s of CONTENT_STATES) {
      const key = `admin.content.state.${s}`;
      if (typeof peek(MESSAGES[loc], key) !== "string") {
        warn("i18n.missingLabel", { key, locale: loc });
      }
    }
    for (const c of CONTAINER_VALUES) {
      const key = `admin.container.${c}`;
      if (typeof peek(MESSAGES[loc], key) !== "string") {
        warn("i18n.missingLabel", { key, locale: loc });
      }
    }
    for (const bt of BLOCK_TYPES_VALUES) {
      const key = `admin.blocks.type.${bt}`;
      if (typeof peek(MESSAGES[loc], key) !== "string") {
        warn("i18n.missingLabel", { key, locale: loc });
      }
    }
  }

  // 3) Parité ErrorCode ↔ ERROR_MESSAGES (warn-only)
  const allCodes = Object.values(ERROR_CODES) as ErrorCode[];
  for (const loc of SUPPORTED_LOCALES) {
    const map = ERROR_MESSAGES[loc];
    for (const code of allCodes) {
      if (!map[code]) {
        i18nLog.warn("i18n.missingErrorMessage", { code, locale: loc });
      }
    }
  }
}
