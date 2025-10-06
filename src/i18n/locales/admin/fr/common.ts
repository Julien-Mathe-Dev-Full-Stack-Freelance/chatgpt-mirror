/**
 * @file src/i18n/locales/admin/fr/common.ts
 * @intro i18n — admin catalogues (Identité)
 */

const frAdminCommon = {
  actions: {
    loading: "Chargement…",
    saving: "Enregistrement…",
    save: "Enregistrer",
    reset: "Réinitialiser",
    publish: "Publier",
    delete: "Supprimer",
    cancel: "Annuler",
    upload: "Téléverser",
    add: "Ajouter",
    continueSave: "Continuer et sauvegarder",
    acknowledge: "Je comprends les avertissements.",
  },

  notify: {
    validation: {
      error: {
        title: "Erreur de validation",
        body: "{detail}",
      },
    },
  },

  fields: {
    select: {
      placeholder: "Sélectionner...",
    },
  },

  dashboard: {
    title: "Tableau de bord",
  },

  tabs: {
    overview: "Vue d’ensemble",
    identity: "Identité",
    menu: "Menu",
    primaryMenu: "Menu principal",
    legalMenu: "Menu légal",
    social: "Réseaux sociaux",
    header: "Header",
    footer: "Footer",
    pages: "Pages",
    blocks: "Blocs",
    seo: "SEO",
  },
} as const;

export default frAdminCommon;
