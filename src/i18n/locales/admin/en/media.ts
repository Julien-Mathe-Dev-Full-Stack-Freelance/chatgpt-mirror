/**
 * @file i18n — Media (images/videos)
 * @intro i18n — Media (images/videos)
 */

const enAdminMedia = {
  media: {
    actions: {
      chooseFile: "Choose file",
      clear: "Clear",
    },
    preview: {
      label: "Image preview",
      empty: "No image",
    },
    status: {
      uploading: "Uploading…",
    },
    errors: {
      notImage: "The selected file is not an image.",
      uploadFailed: "Upload failed.",
    },
    hints: {
      preferredType: "A different format is recommended.",
    },
  },
} as const;

export default enAdminMedia;
