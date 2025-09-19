/**
 * @file src/schemas/setup-zod.ts
 * @intro ErrorMap Zod FR + homogénéisation.
 * @description
 * - Remplace les messages par défaut de Zod par des variantes FR.
 * - Uniformise ponctuation finale.
 */

import { defaultT } from "@/i18n/default";
import { z } from "zod";

let installed = false;

//Type permettant de récupérer le code d'erreur Zod
type IssueLike = { code: string } & Record<string, unknown>;

/**
 * Fonction permettant de configurer le comportement des erreurs Zod
 */
export function installZodErrorConfig() {
  if (installed) return;
  installed = true;
  const t = defaultT;

  z.config({
    customError: (issue: IssueLike /*, ctx */) => {
      // utilitaire: toString robuste
      const s = (v: unknown) => (typeof v === "string" ? v : String(v));

      switch (issue.code) {
        case "invalid_type": {
          const expected =
            "expected" in issue
              ? s(issue["expected"])
              : undefined;
          const received =
            "received" in issue
              ? s(issue["received"])
              : undefined;
          if (expected && received) {
            return t("validation.type.invalid", { expected, received });
          }
          return;
        }

        case "too_small": {
          const typeValue = issue["type"];
          const kind = typeof typeValue === "string" ? typeValue : undefined;
          const minimumValue = issue["minimum"];
          const min =
            typeof minimumValue === "number" ? minimumValue : undefined;

          if (kind === "string" && typeof min === "number") {
            return t("validation.text.tooShort", { min });
          }
          if (kind === "array" && typeof min === "number") {
            return t("validation.array.tooSmall", { min });
          }
          if (kind === "number" && typeof min === "number") {
            return t("validation.number.tooSmall", { min });
          }
          if (kind === "date" && typeof min === "number") {
            return t("validation.date.tooSmall");
          }
          return; // laisse le message du schéma
        }

        case "too_big": {
          const typeValue = issue["type"];
          const kind = typeof typeValue === "string" ? typeValue : undefined;
          const maximumValue = issue["maximum"];
          const max =
            typeof maximumValue === "number" ? maximumValue : undefined;

          if (kind === "string" && typeof max === "number") {
            return t("validation.text.tooLong", { max });
          }
          if (kind === "array" && typeof max === "number") {
            return t("validation.array.tooBig", { max });
          }
          if (kind === "number" && typeof max === "number") {
            return t("validation.number.tooBig", { max });
          }
          if (kind === "date" && typeof max === "number") {
            return t("validation.date.tooBig");
          }
          return;
        }

        case "invalid_format": {
          const kind =
            "format" in issue
              ? s(issue["format"])
              : undefined;
          return kind
            ? t("validation.format.invalidWithKind", { kind })
            : t("validation.format.invalid");
        }

        case "not_multiple_of": {
          const multipleValue = issue["multipleOf"];
          const n =
            typeof multipleValue === "number" ? multipleValue : undefined;
          return typeof n === "number"
            ? t("validation.multipleOf", { n })
            : undefined;
        }

        case "unrecognized_keys": {
          const rawKeys = issue["keys"];
          const keys = Array.isArray(rawKeys)
            ? rawKeys.filter((k): k is string => typeof k === "string")
            : [];
          return keys.length
            ? t("validation.object.unrecognizedKeys", { keys: keys.join(", ") })
            : t("validation.object.unrecognizedKey");
        }

        case "invalid_union":
          return t("validation.union.invalid");

        case "invalid_key":
          return t("validation.key.invalid");

        case "invalid_element":
          return t("validation.element.invalid");

        case "invalid_value": {
          const rawOptions = issue["options"];
          const options = Array.isArray(rawOptions) ? rawOptions : [];
          return options.length
            ? t("validation.value.invalidWithOptions", {
                options: options.map(s).join(", "),
              })
            : t("validation.value.invalid");
        }

        case "custom": {
          const messageValue = issue["message"];
          const maybe =
            typeof messageValue === "string" ? messageValue : undefined;
          return maybe ?? undefined;
        }

        default:
          return; // fallback: messages des schémas
      }
    },
  });
}
