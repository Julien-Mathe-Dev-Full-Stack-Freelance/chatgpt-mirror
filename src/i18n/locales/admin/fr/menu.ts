/**
 * @file src/i18n/locales/admin/fr/menu.ts
 * @intro i18n — Admin / Menus (principal + légal)
 */

const frAdminMenu = {
  menu: {
    primary: {
      title: "Menu principal",
      desc: "Configure la navigation principale. Les éléments peuvent avoir des enfants (un seul niveau).",
      children: "Enfants",
    },

    legal: {
      title: "Menu légal",
      desc: "Configure le menu légal (mentions légales, cookies, etc.).",
    },

    badges: {
      group: "Groupe",
      external: "Externe",
      internal: "Interne",
      ariaLabel: "Type de lien : {{type}}",
    },

    errors: {
      form: {
        invalid: "Le formulaire contient des erreurs.",
      },
      item: {
        label: { required: "Élément #{{index}} : libellé manquant." },
        href: { required: "Élément #{{index}} : lien manquant." },
      },
      child: {
        label: {
          required:
            "Élément #{{parent}} › enfant #{{child}} : libellé manquant.",
        },
        href: {
          required: "Élément #{{parent}} › enfant #{{child}} : lien manquant.",
        },
      },
    },

    confirm: {
      warn: {
        title: "Attention : avertissements détectés",
        desc: "Vous pouvez continuer, mais cela peut entraîner un comportement inattendu :",
      },
    },

    hints: {
      title: "Attention",
      dupLabelsTop: "Évite les libellés dupliqués au niveau principal.",
      dupLinksTop: "Évite les liens dupliqués au niveau principal.",
      dupLabelsChildren:
        "Les enfants d’un même groupe doivent avoir des libellés uniques.",
      dupLinksChildren:
        "Évite les liens dupliqués parmi les enfants d’un même groupe.",
      externalNoNewTab:
        "Certains liens externes n’ouvrent pas dans un nouvel onglet.",
      primaryMenuEmpty: "Il est conseillé d’avoir un menu principal.",
      legalMenuEmpty: "Il est conseillé d’avoir un menu pour les liens légaux.",
      externalPrefixOnly: "Certains liens externes n’ont pas de cible.",
    },

    // Placeholders
    placeholder: {
      label: "Nouvel élément de menu",
      link: "https://… ou /chemin",
    },

    // Link type
    linkType: {
      arialabel: "Type de lien",
      external: "Externe",
      help: "Les liens externes ouvrent dans un nouvel onglet du navigateur.",
    },

    // Champs
    label: "Libellé",
    link: "Lien",

    newTab: {
      label: "Ouvrir dans un nouvel onglet",
      help: "Ouvre le lien dans un onglet du navigateur.",
    },

    // Actions
    actions: {
      moveUp: "Monter",
      moveDown: "Descendre",
      delete: "Supprimer",
      add: "Ajouter un élément",
      addChild: "Ajouter un enfant",
    },

    // États vides
    empty: "Aucun élément de menu.",

    children: {
      empty: "Aucun enfant pour le moment.",
    },

    // Aperçu
    preview: {
      label: "Aperçu",
      empty: "Aucun élément à prévisualiser.",
      toggle: "Basculer l’aperçu",
    },

    // Seeds
    seed: {
      label: {
        home: "Accueil",
        mentions: "Mentions légales",
        cookies: "Cookies",
      },
      link: {
        mentions: "/mentions-legales",
        cookies: "/politique-cookies",
      },
    },
  },
} as const;

export default frAdminMenu;
