/**
 * @file src/i18n/locales/admin/fr/pages.ts
 * @intro i18n — Admin / Pages (FR)
 */

const frAdminPages = {
  pages: {
    create: {
      title: "Créer une page",
    },

    edit: {
      title: "Modifier « {{page}} »",
    },

    list: {
      title: "Pages",
      empty: "Aucune page pour l’instant.",
    },

    form: {
      title: {
        label: "Titre",
        help: "Titre court et clair.",
        nearLimit: "Plus que {{n}} caractères.",
        placeholder: {
          create: "Ex. « À propos »",
          edit: "Modifier le titre…",
        },
      },

      slug: {
        label: "Slug",
        help: "Chemin d’URL en kebab-case.",
        helpEmptyWillBeDerived:
          "Laissez vide pour le dériver automatiquement depuis le titre.",
        helpNotNormalized:
          "Le slug sera normalisé (kebab-case) lors de l’enregistrement.",
        title: "Doit être un slug valide (kebab-case).",
        placeholder: {
          create: "Ex. a-propos",
          edit: "Modifier le slug…",
        },
      },

      actions: {
        create: "Créer la page",
        creating: "Création…",
        save: "Enregistrer",
        saving: "Enregistrement…",
        cancel: "Annuler",
      },
    },

    hints: {
      title: "Attention",
    },

    warnings: {
      slugEmptyWillBeDerived:
        "Le slug est vide : il sera dérivé automatiquement du titre.",
      slugNotNormalized:
        "Le slug saisi n’est pas normalisé (kebab-case) et sera ajusté.",
      titleLooksThin: "Le titre semble très court.",
    },

    confirm: {
      warn: {
        title: "Avertissements détectés",
        desc: "Vous pouvez continuer, mais cela peut entraîner un comportement inattendu :",
      },
    },

    errors: {
      form: {
        invalid: "Le formulaire contient des erreurs.",
      },
      title: {
        required: "Le titre est requis.",
        tooShort: "Le titre est trop court.",
        tooLong: "Le titre est trop long.",
      },
      slug: {
        format: "Le slug n’est pas valide.",
        reserved: "Ce slug est réservé.",
        duplicate: "Ce slug est déjà utilisé.",
      },
    },

    actions: {
      editMeta: {
        title: "Modifier les métadonnées",
        button: "Métadonnées",
      },
      editContent: {
        title: "Modifier le contenu",
        button: "Contenu",
      },
      updating: "Mise à jour…",
      // delete/deleting restent dans admin.common.actions
    },
  },
} as const;

export default frAdminPages;
