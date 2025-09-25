# Inventaire des fichiers `src`

Ce registre recense tous les fichiers actuellement présents dans `src/` afin de suivre leur prise en compte dans la documentation technique. Mettre à jour la colonne **Statut** à mesure que chaque fichier est analysé ou documenté, et utiliser la colonne **Notes** pour signaler les points d'attention ou les suivis à traiter.

## Ordre de priorisation pour la documentation

1. Domaine fonctionnel (`src/core/domain`)
2. Validation & utilitaires transverses (`src/schemas`, `src/lib`)
3. Infrastructure & présentation (`src/infrastructure`, `src/components`, `src/constants`, `src/hooks`, `src/app`)
4. Internationalisation (`src/i18n`)

## 1. Domaine fonctionnel – `src/core/domain`

### 1.1 Entités, constantes et utilitaires

| Chemin Statut Notes |
| ------------------- |

`src/core/domain/blocks/constants.ts`
`src/core/domain/blocks/model.ts`
`src/core/domain/constants/common.ts`
`src/core/domain/constants/layout.ts`
`src/core/domain/constants/limits.ts`
`src/core/domain/constants/theme.ts`
`src/core/domain/constants/urls.ts`
`src/core/domain/constants/web.ts`
`src/core/domain/errors/codes.ts`
`src/core/domain/errors/domain-error.ts`
`src/core/domain/errors/error-adapter.ts`
`src/core/domain/errors/issue-types.ts`
`src/core/domain/ids/generator.ts`
`src/core/domain/ids/schema.ts`
`src/core/domain/ids/tools.ts`

---

`src/core/domain/pages/defaults/page.ts`
`src/core/domain/pages/dto.ts`
`src/core/domain/pages/entities/page.ts`
`src/core/domain/pages/ports/pages-repository.ts`
`src/core/domain/pages/use-cases/create-page.errors.ts`
`src/core/domain/pages/use-cases/create-page.ts`
`src/core/domain/pages/use-cases/create-page.types.ts`
`src/core/domain/pages/use-cases/delete-page.errors.ts`
`src/core/domain/pages/use-cases/delete-page.ts`
`src/core/domain/pages/use-cases/delete-page.types.ts`
`src/core/domain/pages/use-cases/update-page.errors.ts`
`src/core/domain/pages/use-cases/update-page.ts`
`src/core/domain/pages/use-cases/update-page.types.ts`
`src/core/domain/pages/validators/slugs.ts`
`src/core/domain/site/defaults/admin.ts`
`src/core/domain/site/defaults/footer.ts`
`src/core/domain/site/defaults/header.ts`
`src/core/domain/site/defaults/identity.ts`
`src/core/domain/site/defaults/legal-menu.ts`
`src/core/domain/site/defaults/primary-menu.ts`
`src/core/domain/site/defaults/seo.ts`
`src/core/domain/site/defaults/site-index.ts`
`src/core/domain/site/defaults/site-settings.ts`
`src/core/domain/site/defaults/social.ts`
`src/core/domain/site/defaults/theme.ts`
`src/core/domain/site/dto.ts`
`src/core/domain/site/entities/admin.ts`
`src/core/domain/site/entities/footer.ts`
`src/core/domain/site/entities/header.ts`
`src/core/domain/site/entities/identity.ts`
`src/core/domain/site/entities/index.ts`
`src/core/domain/site/entities/legal-menu.ts`
`src/core/domain/site/entities/primary-menu.ts`
`src/core/domain/site/entities/seo.ts`
`src/core/domain/site/entities/site-index.ts`
`src/core/domain/site/entities/site-settings.ts`
`src/core/domain/site/entities/social.ts`
`src/core/domain/site/entities/theme.ts`
`src/core/domain/site/index/actions.ts`
`src/core/domain/site/index/helpers.ts`
`src/core/domain/site/index/validators.ts`
`src/core/domain/site/ports/site-repository.ts`
`src/core/domain/site/seo/constants.ts`
`src/core/domain/site/seo/validators.ts`
`src/core/domain/site/social/constants.ts`
`src/core/domain/site/social/validator.ts`
`src/core/domain/site/use-cases/admin/update-admin-settings.errors.ts`
`src/core/domain/site/use-cases/admin/update-admin-settings.ts`
`src/core/domain/site/use-cases/admin/update-admin-settings.types.ts`
`src/core/domain/site/use-cases/footer/update-footer-settings.errors.ts`
`src/core/domain/site/use-cases/footer/update-footer-settings.ts`
`src/core/domain/site/use-cases/footer/update-footer-settings.types.ts`
`src/core/domain/site/use-cases/header/update-header-settings.errors.ts`
`src/core/domain/site/use-cases/header/update-header-settings.ts`
`src/core/domain/site/use-cases/header/update-header-settings.types.ts`
`src/core/domain/site/use-cases/identity/update-identity-settings.errors.ts`
`src/core/domain/site/use-cases/identity/update-identity-settings.ts`
`src/core/domain/site/use-cases/identity/update-identity-settings.types.ts`
`src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.errors.ts`
`src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.ts`
`src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.types.ts`
`src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.errors.ts`
`src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.ts`
`src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.types.ts`
`src/core/domain/site/use-cases/publish/publish-site.errors.ts`
`src/core/domain/site/use-cases/publish/publish-site.ts`
`src/core/domain/site/use-cases/publish/publish-site.types.ts`
`src/core/domain/site/use-cases/seo/update-seo-settings.errors.ts`
`src/core/domain/site/use-cases/seo/update-seo-settings.ts`
`src/core/domain/site/use-cases/seo/update-seo-settings.types.ts`
`src/core/domain/site/use-cases/site-index/update-site-index.errors.ts`
`src/core/domain/site/use-cases/site-index/update-site-index.ts`
`src/core/domain/site/use-cases/site-index/update-site-index.types.ts`
`src/core/domain/site/use-cases/social/update-social-settings.errors.ts`
`src/core/domain/site/use-cases/social/update-social-settings.ts`
`src/core/domain/site/use-cases/social/update-social-settings.types.ts`
`src/core/domain/site/use-cases/theme/update-theme-settings.errors.ts`
`src/core/domain/site/use-cases/theme/update-theme-settings.ts`
`src/core/domain/site/use-cases/theme/update-theme-settings.types.ts`
`src/core/domain/site/validators/identity.ts`
`src/core/domain/site/validators/legal-menu.ts`
`src/core/domain/site/validators/primary-menu.ts`
`src/core/domain/site/validators/publish.ts`
`src/core/domain/slug/constants.ts`
`src/core/domain/slug/utils.ts`
`src/core/domain/urls/compare.ts`
`src/core/domain/urls/href.ts`
`src/core/domain/urls/mailto.ts`
`src/core/domain/utils/clock.ts`
`src/core/domain/utils/deep-freeze.ts`

