/**
 * @file src/i18n/locales/admin/en/social.ts
 * @intro i18n — Admin / Social Links
 */

const enAdminSocial = {
  social: {
    title: "Social Links",
    desc: "Add links to your social profiles or email.",

    // Warnings (non-bloquants) — same logic as menu.hints
    hints: {
      title: "Warning",
      socialEmpty: "It is recommended to add at least one social link.",
      dupKinds: "Avoid adding the same social platform twice.",
      dupLinks: "Avoid adding the same link twice.",
      emailPrefixOnly: "Some email links are incomplete (only « mailto: »).",
      urlPrefixOnly: "Some web links are incomplete (only « https:// »).",
    },

    // Confirmation if warnings — same structure as menu.confirm.warn
    confirm: {
      warn: {
        title: "Warning: detected warnings",
        desc: "You can continue, but this may lead to unexpected behavior:",
      },
    },

    // Generic errors (toast), like menu.errors.form.invalid
    errors: {
      form: {
        invalid: "The form contains errors.",
      },
    },

    // Labels/placeholder/help — extracted from menu.ts (flat + placeholder/help)
    platform: "Platform",
    platformPlaceholder: "Choose a platform…",

    link: "Link",
    placeholder: {
      link: {
        url: "https://…",
        email: "mailto:contact@example.com",
      },
    },
    help: {
      link: {
        url: "Enter an absolute URL (http or https).",
        email: "Use a « mailto:address@domain.tld » link.",
      },
    },

    // Actions — same naming as menu.actions.*
    actions: {
      moveUp: "Move up",
      moveDown: "Move down",
      delete: "Delete",
      add: "Add a link",
    },

    // Empty state — same as menu.empty
    empty: "No social links.",

    kind: {
      website: "Website",
      email: "Email",
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

export default enAdminSocial;
