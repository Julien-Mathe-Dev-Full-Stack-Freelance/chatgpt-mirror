/**
 * @file src/i18n/locales/en.ts
 * @intro i18n — catalogue EN (messages UI)
 * @layer i18n/core
 * @sot docs/bible/ui/i18n-catalogue.md
 * @remarks
 * - UI uniquement. Les messages d’erreur par `ErrorCode` sont dans ./errors/en.ts.
 * - `errors.generic` reste ici (fallback UI).
 */
import type { MessagesTree } from "@/i18n/types";

const en = {} as const satisfies MessagesTree;

export default en;
