/**
 * @file src/i18n/locales/admin/en/common.ts
 * @intro i18n — admin catalogues (Identity)
 */

const enAdminCommon = {
  actions: {
    loading: "Loading…",
    saving: "Saving…",
    save: "Save",
    reset: "Reset",
    publish: "Publish",
    delete: "Delete",
    cancel: "Cancel",
    upload: "Upload",
    add: "Add",
    continueSave: "Continue and save",
    acknowledge: "I understand the warnings.",
  },

  notify: {
    validation: {
      error: {
        title: "Validation error",
        body: "{detail}",
      },
    },
  },

  fields: {
    select: {
      placeholder: "Select",
    },
  },

  dashboard: {
    title: "Dashboard",
  },

  tabs: {
    overview: "Overview",
    identity: "Identity",
    menu: "Menu",
    primaryMenu: "Primary menu",
    legalMenu: "Legal menu",
    social: "Social",
    header: "Header",
    footer: "Footer",
    pages: "Pages",
    blocks: "Blocks",
    seo: "SEO",
  },
} as const;

export default enAdminCommon;
