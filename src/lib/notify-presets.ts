"use client";
/**
 * @file src/lib/notify-presets.ts
 * @intro Helpers de notifications (i18n via t())
 * @layer ui/lib
 */
import { entityLabel } from "@/constants/shared/entities";
import type { EntityKind } from "@/core/domain/entities/constants";
import { DEFAULT_LOCALE, MESSAGES, createTSafe, type TFunc } from "@/i18n";
import { notify, resolveLocale } from "@/lib/notify";

function formatFieldsList(fields: string[]): string {
  const trimmed = fields.map((f) => f.trim()).filter(Boolean);
  if (trimmed.length === 0) return "";

  const locale = resolveLocale();

  if (typeof Intl !== "undefined" && typeof Intl.ListFormat === "function") {
    try {
      const formatter = new Intl.ListFormat(locale, {
        style: "long",
        type: "conjunction",
      });
      return formatter.format(trimmed);
    } catch {
      /* ignore and fallback below */
    }
  }

  return trimmed.join(", ");
}

function getTranslator(): TFunc {
  const locale = resolveLocale();
  const fallback = MESSAGES[DEFAULT_LOCALE];
  const primary = MESSAGES[locale] ?? fallback;
  return createTSafe(primary, fallback);
}

function fieldsLabel(t: TFunc, fields?: string[]) {
  const fallback = t("notify.fields.fallback");
  if (!fields || fields.length === 0) return fallback;

  const formatted = formatFieldsList(fields);
  return formatted || fallback;
}

export function notifySaved(entity: EntityKind) {
  const t = getTranslator();
  notify.success(
    t("notify.saved.title", { entity: entityLabel(entity) }),
    t("notify.saved.body")
  );
}

export function notifyCreated(entity: EntityKind, name?: string) {
  const t = getTranslator();
  const title = t("notify.created.title", { entity: entityLabel(entity) });
  const body = name
    ? t("notify.created.body.withName", { name })
    : t("notify.created.body.fallback");
  notify.success(title, body);
}

export function notifyDeleted(entity: EntityKind, name?: string) {
  const t = getTranslator();
  const title = t("notify.deleted.title", { entity: entityLabel(entity) });
  const body = name
    ? t("notify.deleted.body.withName", { name })
    : t("notify.deleted.body.fallback");
  notify.success(title, body);
}

export function notifyUpdated(
  entity: EntityKind,
  name?: string,
  fields?: string[]
) {
  const t = getTranslator();
  const title = t("notify.updated.title", { entity: entityLabel(entity) });
  const body = name
    ? t("notify.updated.body.withName", {
        name,
        fields: fieldsLabel(t, fields),
      })
    : t("notify.updated.body.fallback", { fields: fieldsLabel(t, fields) });
  notify.success(title, body);
}

export function notifyNoChanges() {
  const t = getTranslator();
  notify.info(t("notify.noChanges.title"), t("notify.noChanges.body"));
}

export function notifyValidationError(entity: EntityKind, detail: string) {
  const t = getTranslator();
  notify.error(
    t("admin.notify.validation.error.title", { entity: entityLabel(entity) }),
    t("admin.notify.validation.error.body", { detail })
  );
}
