/**
 * @file src/i18n/locales/admin/fr/seo.ts
 * @intro i18n — Admin / SEO
 */

const frAdminSeo = {
  seo: {
    title: "SEO",
    desc: "Configure les métadonnées par défaut, Open Graph et les cartes Twitter.",

    // Libellés/placeholder/aide
    defaultTitle: {
      label: "Titre par défaut",
      placeholder: "Ex. Compoz Studio",
      help: "Utilisé lorsqu’une page n’a pas de titre spécifique.",
    },
    defaultDescription: {
      label: "Description par défaut",
      placeholder: "Une courte description de votre site…",
    },
    titleTemplate: {
      label: "Gabarit de titre",
      placeholder: "%s — Votre marque",
      help: "Utilisez %s comme emplacement du titre de page.",
    },

    // Indexation / URLs
    baseUrl: {
      label: "URL de base",
      help: "URL absolue du site (ex. https://www.exemple.com).",
    },
    canonicalUrl: {
      label: "URL canonique",
      help: "URL canonique par défaut (optionnelle).",
    },
    robots: {
      label: "Robots",
      help: 'Directives robots (ex. "index,follow").',
    },
    structuredData: {
      label: "Données structurées",
      help: "Active le rendu JSON-LD global.",
    },

    twitterCardType: {
      summary: "Résumé",
      summary_large_image: "Résumé (grande image)",
    },

    // Open Graph
    twitter: {
      card: { label: "Type de carte Twitter" },
      site: {
        label: "Handle Twitter du site",
        help: "Commencez par @ (ex. @votrecompte).",
      },
      creator: {
        label: "Handle Twitter de l’auteur",
        help: "Commencez par @ (ex. @auteur).",
      },
    },
    og: {
      image: {
        label: "URL de l’image Open Graph par défaut",
        help: "URL absolue d’une image (1200×630 recommandé).",
      },
      title: {
        label: "Titre Open Graph",
        placeholder: "Ex. Titre pour les partages sociaux",
        help: "Optionnel. Par défaut on utilisera le titre de la page.",
      },
      description: {
        label: "Description Open Graph",
        placeholder: "Texte d’aperçu pour les partages sociaux…",
        help: "Optionnel. Entre 50–160 caractères recommandé.",
      },
      imageAlt: {
        label: "Texte alternatif de l’image",
        placeholder: "Brève description de l’image",
        help: "Pour l’accessibilité. 80–120 caractères recommandé.",
      },
    },

    // Placeholder du select (utilisé par <SelectField/>)
    fields: {
      select: {
        placeholder: "Sélectionner…",
      },
    },

    // Aperçu (style SERP)
    preview: {
      toggle: "Afficher l’aperçu",
      legend:
        "Aperçu de l’apparence potentielle dans les résultats de recherche.",
      sampleTitle: "Titre de page d’exemple",
      sampleBase: "https://exemple.com",
      noDescription: "Aucune description fournie.",
      ogAlt: "Aperçu de l’image Open Graph",
    },

    // Avertissements (non-bloquants)
    hints: {
      title: "Attention",
      description: {
        length:
          "La description par défaut doit contenir entre 50 et 160 caractères.",
      },
      titleTemplate: {
        placeholderMissing:
          "Le gabarit de titre devrait inclure le placeholder %s.",
      },
      robots: {
        noindex:
          "La directive robots contient « noindex ». Vos pages pourraient ne pas être indexées.",
      },
      openGraph: {
        image: {
          missing:
            "Aucune image Open Graph par défaut n’est définie. Les aperçus sociaux risquent d’être pauvres.",
        },
      },
      twitter: {
        site: { missing: "Le handle Twitter « site » est manquant." },
        creator: { missing: "Le handle Twitter « auteur » est manquant." },
      },
    },

    // Confirmation (warnings)
    confirm: {
      warn: {
        title: "Attention : avertissements détectés",
        desc: "Vous pouvez continuer, mais cela peut entraîner un comportement inattendu :",
      },
    },

    // Erreurs (bloquantes)
    errors: {
      form: { invalid: "Le formulaire contient des erreurs." },
      defaultTitle: { required: "Le titre par défaut est requis." },
      defaultDescription: { invalid: "Description par défaut invalide." },
      titleTemplate: { invalid: "Gabarit de titre invalide." },
      baseUrl: { invalid: "URL de base invalide." },
      canonicalUrl: { invalid: "URL canonique invalide." },
      robots: { invalid: "Valeur robots invalide." },
      openGraph: {
        defaultImageUrl: { invalid: "URL d’image Open Graph invalide." },
        title: { tooLong: "Le titre Open Graph est trop long." },
        description: { tooLong: "La description Open Graph est trop longue." },
        imageAlt: { tooLong: "Le texte alternatif de l’image est trop long." },
      },
      twitter: {
        card: { required: "La carte Twitter est requise." },
        site: { invalid: "Handle Twitter « site » invalide." },
        creator: { invalid: "Handle Twitter « auteur » invalide." },
      },
    },
  },
} as const;

export default frAdminSeo;