## 2. Validation et utilitaires transverses

### 2.1 Schémas de validation – `src/schemas`

| Chemin Statut Notes |
| ------------------- |

`src/schemas/blocks/blocks.ts`
`src/schemas/builders.ts`
`src/schemas/date.ts`
`src/schemas/pages/page-intents.ts`
`src/schemas/pages/page.ts`
`src/schemas/routes/params.ts`
`src/schemas/setup-zod.ts`
`src/schemas/site/admin/admin-intents.ts`
`src/schemas/site/admin/admin.ts`
`src/schemas/site/common.ts`
`src/schemas/site/footer/footer-intents.ts`
`src/schemas/site/footer/footer.ts`
`src/schemas/site/header/header-intents.ts`
`src/schemas/site/header/header.ts`
`src/schemas/site/identity/identity-intents.ts`
`src/schemas/site/identity/identity.ts`
`src/schemas/site/legal-menu/legal-menu-intents.ts`
`src/schemas/site/legal-menu/legal-menu.ts`
`src/schemas/site/primary-menu/primary-menu-intents.ts`
`src/schemas/site/primary-menu/primary-menu.ts`
`src/schemas/site/publish/publish-intents.ts`
`src/schemas/site/publish/publish.ts`
`src/schemas/site/seo/seo-intents.ts`
`src/schemas/site/seo/seo.ts`
`src/schemas/site/site-index.ts`
`src/schemas/site/social/social-intents.ts`
`src/schemas/site/social/social.ts`
`src/schemas/site/theme/theme-intents.ts`
`src/schemas/site/theme/theme.ts`

