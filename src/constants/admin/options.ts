/**
 * @file src/constants/admin/options.ts
 * @intro Helpers d’options (select) pour les formulaires admin
 * @description
 * Fournit des générateurs d’items alignés sur les SoT domaine (heights/containers)
 * avec libellés i18n correspondants. Permet d’éviter la duplication locale.
 *
 * @layer constants
 */

import {
  TWITTER_CARD_TYPES,
  type TwitterCardType,
} from "@/core/domain/site/seo/constants";
import { defaultT } from "@/i18n/default";

type SelectItem<TValue extends string> = Readonly<{
  value: TValue;
  label: string;
}>;

const t = defaultT;

// const HEIGHT_LABEL_KEY: Record<HeaderFooterHeight, string> = {
//   small: "admin.size.small",
//   medium: "admin.size.medium",
//   large: "admin.size.large",
// };

// const CONTAINER_LABEL_KEY: Record<ContainerKey, string> = {
//   narrow: "admin.container.narrow",
//   normal: "admin.container.normal",
//   wide: "admin.container.wide",
//   full: "admin.container.full",
// };

const TWITTER_CARD_LABEL_KEY: Record<TwitterCardType, string> = {
  summary: "admin.seo.twitterCardType.summary",
  summary_large_image: "admin.seo.twitterCardType.summary_large_image",
};

const capitalize = (value: string): string => {
  if (value.length === 0) return value;
  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
};

/**
 * Retourne les items (valeur + libellé) pour les hauteurs header/footer.
 */
// export function getHeightItems(): ReadonlyArray<
//   SelectItem<HeaderFooterHeight>
// > {
//   return HEADER_FOOTER_HEIGHT_VALUES.map((value) => ({
//     value,
//     label: t(HEIGHT_LABEL_KEY[value]) || capitalize(value),
//   }));
// }

/**
 * Retourne les items (valeur + libellé) pour les containers header/footer.
 */
// export function getContainerItems(): ReadonlyArray<SelectItem<ContainerKey>> {
//   return CONTAINER_VALUES.map((value) => ({
//     value,
//     label: t(CONTAINER_LABEL_KEY[value]) || capitalize(value),
//   }));
// }

/**
 * Retourne les options de carte Twitter (summary / summary_large_image).
 */
export function getTwitterCardItems(): ReadonlyArray<
  SelectItem<TwitterCardType>
> {
  return TWITTER_CARD_TYPES.map((value) => ({
    value,
    label: t(TWITTER_CARD_LABEL_KEY[value]) || capitalize(value),
  }));
}
