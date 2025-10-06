/**
 * @file src/i18n/locales/admin/en/footer.ts
 * @intro i18n — Admin / Footer (layout + site settings)
 *
 * Convention:
 * - Admin layout: flat keys (ariaFooter, ariaLinks, legalMentions, …)
 * - Site settings: groups `title`, `desc`, `seed`, `fields.*`, `hints.*`, `errors.*`
 */

const enAdminFooter = {
  footer: {
    /* ───── Admin layout (shell) ───── */
    ariaFooter: "Administration interface footer",
    ariaLinks: "Legal links",
    legalMentions: "Legal mentions",
    cookies: "Cookies",
    privacy: "Privacy",

    /* ───── Site Footer settings ───── */
    title: "Site footer",
    desc: "Configure the copyright text. The legal menu is always rendered; clear it if you want to hide it.",

    seed: {
      copyright: "All rights reserved",
    },

    fields: {
      showYear: {
        label: "Show year",
        help: "Automatically adds the current year to the copyright.",
      },
      copyright: {
        label: "Copyright text",
        placeholder: "e.g. Compoz — All rights reserved",
        help: "Short line shown at the bottom of the page. The year is appended if enabled.",
      },
    },

    hints: {
      title: "Heads up",
      footerLooksEmpty: "Neither year nor text: the footer may look empty.",
      copyrightEmpty: "It’s recommended to add a copyright line.",
    },

    errors: {
      form: {
        invalid: "The form contains errors.",
      },
    },
  },
} as const;

export default enAdminFooter;
