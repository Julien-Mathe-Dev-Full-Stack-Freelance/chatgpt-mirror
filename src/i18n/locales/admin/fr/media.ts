/**
 * @file i18n — Media (images/videos)
 * @intro i18n — Media (images/videos)
 */

const frAdminMedia = {
  media: {
    actions: {
      chooseFile: "Choisir un fichier",
      clear: "Effacer",
    },
    preview: {
      label: "Aperçu de l’image",
      empty: "Aucun visuel",
    },
    status: {
      uploading: "Transfert en cours…",
    },
    errors: {
      notImage: "Le fichier choisi n’est pas une image.",
      uploadFailed: "Échec de l’upload.",
    },
    hints: {
      preferredType: "Format recommandé différent.",
    },
  },
} as const;

export default frAdminMedia;
