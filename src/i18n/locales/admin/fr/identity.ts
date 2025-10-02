/**
 * @file src/i18n/locales/admin/fr/identity.ts
 * @intro i18n — Identité du site
 */

const frAdminIdentity = {
  identity: {
    title: "Identité du site",

    groups: {
      logos: {
        legend: "Logos",
        help: "Préférez un SVG. Fournissez une version claire et une version sombre.",
      },
      favicons: {
        legend: "Favicons",
        help: "Fournissez un favicon pour clair/sombre. Idéalement en .ico, sinon PNG ou SVG.",
      },
    },

    seed: {
      title: "Compoz",
      logo: {
        alt: "Compoz",
      },
    },

    fields: {
      title: {
        label: "Titre du site",
        placeholder: "Ex. Compoz",
        help: "Le titre apparaît dans l’en-tête et dans les métadonnées.",
        nearLimit: "Il vous reste {n} caractères.",
      },

      tagline: {
        label: "Baseline (optionnelle)",
        placeholder: "Ex. Construisez votre site en quelques minutes",
        help: "Courte phrase descriptive (facultatif).",
        nearLimit: "Il vous reste {n} caractères.",
      },

      logoAlt: {
        label: "Texte alternatif du logo",
        placeholder: "Ex. Compoz",
        help: "Décrit le logo pour l’accessibilité.",
        nearLimit: "Il vous reste {n} caractères.",
      },

      logoLight: {
        label: "Logo (clair)",
        placeholder: "/uploads/…/logo-light.svg",
      },
      logoDark: {
        label: "Logo (sombre)",
        placeholder: "/uploads/…/logo-dark.svg",
      },
      logo: {
        help: "SVG recommandé. PNG ou WebP acceptés.",
      },

      faviconLight: {
        label: "Favicon (clair)",
        placeholder: "/uploads/…/favicon-light.ico",
      },
      faviconDark: {
        label: "Favicon (sombre)",
        placeholder: "/uploads/…/favicon-dark.ico",
      },
      favicon: {
        help: ".ico recommandé. PNG ou SVG acceptés.",
      },
    },

    errors: {
      title: {
        required: "Le titre est requis.",
        tooShort: "Le titre doit contenir au moins {min} caractères.",
        tooLong: "Le titre ne peut pas dépasser {max} caractères.",
      },
      tagline: {
        tooLong: "La baseline ne peut pas dépasser {max} caractères.",
      },
      logoAlt: {
        required: "Le texte alternatif du logo est requis.", // FR
      },
      form: {
        invalid: "Certains champs sont invalides. Corrigez-les puis réessayez.", // FR
      },
    },

    // Réservé pour la suite (logos/favicons, cohérence globale)
    warnings: {
      logos: {
        missingBoth: "Aucun logo fourni (clair ou sombre).",
        missingLight: "La variante de logo clair est manquante.",
        missingDark: "La variante de logo sombre est manquante.",
      },
      favicons: {
        missingBoth: "Aucun favicon défini.",
        missingLight: "La variante de favicon clair est manquante.",
        missingDark: "La variante de favicon sombre est manquante.",
      },
    },
  },
} as const;

export default frAdminIdentity;
