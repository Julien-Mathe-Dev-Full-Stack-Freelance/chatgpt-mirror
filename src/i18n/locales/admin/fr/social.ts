/**
 * @file src/i18n/locales/admin/fr/social.ts
 * @intro i18n — Admin / Réseaux sociaux
 */

const frAdminSocial = {
  social: {
    title: "Réseaux sociaux",
    desc: "Ajoute des liens vers tes profils sociaux ou ton e-mail.",

    // Warnings (non-bloquants) — même logique que menu.hints
    hints: {
      title: "Attention",
      socialEmpty: "Il est conseillé d’ajouter au moins un lien social.",
      dupKinds: "Évite d’ajouter deux fois la même plateforme.",
      dupLinks: "Évite d’ajouter deux fois le même lien.",
      emailPrefixOnly:
        "Certains liens e-mail sont incomplets (seulement « mailto: »).",
      urlPrefixOnly:
        "Certains liens web sont incomplets (seulement « https:// »).",
    },

    // Confirmation si warnings — même structure que menu.confirm.warn
    confirm: {
      warn: {
        title: "Attention : avertissements détectés",
        desc: "Tu peux continuer, mais cela peut entraîner un comportement inattendu :",
      },
    },

    // Erreurs génériques (toast), comme menu.errors.form.invalid
    errors: {
      form: {
        invalid: "Le formulaire contient des erreurs.",
      },
    },

    // Libellés/placeholder/help — calqués sur le style de menu.ts (flat + placeholder/help)
    platform: "Plateforme",
    platformPlaceholder: "Choisir une plateforme…",

    link: "Lien",
    placeholder: {
      link: {
        url: "https://…",
        email: "mailto:contact@exemple.com",
      },
    },
    help: {
      link: {
        url: "Entre une URL absolue (http ou https).",
        email: "Utilise un lien « mailto:adresse@domaine.tld ».",
      },
    },

    // Actions — même naming que menu.actions.*
    actions: {
      moveUp: "Monter",
      moveDown: "Descendre",
      delete: "Supprimer",
      add: "Ajouter un lien social",
    },

    // État vide — comme menu.empty
    empty: "Aucun lien social.",

    kind: {
      website: "Site web",
      email: "E-mail",
      behance: "Behance",
      dribbble: "Dribbble",
      facebook: "Facebook",
      github: "GitHub",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      soundcloud: "SoundCloud",
      spotify: "Spotify",
      tiktok: "TikTok",
      x: "X (Twitter)",
      youtube: "YouTube",
    },
  },
} as const;

export default frAdminSocial;
