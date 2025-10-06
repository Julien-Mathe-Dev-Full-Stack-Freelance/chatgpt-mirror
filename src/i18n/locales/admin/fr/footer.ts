/**
 * @file src/i18n/locales/admin/fr/footer.ts
 * @intro i18n — Admin / Footer (layout + réglages du site)
 *
 * Convention :
 * - Layout admin : clés plates (ariaFooter, ariaLinks, legalMentions, …)
 * - Réglages du site : groups `title`, `desc`, `seed`, `fields.*`, `hints.*`, `errors.*`
 */

const frAdminFooter = {
  footer: {
    /* ───── Layout admin (shell) ───── */
    ariaFooter: "Pied de page de l’interface d’administration",
    ariaLinks: "Liens légaux",
    legalMentions: "Mentions légales",
    cookies: "Cookies",
    privacy: "Confidentialité",

    /* ───── Réglages “Site Footer” ───── */
    title: "Pied de page du site",
    desc: "Configure le texte de copyright. Le menu légal est toujours rendu ; vide-le si tu souhaites le masquer.",

    seed: {
      copyright: "Tous droits réservés",
    },

    fields: {
      showYear: {
        label: "Afficher l’année",
        help: "Ajoute automatiquement l’année courante au copyright.",
      },
      copyright: {
        label: "Texte de copyright",
        placeholder: "Ex. Compoz — Tous droits réservés",
        help: "Court texte affiché en bas de page. L’année s’ajoute si l’option est activée.",
      },
    },

    hints: {
      title: "Attention",
      footerLooksEmpty: "Ni année ni texte : le pied de page semblera vide.",
      copyrightEmpty: "Il est recommandé d’ajouter un texte de copyright.",
    },

    errors: {
      form: {
        invalid: "Le formulaire contient des erreurs.",
      },
    },
  },
} as const;

export default frAdminFooter;
