/**
 * @file src/i18n/locales/admin/en/identity.ts
 * @intro i18n — Identity of the site
 */

const enAdminIdentity = {
  identity: {
    title: "Site identity",

    groups: {
      logos: {
        legend: "Logos",
        help: "Prefer an SVG. Provide both light and dark versions.",
      },
      favicons: {
        legend: "Favicons",
        help: "Provide a favicon for light/dark. Ideally .ico, otherwise PNG or SVG.",
      },
    },

    seed: {
      title: "Compoz",
      logo: {
        alt: "Compoz",
      },
    },

    fields: {
      title: {
        label: "Site title",
        placeholder: "e.g. Compoz",
        help: "The title appears in the header and metadata.",
        nearLimit: "{n} characters remaining.",
      },

      tagline: {
        label: "Tagline (optional)",
        placeholder: "e.g. Build your site in minutes",
        help: "A short descriptive phrase (optional).",
        nearLimit: "{n} characters remaining.",
      },

      logoAlt: {
        label: "Logo alt text",
        placeholder: "e.g. Compoz",
        help: "Describes the logo for accessibility.",
        nearLimit: "{n} characters remaining.",
      },

      logoLight: {
        label: "Logo (light)",
        placeholder: "/uploads/…/logo-light.svg",
      },
      logoDark: {
        label: "Logo (dark)",
        placeholder: "/uploads/…/logo-dark.svg",
      },
      logo: {
        help: "SVG recommended. PNG or WebP accepted.",
      },

      faviconLight: {
        label: "Favicon (light)",
        placeholder: "/uploads/…/favicon-light.ico",
      },
      faviconDark: {
        label: "Favicon (dark)",
        placeholder: "/uploads/…/favicon-dark.ico",
      },
      favicon: {
        help: ".ico recommended. PNG or SVG accepted.",
      },
    },

    errors: {
      title: {
        required: "Title is required.",
        tooShort: "Title must be at least {min} characters.",
        tooLong: "Title cannot exceed {max} characters.",
      },
      tagline: {
        tooLong: "Tagline cannot exceed {max} characters.",
      },
      logoAlt: {
        required: "Logo alt text is required.", // EN
      },
      form: {
        invalid: "Some fields are invalid. Please fix them and try again.", // EN
      },
    },

    warnings: {
      logos: {
        missingBoth: "No logo provided (light or dark).",
        missingLight: "Missing the light logo variant.",
        missingDark: "Missing the dark logo variant.",
      },
      favicons: {
        missingBoth: "No favicon set.",
        missingLight: "Missing the light favicon variant.",
        missingDark: "Missing the dark favicon variant.",
      },
    },
  },
} as const;

export default enAdminIdentity;
