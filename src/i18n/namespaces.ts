/**
 * @file src/i18n/namespaces.ts
 * @intro Namespaces i18n pour les clés de l’admin
 */

export const NS_ADMIN = {
  size: "admin.size",
  container: "admin.container",
  theme: { mode: "admin.theme.mode", palette: "admin.theme.palette" },
  tabs: "admin.tabs",
  actions: "admin.actions",
  seo: {
    preview: "admin.seo.preview",
    titleTemplate: "admin.seo.titleTemplate",
    twitterCardType: "admin.seo.twitterCardType",
  },
  layout: {
    maxWidth: "admin.layout.maxWidth",
    spacingY: "admin.layout.spacingY",
    align: "admin.layout.align",
  },
  social: {
    kind: "admin.social.kind",
  },
  entities: "admin.entities",
} as const;
