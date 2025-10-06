/**
 * @file src/i18n/locales/admin/fr/index.ts
 * @intro i18n — catalogues admin (Identité)
 */

import common from "@/i18n/locales/admin/fr/common";
import footer from "@/i18n/locales/admin/fr/footer";
import header from "@/i18n/locales/admin/fr/header";
import identity from "@/i18n/locales/admin/fr/identity";
import media from "@/i18n/locales/admin/fr/media";
import menu from "@/i18n/locales/admin/fr/menu";
import pages from "@/i18n/locales/admin/fr/pages";
import seo from "@/i18n/locales/admin/fr/seo";
import social from "@/i18n/locales/admin/fr/social";
import theme from "@/i18n/locales/admin/fr/theme";

const frAdmin = {
  ...common,
  ...identity,
  ...media,
  ...theme,
  ...header,
  ...menu,
  ...social,
  ...footer,
  ...seo,
  ...pages,
} as const;

export default frAdmin;
