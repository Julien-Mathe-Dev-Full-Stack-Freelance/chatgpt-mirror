/**
 * @file src/i18n/locales/admin/en/pages.ts
 * @intro i18n — Admin / Pages (EN)
 */

const enAdminPages = {
  pages: {
    create: {
      title: "Create a page",
    },

    edit: {
      title: "Edit “{{page}}”",
    },

    list: {
      title: "Pages",
      empty: "No pages yet.",
    },

    form: {
      title: {
        label: "Title",
        help: "Short, clear title.",
        nearLimit: "{{n}} characters remaining.",
        placeholder: {
          create: "e.g. “About”",
          edit: "Edit title…",
        },
      },

      slug: {
        label: "Slug",
        help: "URL path in kebab-case.",
        helpEmptyWillBeDerived:
          "Leave empty to derive it automatically from the title.",
        helpNotNormalized:
          "The slug isn’t normalized (kebab-case) and will be adjusted on save.",
        title: "Must be a valid kebab-case slug.",
        placeholder: {
          create: "e.g. about-us",
          edit: "Edit slug…",
        },
      },

      actions: {
        create: "Create page",
        creating: "Creating…",
        save: "Save",
        saving: "Saving…",
        cancel: "Cancel",
      },
    },

    hints: {
      title: "Heads up",
    },

    warnings: {
      slugEmptyWillBeDerived:
        "The slug is empty and will be derived from the title.",
      slugNotNormalized:
        "The slug you entered isn’t normalized (kebab-case) and will be adjusted.",
      titleLooksThin: "The title looks very short.",
    },

    confirm: {
      warn: {
        title: "Warnings detected",
        desc: "You may continue, but this could lead to unexpected behavior:",
      },
    },

    errors: {
      form: {
        invalid: "The form contains errors.",
      },
      title: {
        required: "Title is required.",
        tooShort: "Title is too short.",
        tooLong: "Title is too long.",
      },
      slug: {
        format: "Slug is not valid.",
        reserved: "This slug is reserved.",
        duplicate: "This slug is already in use.",
      },
    },

    actions: {
      editMeta: {
        title: "Edit metadata",
        button: "Metadata",
      },
      editContent: {
        title: "Edit content",
        button: "Content",
      },
      updating: "Updating…",
      // delete/deleting live in admin.common.actions
    },
  },
} as const;

export default enAdminPages;
