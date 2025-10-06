/**
 * @file src/i18n/locales/admin/en/header.ts
 * @intro i18n — Admin header (layout shell) + Site Header settings
 * @description
 * Combines:
 *  - Admin layout header labels (shell/navigation a11y).
 *  - Site “Header” settings labels (admin form).
 *
 * Convention:
 *  - Admin layout: flat keys (ariaHeader, skipToContent, brand, …)
 *  - Site settings: groups `title`, `desc`, `fields.*`, `hints.*`, `confirm.*`
 */

const enAdminHeader = {
  header: {
    /* ───── Admin layout (shell) ───── */
    ariaHeader: "Administration interface header",
    skipToContent: "Skip to main content",
    brand: "Compoz Studio",
    comingSoon: "Coming soon",

    /* ───── Site Header settings ───── */
    title: "Site header",
    desc: "Toggle identity elements and adjust header behavior.",

    fields: {
      showLogo: {
        label: "Show logo",
        help: "Displays the logo defined in Identity if available.",
      },
      showTitle: {
        label: "Show title",
        help: "Displays the site title defined in Identity.",
      },
      sticky: {
        label: "Sticky header",
        help: "Stays visible at the top of the page while scrolling.",
      },
      blur: {
        label: "Background blur",
        help: "Adds a backdrop blur when supported by the browser.",
      },
      swapPrimaryAndSocial: {
        label: "Swap navigation ↔ social",
        help: "Switches the order of the zones (main menu on one side, social links on the other).",
      },
    },

    // Non-blocking warnings — shown at the top of the section when relevant
    hints: {
      title: "Heads-up",
      noBranding:
        "Neither logo nor title is displayed. The header may look empty.",
      swapHasNoEffect:
        "Swapping will only have an effect if both the main menu and social links are configured.",
    },

    // Confirmation (homogeneous with menus/social)
    confirm: {
      warn: {
        title: "Heads-up: warnings detected",
        desc: "You can proceed, but it may lead to unexpected behavior:",
      },
    },

    errors: {
      form: {
        invalid: "The form contains errors.",
      },
    },
  },
} as const;

export default enAdminHeader;
