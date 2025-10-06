/**
 * @file src/i18n/locales/admin/fr/theme.ts
 * @intro i18n — thème (palettes + modes)
 */

const frAdminTheme = {
  theme: {
    palette: {
      ariaLabel: "Palette de couleurs",
      placeholder: "Palette",
      gray: "Gris",
      red: "Rouge",
      purple: "Violet",
      blue: "Bleu",
      green: "Vert",
    },
    mode: { light: "Clair", dark: "Sombre", system: "Système" },
    toggle: {
      aria: "Basculer le thème",
      toDark: "Passer en sombre",
      toLight: "Passer en clair",
    },
  },
} as const;

export default frAdminTheme;