### 2.2 Bibliothèques partagées – `src/lib`

| Chemin Statut Notes |
| ------------------- |

`src/lib/abortError.ts`
`src/lib/api/handle-route.ts`
`src/lib/api/responses.ts`
`src/lib/api/urls.ts`
`src/lib/cn.ts`
`src/lib/diff.ts`
`src/lib/equality.ts`
`src/lib/guards.ts`
`src/lib/http/api-fetch.ts`
`src/lib/http/read-json.ts`
`src/lib/http/validation.ts`
`src/lib/log.ts`
`src/lib/merge.ts`
`src/lib/normalize.ts`
`src/lib/notify-presets.ts`
`src/lib/notify.ts`
`src/lib/patch.ts`
`src/lib/public/content.ts`
`src/lib/ui/footer-preview-classes.ts`
`src/lib/ui/header-preview-classes.ts`
`src/lib/ui/social-preview-helpers.ts`
`src/lib/zod-bootstrap.ts`

## 3. Infrastructure et présentation

### 3.1 Adapteurs & services – `src/infrastructure`

| Chemin Statut Notes |
| ------------------- |

`src/infrastructure/constants/endpoints.ts`
`src/infrastructure/http/admin/pages.client.ts`
`src/infrastructure/http/admin/site-settings.client.ts`
`src/infrastructure/http/admin/site.client.ts`
`src/infrastructure/http/shared/_internal.ts`
`src/infrastructure/http/shared/api-error.ts`
`src/infrastructure/pages/file-system-pages-repository.ts`
`src/infrastructure/pages/in-memory-pages-repository.ts`
`src/infrastructure/pages/index.ts`
`src/infrastructure/site/file-system-site-repository.ts`
`src/infrastructure/site/in-memory-site-repository.ts`
`src/infrastructure/site/index.ts`
`src/infrastructure/ui/atoms.ts`
`src/infrastructure/ui/container.ts`
`src/infrastructure/ui/patterns.ts`
`src/infrastructure/ui/runtime.ts`
`src/infrastructure/ui/size.ts`
`src/infrastructure/ui/theme-apply.ts`
`src/infrastructure/ui/theme.ts`
`src/infrastructure/utils/errors.ts`
`src/infrastructure/utils/fs.ts`

### 3.2 Composants UI – `src/components`

| Chemin Statut Notes |
| ------------------- |

