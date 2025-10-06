/**
 * @file src/i18n/locales/admin/en/seo.ts
 * @intro i18n — Admin / SEO
 */

const enAdminSeo = {
  seo: {
    title: "SEO",
    desc: "Configure default metadata, Open Graph and Twitter cards.",

    // Form labels/placeholders/help
    defaultTitle: {
      label: "Default title",
      placeholder: "e.g. Compoz Studio",
      help: "Used when a page has no specific title.",
    },
    defaultDescription: {
      label: "Default description",
      placeholder: "A concise description of your site…",
    },
    titleTemplate: {
      label: "Title template",
      placeholder: "%s — Your brand",
      help: "Use %s as a placeholder for the page title.",
    },

    // Indexing / URLs
    baseUrl: {
      label: "Base URL",
      help: "Absolute site URL (e.g. https://www.example.com).",
    },
    canonicalUrl: {
      label: "Canonical URL",
      help: "Default canonical URL (optional).",
    },
    robots: {
      label: "Robots",
      help: 'Robots directives (e.g. "index,follow").',
    },
    structuredData: {
      label: "Structured data",
      help: "Enable global JSON-LD output.",
    },

    twitterCardType: {
      summary: "Summary",
      summary_large_image: "Summary (large image)",
    },

    twitter: {
      card: { label: "Twitter card type" },
      site: {
        label: "Twitter site handle",
        help: "Start with @ (e.g. @yourbrand).",
      },
      creator: {
        label: "Twitter creator handle",
        help: "Start with @ (e.g. @author).",
      },
    },
    og: {
      image: {
        label: "Open Graph default image URL",
        help: "Absolute URL (1200×630 recommended).",
      },
      title: {
        label: "Open Graph title",
        placeholder: "e.g. Social share title",
        help: "Optional. Falls back to page title.",
      },
      description: {
        label: "Open Graph description",
        placeholder: "Text for social previews…",
        help: "Optional. Aim for 50–160 characters.",
      },
      imageAlt: {
        label: "Image alternative text",
        placeholder: "Short description of the image",
        help: "For accessibility. Aim for 80–120 characters.",
      },
    },

    // Select placeholder (used by <SelectField/>)
    fields: {
      select: {
        placeholder: "Select…",
      },
    },

    // Preview (SERP-like)
    preview: {
      toggle: "Show preview",
      legend: "Preview of how this could appear in search results.",
      sampleTitle: "Sample page title",
      sampleBase: "https://example.com",
      noDescription: "No description provided.",
      ogAlt: "Open Graph image preview",
    },

    // Warnings (non-blocking) — mapped from hook keys
    hints: {
      title: "Heads up",
      description: {
        length:
          "The default description should be between 50 and 160 characters.",
      },
      titleTemplate: {
        placeholderMissing:
          "Your title template should include the %s placeholder.",
      },
      robots: {
        noindex: "Robots contains “noindex”. Your pages might not be indexed.",
      },
      openGraph: {
        image: {
          missing:
            "No default Open Graph image is set. Social previews may look poor.",
        },
      },
      twitter: {
        site: { missing: "Twitter “site” handle is missing." },
        creator: { missing: "Twitter “creator” handle is missing." },
      },
    },

    // Confirmation (warnings)
    confirm: {
      warn: {
        title: "Heads up: warnings detected",
        desc: "You can continue, but it may cause unexpected behavior:",
      },
    },

    // Errors (blocking)
    errors: {
      form: { invalid: "The form contains errors." },
      defaultTitle: { required: "Default title is required." },
      defaultDescription: { invalid: "Invalid default description." },
      titleTemplate: { invalid: "Invalid title template." },
      baseUrl: { invalid: "Invalid base URL." },
      canonicalUrl: { invalid: "Invalid canonical URL." },
      robots: { invalid: "Invalid robots value." },
      openGraph: {
        defaultImageUrl: { invalid: "Invalid Open Graph image URL." },
        title: { tooLong: "Open Graph title is too long." },
        description: { tooLong: "Open Graph description is too long." },
        imageAlt: { tooLong: "Open Graph image alt is too long." },
      },
      twitter: {
        card: { required: "Twitter card is required." },
        site: { invalid: "Invalid Twitter site handle." },
        creator: { invalid: "Invalid Twitter creator handle." },
      },
    },
  },
} as const;

export default enAdminSeo;
