/**
 * @file src/schemas/date.ts
 * @intro Schémas Zod utilitaires pour les dates ISO (UTC, suffixe "Z").
 * @description
 * Valide des dates au format ISO transmises sous forme de `string` avec suffixe "Z"
 * (UTC), afin d’éviter la duplication de règles de validation dans d’autres schémas.
 * @remarks
 * - La validation utilise le parser natif `Date` de JavaScript pour vérifier la
 *   parsabilité, puis impose la contrainte UTC via `endsWith("Z")`.
 * - Ce schéma ne contrôle pas la **forme exacte** de l’ISO (ex. précision millisecondes);
 *   si une stricte conformité est requise, prévoir un `regex` dédié en V2.
 * @layer schemas
 */

import { defaultT } from "@/i18n/default";
import { z } from "zod";

const t = defaultT;

/** Motif ISO 8601 UTC basique (millisecondes optionnelles), suffixe `Z` obligatoire. */
const ISO_UTC_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

/**
 * Vérifie si une `string` représente une date ISO valide et en UTC.
 * Règles:
 * - La chaîne doit être parsable par `new Date(value)`.
 * - Elle doit se terminer par `"Z"` (UTC).
 * @param value - Chaîne candidate au format ISO.
 * @returns `true` si valide et UTC, `false` sinon.
 */
function isIsoDate(value: string): boolean {
  if (typeof value !== "string") return false;
  if (value.trim() !== value) return false; // refuse les espaces autour
  if (!ISO_UTC_PATTERN.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

/** Chaîne au format ISO UTC (ex. `new Date().toISOString()`). */
export const IsoDateStringSchema = z.string().refine(isIsoDate, {
  message: t("validation.iso.utc.invalid"),
});
