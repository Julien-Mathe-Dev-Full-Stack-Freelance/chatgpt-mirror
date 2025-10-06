/**
 * @file src/i18n/locales/admin/en/index.ts
 * @intro i18n — admin catalogues (Identity)
 */

import common from "@/i18n/locales/admin/en/common";
import footer from "@/i18n/locales/admin/en/footer";
import header from "@/i18n/locales/admin/en/header";
import identity from "@/i18n/locales/admin/en/identity";
import media from "@/i18n/locales/admin/en/media";
import menu from "@/i18n/locales/admin/en/menu";
import seo from "@/i18n/locales/admin/en/seo";
import social from "@/i18n/locales/admin/en/social";
import theme from "@/i18n/locales/admin/en/theme";
import pages from "@/i18n/locales/admin/en/pages";

const enAdmin = {
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

export default enAdmin;
