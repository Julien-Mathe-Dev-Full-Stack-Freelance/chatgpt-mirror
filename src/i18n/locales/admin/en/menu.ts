/**
 * @file src/i18n/locales/admin/en/menu.ts
 * @intro i18n — Admin / Menus (primary + legal)
 */

const enAdminMenu = {
  menu: {
    primary: {
      title: "Primary menu",
      desc: "Configure the main navigation. Items can have children (one level).",
      children: "Children",
    },

    legal: {
      title: "Legal menu",
      desc: "Configure the legal menu (legal notices, cookies, etc.).",
    },

    badges: {
      group: "Group",
      external: "External",
      internal: "Internal",
      ariaLabel: "Link type: {{type}}",
    },

    errors: {
      form: {
        invalid: "The form contains errors.",
      },
      item: {
        label: { required: "Item #{{index}}: label is required." },
        href: { required: "Item #{{index}}: link is required." },
      },
      child: {
        label: {
          required: "Item #{{parent}} › child #{{child}}: label is required.",
        },
        href: {
          required: "Item #{{parent}} › child #{{child}}: link is required.",
        },
      },
    },

    confirm: {
      warn: {
        title: "Warning: issues detected",
        desc: "You can continue, but this may cause unexpected behavior:",
      },
    },

    hints: {
      title: "Heads up",
      dupLabelsTop: "Avoid duplicate labels at the top level.",
      dupLinksTop: "Avoid duplicate links at the top level.",
      dupLabelsChildren:
        "Children in the same group should have unique labels.",
      dupLinksChildren:
        "Avoid duplicate links among children in the same group.",
      externalNoNewTab: "Some external links don’t open in a new tab.",
      primaryMenuEmpty: "It’s recommended to have a primary menu.",
      legalMenuEmpty: "It’s recommended to have a legal menu.",
      externalPrefixOnly: "Some external links don’t have a target.",
    },

    // Placeholders
    placeholder: {
      label: "New menu item",
      link: "https://… or /path",
    },

    // Link type
    linkType: {
      arialabel: "Link type",
      external: "External",
      help: "External links open in a new browser tab.",
    },

    // Fields
    label: "Label",
    link: "Link",

    newTab: {
      label: "Open in a new tab",
      help: "Opens the link in a new browser tab.",
    },

    // Actions
    actions: {
      moveUp: "Move up",
      moveDown: "Move down",
      delete: "Delete",
      add: "Add item",
      addChild: "Add child",
    },

    // Empty states
    empty: "No menu items.",

    children: {
      empty: "No children yet.",
    },

    // Preview
    preview: {
      label: "Preview",
      empty: "Nothing to preview.",
      toggle: "Toggle preview",
    },

    // Seeds
    seed: {
      label: {
        home: "Home",
        mentions: "Legal notice",
        cookies: "Cookies",
      },
      link: {
        mentions: "/legal-mentions",
        cookies: "/cookies",
      },
    },
  },
} as const;

export default enAdminMenu;