`src/components/admin/atoms/Heading.tsx`
`src/components/admin/layouts/Footer.tsx`
`src/components/admin/layouts/FormGrid.tsx`
`src/components/admin/layouts/Header.tsx`
`src/components/admin/molecules/ActionsBar.tsx`
`src/components/admin/molecules/EmptyHint.tsx`
`src/components/admin/molecules/MenuFieldsItem.tsx`
`src/components/admin/molecules/PageListItem.tsx`
`src/components/admin/molecules/SocialFieldsItem.tsx`
`src/components/admin/molecules/TabBar.tsx`
`src/components/admin/molecules/TabPanel.tsx`
`src/components/admin/molecules/cards/CardBox.tsx`
`src/components/admin/molecules/cards/ChecklistCard.tsx`
`src/components/admin/molecules/cards/StatCard.tsx`
`src/components/admin/molecules/cards/skeletons/CardBoxSkeleton.tsx`
`src/components/admin/molecules/cards/skeletons/ChecklistCardSkeleton.tsx`
`src/components/admin/molecules/cards/skeletons/StatCardSkeleton.tsx`
`src/components/admin/molecules/fields/InputField.tsx`
`src/components/admin/molecules/fields/SelectField.tsx`
`src/components/admin/molecules/fields/SwitchField.tsx`
`src/components/admin/molecules/fields/TextareaField.tsx`
`src/components/admin/molecules/fields/skeletons/InputFieldSkeleton.tsx`
`src/components/admin/molecules/fields/skeletons/SelectFieldSkeleton.tsx`
`src/components/admin/molecules/fields/skeletons/SwitchFieldSkeleton.tsx`
`src/components/admin/molecules/fields/skeletons/TextareaFieldSkeleton.tsx`
`src/components/admin/molecules/panels/FieldPanel.tsx`
`src/components/admin/molecules/panels/PreviewPanel.tsx`
`src/components/admin/molecules/skeletons/ActionBarSkeleton.tsx`
`src/components/admin/molecules/skeletons/MenuFieldsItemSkeleton.tsx`
`src/components/admin/molecules/skeletons/PageListItemSkeleton.tsx`
`src/components/admin/molecules/skeletons/SocialFieldsItemSkeleton.tsx`
`src/components/admin/organisms/forms/FooterForm.tsx`
`src/components/admin/organisms/forms/HeaderForm.tsx`
`src/components/admin/organisms/forms/IdentityForm.tsx`
`src/components/admin/organisms/forms/LegalMenuForm.tsx`
`src/components/admin/organisms/forms/PageForm.tsx`
`src/components/admin/organisms/forms/PrimaryMenuForm.tsx`
`src/components/admin/organisms/forms/SeoForm.tsx`
`src/components/admin/organisms/forms/SocialForm.tsx`
`src/components/admin/organisms/forms/ThemeForm.tsx`
`src/components/admin/pages/Dashboard.tsx`
`src/components/admin/pages/tabs/BlocksTab.tsx`
`src/components/admin/pages/tabs/FooterTab.tsx`
`src/components/admin/pages/tabs/HeaderTab.tsx`
`src/components/admin/pages/tabs/IdentityTab.tsx`
`src/components/admin/pages/tabs/MenuTab.tsx`
`src/components/admin/pages/tabs/OverviewTab.tsx`
`src/components/admin/pages/tabs/PagesTab.tsx`
`src/components/admin/pages/tabs/SeoTab.tsx`
`src/components/admin/pages/tabs/SocialTab.tsx`
`src/components/admin/pages/tabs/index.ts`
`src/components/admin/previews/FooterPreview.tsx`
`src/components/admin/previews/HeaderPreview.tsx`
`src/components/admin/previews/IdentityLogoPreview.tsx`
`src/components/admin/previews/MenuPreview.tsx`
`src/components/admin/previews/SiteThemePreview.tsx`
`src/components/admin/previews/SocialPreview.tsx`
`src/components/admin/sections/BlocksSection.tsx`
`src/components/admin/sections/FooterSection.tsx`
`src/components/admin/sections/HeaderSection.tsx`
`src/components/admin/sections/IdentitySection.tsx`
`src/components/admin/sections/LegalMenuSection.tsx`
`src/components/admin/sections/OverviewSection.tsx`
`src/components/admin/sections/OverviewThemeSection.tsx`
`src/components/admin/sections/PageEditSection.tsx`
`src/components/admin/sections/PagesListSection.tsx`
`src/components/admin/sections/PrimaryMenuSection.tsx`
`src/components/admin/sections/SeoSection.tsx`
`src/components/admin/sections/SocialSection.tsx`
`src/components/admin/sections/skeletons/LegalMenuSectionSkeleton.tsx`
`src/components/admin/sections/skeletons/PrimaryMenuSectionSkeleton.tsx`
`src/components/admin/theme/PaletteSelect.tsx`
`src/components/admin/theme/ThemeProvider.tsx`
`src/components/admin/theme/ThemeToggle.tsx`
`src/components/public-site/layouts/PublicFooter.tsx`
`src/components/public-site/layouts/PublicHeader.tsx`
`src/components/shared/theme/PublicThemeScope.tsx`
`src/components/ui/button.tsx`
`src/components/ui/card.tsx`
`src/components/ui/input.tsx`
`src/components/ui/label.tsx`
`src/components/ui/select.tsx`
`src/components/ui/separator.tsx`
`src/components/ui/skeleton.tsx`
`src/components/ui/sonner.tsx`
`src/components/ui/switch.tsx`
`src/components/ui/tabs.tsx`
`src/components/ui/textarea.tsx`

### 3.3 Constantes d’interface – `src/constants`

| Chemin Statut Notes |
| ------------------- |

`src/constants/admin/options.ts`
`src/constants/admin/presets.ts`
`src/constants/shared/entities.ts`

### 3.4 Hooks client – `src/hooks`

| Chemin Statut Notes |
| ------------------- |

