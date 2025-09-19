# Catalogue i18n UI

Référence partagée des namespaces et clés utilisés par l'UI (admin + public). Complète ce tableau lorsque de nouvelles sections sont ajoutées.

| Namespace         | Description                                               | Fichiers de messages                               | Consommateurs principaux                                   |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| `admin.size`      | Libellés liés aux tailles d'UI (largeur, espacements).    | `src/i18n/locales/fr.ts`, `src/i18n/locales/en.ts` | `@/components/admin/atoms/SizeSelect`, layout admin.       |
| `admin.container` | Classes/labels pour configurer le conteneur.              | `fr.ts` / `en.ts`                                  | `@/components/admin/sections/SiteLayoutSection`.           |
| `admin.theme.*`   | Switcher de thème (mode clair/sombre, palettes).          | `fr.ts` / `en.ts`                                  | `@/components/admin/theme/ThemeProvider`, palette pickers. |
| `admin.tabs`      | Titres des onglets dans l'admin.                          | `fr.ts` / `en.ts`                                  | `@/components/admin/layouts/AdminTabsLayout`.              |
| `admin.actions`   | Boutons génériques (créer, sauvegarder, publier).         | `fr.ts` / `en.ts`                                  | `@/components/admin/molecules/PageActions`, toolbar.       |
| `admin.seo.*`     | Labels liés au SEO (prévisualisation, template de titre). | `fr.ts` / `en.ts`                                  | `@/components/admin/sections/SeoSection`.                  |
| `admin.layout.*`  | Options d'alignement/espacement.                          | `fr.ts` / `en.ts`                                  | `@/components/admin/sections/LayoutSection`.               |
| `admin.social.*`  | Types de réseaux sociaux.                                 | `fr.ts` / `en.ts`                                  | `@/components/admin/sections/SocialSection`.               |
| `admin.entities`  | Libellés génériques (page, site, bloc).                   | `fr.ts` / `en.ts`                                  | Admin global (breadcrumbs, tables).                        |

> Ajouter ici les namespaces publics (`site.*`) et ceux liés aux erreurs lorsque l'UI les consommera.
