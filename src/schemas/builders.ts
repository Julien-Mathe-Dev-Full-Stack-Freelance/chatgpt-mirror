/**
 * @file src/schemas/builders.ts
 * @intro Builders de schémas Zod.
 * @description
 * - Fournit des helpers pour construire des schémas de validation.
 * - Les schémas sont définis dans le même fichier que leur utilisation.
 * - Les helpers sont définis dans le même fichier que leur utilisation.
 *
 * Observabilité :
 * - Aucune (utilitaires pures sans effet de bord).
 *
 * @layer schemas
 */

import { defaultT } from "@/i18n/default";
import { ContentStateSchema } from "@/schemas/shared/workflow-fragments";
import { z } from "zod";

type MessageKey = string;

const t = defaultT;
const TEXT_TOO_LONG_KEY = "validation.text.tooLong" as const;
const TEXT_TOO_SHORT_KEY = "validation.text.tooShort" as const;

// -------------------------------------------------------------
// Builders & fragments communs (strings, réseaux sociaux, intents)
// -------------------------------------------------------------

/**
 * Construit un schéma Zod pour une chaîne **trimée** et non vide.
 * @param min Longueur minimale (≥ 1)
 * @param max Longueur maximale (optionnelle)
 * @param message Message d’erreur personnalisé (optionnel pour le min)
 */
export function nonEmptyTrimmedString(
  min: number,
  max?: number,
  keys?: { tooShort?: MessageKey; tooLong?: MessageKey }
) {
  const minEff = Math.max(1, min);

  const msgTooShort = t(keys?.tooShort ?? TEXT_TOO_SHORT_KEY, {
    min: minEff,
  });
  const msgTooLong =
    typeof max === "number"
      ? t(keys?.tooLong ?? TEXT_TOO_LONG_KEY, { max })
      : undefined;

  let schema = z.string().trim();
  schema = schema.refine((s) => s.length >= minEff, { message: msgTooShort });

  if (typeof max === "number") {
    schema = schema.refine((s) => s.length <= max, { message: msgTooLong! });
  }

  return schema;
}

/**
 * Schéma pour un **template de titre** contenant un placeholder.
 * Exemple: "%s — Mon site" (doit contenir "%s").
 *
 * @param placeholder Placeholder requis (par défaut "%s")
 * @param opts Contraintes optionnelles { min, max, messageMissingPlaceholder }
 */
export function titleTemplateWithPlaceholder(
  placeholder = "%s",
  opts?: { min?: number; max?: number; messageMissingPlaceholder?: string }
) {
  const { min = 3, max = 120, messageMissingPlaceholder } = opts ?? {};
  return z
    .string()
    .trim()
    .refine((s) => !/[\r\n]/.test(s), {
      message: t("validation.title.noNewlines"),
    })
    .refine((s) => s.includes(placeholder), {
      message:
        messageMissingPlaceholder ??
        t("validation.titleTemplate.missingPlaceholder", { s: placeholder }),
    })
    .refine((s) => s.length >= min, {
      message: t(TEXT_TOO_SHORT_KEY, { min }),
    })
    .refine((s) => s.length <= max, {
      message: t(TEXT_TOO_LONG_KEY, { max }),
    });
}

/**
 * Helper pour composer un schéma d’**intentions API** avec `state` optionnel.
 * Usage standard: `withOptionalState(ThemeSettingsSchema)`
 *
 * - Rend tous les champs du schéma **optionnels** (partial)
 * - Ajoute `state?: "draft" | "published"`
 */
export function withOptionalState<
  TShape extends z.ZodRawShape,
  TBase extends z.ZodObject<TShape>
>(base: TBase) {
  return base
    .partial()
    .extend({ state: ContentStateSchema.optional() })
    .strict(); // ← inconnu = 400 VALIDATION_ERROR côté API
}

// /**
//  * helper pour créer un champ `id` avec une borne de taille.
//  * @param min Longueur minimale (≥ 1)
//  * @param max Longueur maximale (optionnelle)
//  * @returns `z.string().trim().refine(...)`
//  */
// export function idString(min: number, max: number) {
//   const minEff = Math.max(1, min);
//   return z
//     .string()
//     .trim()
//     .refine((s) => s.length >= minEff, {
//       message: t("validation.id.required"),
//     })
//     .refine((s) => s.length <= max, {
//       message: t(TEXT_TOO_LONG_KEY, { max }),
//     });
// }

/**
 * Helper pour créer un type de patch à partir d'un type de base
 */
export type PatchFromBase<TBase, TOverrides extends object = {}> = {
  [K in keyof TBase]?: K extends keyof TOverrides ? TOverrides[K] : TBase[K];
};