`src/hooks/_shared/list/list.ts`
`src/hooks/_shared/list/useArrayField.ts`
`src/hooks/_shared/list/useObjectArrayField.ts`
`src/hooks/_shared/usePreviewResource.ts`
`src/hooks/_shared/useSettingsResource.ts`
`src/hooks/_shared/utils.ts`
`src/hooks/admin/pages/useCreatePage.ts`
`src/hooks/admin/pages/useDeletePage.ts`
`src/hooks/admin/pages/useReadPage.ts`
`src/hooks/admin/pages/useUpdatePage.ts`
`src/hooks/admin/site/footer/useFooterPreview.ts`
`src/hooks/admin/site/footer/useFooterSettings.ts`
`src/hooks/admin/site/header/useHeaderPreview.ts`
`src/hooks/admin/site/header/useHeaderSettings.ts`
`src/hooks/admin/site/identity/useIdentityLogoPreview.ts`
`src/hooks/admin/site/identity/useIdentitySettings.ts`
`src/hooks/admin/site/legal-menu/useLegalMenuPreview.ts`
`src/hooks/admin/site/legal-menu/useLegalMenuSettings.ts`
`src/hooks/admin/site/primary-menu/usePrimaryMenuPreview.ts`
`src/hooks/admin/site/primary-menu/usePrimaryMenuSettings.ts`
`src/hooks/admin/site/seo/useSeoSettings.ts`
`src/hooks/admin/site/social/useSocialPreview.ts`
`src/hooks/admin/site/social/useSocialSettings.ts`
`src/hooks/admin/site/theme/usePalette.ts`
`src/hooks/admin/site/theme/useThemePreview.ts`
`src/hooks/admin/site/theme/useThemeSettings.ts`
`src/hooks/admin/site/useSiteIndex.ts`

### 3.5 Routes & mises en page – `src/app`

| Chemin Statut Notes |
| ------------------- |

`src/app/[slug]/page.tsx`
`src/app/admin/error.tsx`
`src/app/admin/layout.tsx`
`src/app/admin/page.tsx`
`src/app/admin/pages/[slug]/page.tsx`
`src/app/api/admin/pages/[slug]/route.ts`
`src/app/api/admin/pages/route.ts`
`src/app/api/admin/site/admin/route.ts`
`src/app/api/admin/site/footer/route.ts`
`src/app/api/admin/site/header/route.ts`
`src/app/api/admin/site/identity/route.ts`
`src/app/api/admin/site/legal-menu/route.ts`
`src/app/api/admin/site/primary-menu/route.ts`
`src/app/api/admin/site/publish/route.ts`
`src/app/api/admin/site/seo/route.ts`
`src/app/api/admin/site/social/route.ts`
`src/app/api/admin/site/theme/route.ts`
`src/app/favicon.ico`
`src/app/globals.css`
`src/app/layout.tsx`
`src/app/page.tsx`

## 4. Internationalisation – `src/i18n`

### 4.1 Fichiers i18n

| Chemin Statut Notes |
| ------------------- |

`src/i18n/LanguageSwitcher.tsx`
`src/i18n/context.tsx`
`src/i18n/default.ts`
`src/i18n/factories/admin/actions.ts`
`src/i18n/factories/admin/blocks.ts`
`src/i18n/factories/admin/content.ts`
`src/i18n/factories/admin/entities.ts`
`src/i18n/factories/admin/help.ts`
`src/i18n/factories/admin/identity-defaults.ts`
`src/i18n/factories/admin/index.ts`
`src/i18n/factories/admin/layoutOptions.ts`
`src/i18n/factories/admin/legal-menu-defaults.ts`
`src/i18n/factories/admin/options.ts`
`src/i18n/factories/admin/primary-menu-defaults.ts`
`src/i18n/factories/admin/seo-defaults.ts`
`src/i18n/factories/admin/seo.ts`
`src/i18n/factories/admin/social.ts`
`src/i18n/factories/admin/tabs.ts`
`src/i18n/index.ts`
`src/i18n/locales/en.ts`
`src/i18n/locales/errors/en.ts`
`src/i18n/locales/errors/fr.ts`
`src/i18n/locales/fr.ts`
`src/i18n/locales/index.ts`
`src/i18n/meta.ts`
`src/i18n/namespaces.ts`
`src/i18n/server.ts`
`src/i18n/types.ts`
`src/i18n/useErrorI18n.ts`
