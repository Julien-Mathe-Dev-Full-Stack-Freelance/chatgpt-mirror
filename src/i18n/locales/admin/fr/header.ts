/**
 * @file src/i18n/locales/admin/fr/header.ts
 * @intro i18n — En-tête (layout admin) + Réglages Header (site)
 * @description
 * Regroupe :
 *  - Clés du header de l’interface d’administration (layout/shell).
 *  - Clés des réglages "Header" côté admin (site client).
 *
 * Convention :
 *  - Layout admin : clés à la racine (ariaHeader, skipToContent, brand, …)
 *  - Réglages site : groupes `title`, `desc`, `fields.*`, `hints.*`, `confirm.*`
 */

const frAdminHeader = {
  header: {
    /* ───── Layout admin (shell) ───── */
    ariaHeader: "En-tête de l’interface d’administration",
    skipToContent: "Aller au contenu principal",
    brand: "Compoz Studio",
    comingSoon: "Bientôt",

    /* ───── Réglages Header (site) ───── */
    title: "En-tête du site",
    desc: "Active ou désactive les éléments d’identité et ajuste le comportement de l’en-tête.",

    fields: {
      showLogo: {
        label: "Afficher le logo",
        help: "Affiche le logo défini dans Identité si disponible.",
      },
      showTitle: {
        label: "Afficher le titre",
        help: "Affiche le titre défini dans Identité.",
      },
      sticky: {
        label: "Header collant",
        help: "Reste visible en haut de page lors du défilement.",
      },
      blur: {
        label: "Flou d’arrière-plan",
        help: "Ajoute un effet de flou si le navigateur le supporte.",
      },
      swapPrimaryAndSocial: {
        label: "Inverser navigation ↔ réseaux sociaux",
        help: "Permute l’ordre des zones (menu principal d’un côté, social de l’autre).",
      },
    },

    // Warnings (non-bloquants) — affichés en tête de section si présents
    hints: {
      title: "Attention",
      noBranding:
        "Ni logo ni titre ne sont affichés. L’en-tête peut paraître vide.",
      swapHasNoEffect:
        "L’inversion n’aura d’effet que si le menu principal et les liens sociaux sont configurés.",
    },

    // Confirmation (pattern homogène avec menus/social)
    confirm: {
      warn: {
        title: "Attention : avertissements détectés",
        desc: "Vous pouvez continuer, mais cela peut entraîner un comportement inattendu :",
      },
    },

    errors: {
      form: {
        invalid: "Le formulaire contient des erreurs.",
      },
    },
  },
} as const;

export default frAdminHeader;
