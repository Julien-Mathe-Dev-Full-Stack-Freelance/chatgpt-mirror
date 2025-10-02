/**
 * @file src/i18n/locales/admin/fr/index.ts
 * @intro i18n — catalogues admin (Identité)
 */

import common from "@/i18n/locales/admin/fr/common";
import header from "@/i18n/locales/admin/fr/header";
import identity from "@/i18n/locales/admin/fr/identity";
import media from "@/i18n/locales/admin/fr/media";
import menu from "@/i18n/locales/admin/fr/menu";
import shell from "@/i18n/locales/admin/fr/shell";
import social from "@/i18n/locales/admin/fr/social";
import theme from "@/i18n/locales/admin/fr/theme";

const frAdmin = {
  ...common,
  ...identity,
  ...media,
  ...theme,
  ...shell,
  ...header,
  ...menu,
  ...social,
} as const;

export default frAdmin;
