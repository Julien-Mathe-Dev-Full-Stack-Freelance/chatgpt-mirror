# Inventaire des fichiers `src`

Ce registre recense tous les fichiers actuellement présents dans `src/` afin de suivre leur prise en compte dans la documentation technique. Mettre à jour la colonne **Statut** à mesure que chaque fichier est analysé ou documenté, et utiliser la colonne **Notes** pour signaler les points d'attention ou les suivis à traiter.

## Ordre de priorisation pour la documentation

1. Domaine fonctionnel (`src/core/domain`)
2. Validation & utilitaires transverses (`src/schemas`, `src/lib`)
3. Infrastructure & présentation (`src/infrastructure`, `src/components`, `src/constants`, `src/hooks`, `src/app`)
4. Internationalisation (`src/i18n`)

## 1. Domaine fonctionnel – `src/core/domain`

### 1.1 Entités, constantes et utilitaires

| Chemin                                                                               | Statut  | Notes |
| ------------------------------------------------------------------------------------ | ------- | ----- |
| `src/core/domain/blocks/constants.ts`                                                | À faire |       |
| `src/core/domain/blocks/model.ts`                                                    | À faire |       |
| `src/core/domain/constants/common.ts`                                                | À faire |       |
| `src/core/domain/constants/layout.ts`                                                | À faire |       |
| `src/core/domain/constants/limits.ts`                                                | À faire |       |
| `src/core/domain/constants/theme.ts`                                                 | À faire |       |
| `src/core/domain/constants/urls.ts`                                                  | À faire |       |
| `src/core/domain/constants/web.ts`                                                   | À faire |       |
| `src/core/domain/entities/constants.ts`                                              | À faire |       |
| `src/core/domain/errors/codes.ts`                                                    | À faire |       |
| `src/core/domain/errors/domain-error.ts`                                             | À faire |       |
| `src/core/domain/errors/error-adapter.ts`                                            | À faire |       |
| `src/core/domain/errors/issue-types.ts`                                              | À faire |       |
| `src/core/domain/ids/generator.ts`                                                   | À faire |       |
| `src/core/domain/ids/schema.ts`                                                      | À faire |       |
| `src/core/domain/ids/tools.ts`                                                       | À faire |       |
| `src/core/domain/pages/defaults/page.ts`                                             | À faire |       |
| `src/core/domain/pages/dto.ts`                                                       | À faire |       |
| `src/core/domain/pages/entities/page.ts`                                             | À faire |       |
| `src/core/domain/pages/ports/pages-repository.ts`                                    | À faire |       |
| `src/core/domain/pages/use-cases/create-page.errors.ts`                              | À faire |       |
| `src/core/domain/pages/use-cases/create-page.ts`                                     | À faire |       |
| `src/core/domain/pages/use-cases/create-page.types.ts`                               | À faire |       |
| `src/core/domain/pages/use-cases/delete-page.errors.ts`                              | À faire |       |
| `src/core/domain/pages/use-cases/delete-page.ts`                                     | À faire |       |
| `src/core/domain/pages/use-cases/delete-page.types.ts`                               | À faire |       |
| `src/core/domain/pages/use-cases/update-page.errors.ts`                              | À faire |       |
| `src/core/domain/pages/use-cases/update-page.ts`                                     | À faire |       |
| `src/core/domain/pages/use-cases/update-page.types.ts`                               | À faire |       |
| `src/core/domain/pages/validators/slugs.ts`                                          | À faire |       |
| `src/core/domain/site/defaults/admin.ts`                                             | À faire |       |
| `src/core/domain/site/defaults/footer.ts`                                            | À faire |       |
| `src/core/domain/site/defaults/header.ts`                                            | À faire |       |
| `src/core/domain/site/defaults/identity.ts`                                          | À faire |       |
| `src/core/domain/site/defaults/legal-menu.ts`                                        | À faire |       |
| `src/core/domain/site/defaults/primary-menu.ts`                                      | À faire |       |
| `src/core/domain/site/defaults/seo.ts`                                               | À faire |       |
| `src/core/domain/site/defaults/site-index.ts`                                        | À faire |       |
| `src/core/domain/site/defaults/site-settings.ts`                                     | À faire |       |
| `src/core/domain/site/defaults/social.ts`                                            | À faire |       |
| `src/core/domain/site/defaults/theme.ts`                                             | À faire |       |
| `src/core/domain/site/dto.ts`                                                        | À faire |       |
| `src/core/domain/site/entities/admin.ts`                                             | À faire |       |
| `src/core/domain/site/entities/footer.ts`                                            | À faire |       |
| `src/core/domain/site/entities/header.ts`                                            | À faire |       |
| `src/core/domain/site/entities/identity.ts`                                          | À faire |       |
| `src/core/domain/site/entities/index.ts`                                             | À faire |       |
| `src/core/domain/site/entities/legal-menu.ts`                                        | À faire |       |
| `src/core/domain/site/entities/primary-menu.ts`                                      | À faire |       |
| `src/core/domain/site/entities/seo.ts`                                               | À faire |       |
| `src/core/domain/site/entities/site-index.ts`                                        | À faire |       |
| `src/core/domain/site/entities/site-settings.ts`                                     | À faire |       |
| `src/core/domain/site/entities/social.ts`                                            | À faire |       |
| `src/core/domain/site/entities/theme.ts`                                             | À faire |       |
| `src/core/domain/site/index/actions.ts`                                              | À faire |       |
| `src/core/domain/site/index/helpers.ts`                                              | À faire |       |
| `src/core/domain/site/index/validators.ts`                                           | À faire |       |
| `src/core/domain/site/ports/site-repository.ts`                                      | À faire |       |
| `src/core/domain/site/seo/constants.ts`                                              | À faire |       |
| `src/core/domain/site/seo/validators.ts`                                             | À faire |       |
| `src/core/domain/site/social/constants.ts`                                           | À faire |       |
| `src/core/domain/site/social/validator.ts`                                           | À faire |       |
| `src/core/domain/site/use-cases/admin/update-admin-settings.errors.ts`               | À faire |       |
| `src/core/domain/site/use-cases/admin/update-admin-settings.ts`                      | À faire |       |
| `src/core/domain/site/use-cases/admin/update-admin-settings.types.ts`                | À faire |       |
| `src/core/domain/site/use-cases/footer/update-footer-settings.errors.ts`             | À faire |       |
| `src/core/domain/site/use-cases/footer/update-footer-settings.ts`                    | À faire |       |
| `src/core/domain/site/use-cases/footer/update-footer-settings.types.ts`              | À faire |       |
| `src/core/domain/site/use-cases/header/update-header-settings.errors.ts`             | À faire |       |
| `src/core/domain/site/use-cases/header/update-header-settings.ts`                    | À faire |       |
| `src/core/domain/site/use-cases/header/update-header-settings.types.ts`              | À faire |       |
| `src/core/domain/site/use-cases/identity/update-identity-settings.errors.ts`         | À faire |       |
| `src/core/domain/site/use-cases/identity/update-identity-settings.ts`                | À faire |       |
| `src/core/domain/site/use-cases/identity/update-identity-settings.types.ts`          | À faire |       |
| `src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.errors.ts`     | À faire |       |
| `src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.ts`            | À faire |       |
| `src/core/domain/site/use-cases/legal-menu/update-legal-menu-settings.types.ts`      | À faire |       |
| `src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.errors.ts` | À faire |       |
| `src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.ts`        | À faire |       |
| `src/core/domain/site/use-cases/primary-menu/update-primary-menu-settings.types.ts`  | À faire |       |
| `src/core/domain/site/use-cases/publish/publish-site.errors.ts`                      | À faire |       |
| `src/core/domain/site/use-cases/publish/publish-site.ts`                             | À faire |       |
| `src/core/domain/site/use-cases/publish/publish-site.types.ts`                       | À faire |       |
| `src/core/domain/site/use-cases/seo/update-seo-settings.errors.ts`                   | À faire |       |
| `src/core/domain/site/use-cases/seo/update-seo-settings.ts`                          | À faire |       |
| `src/core/domain/site/use-cases/seo/update-seo-settings.types.ts`                    | À faire |       |
| `src/core/domain/site/use-cases/site-index/update-site-index.errors.ts`              | À faire |       |
| `src/core/domain/site/use-cases/site-index/update-site-index.ts`                     | À faire |       |
| `src/core/domain/site/use-cases/site-index/update-site-index.types.ts`               | À faire |       |
| `src/core/domain/site/use-cases/social/update-social-settings.errors.ts`             | À faire |       |
| `src/core/domain/site/use-cases/social/update-social-settings.ts`                    | À faire |       |
| `src/core/domain/site/use-cases/social/update-social-settings.types.ts`              | À faire |       |
| `src/core/domain/site/use-cases/theme/update-theme-settings.errors.ts`               | À faire |       |
| `src/core/domain/site/use-cases/theme/update-theme-settings.ts`                      | À faire |       |
| `src/core/domain/site/use-cases/theme/update-theme-settings.types.ts`                | À faire |       |
| `src/core/domain/site/validators/identity.ts`                                        | À faire |       |
| `src/core/domain/site/validators/legal-menu.ts`                                      | À faire |       |
| `src/core/domain/site/validators/primary-menu.ts`                                    | À faire |       |
| `src/core/domain/site/validators/publish.ts`                                         | À faire |       |
| `src/core/domain/slug/constants.ts`                                                  | À faire |       |
| `src/core/domain/slug/utils.ts`                                                      | À faire |       |
| `src/core/domain/urls/compare.ts`                                                    | À faire |       |
| `src/core/domain/urls/href.ts`                                                       | À faire |       |
| `src/core/domain/urls/mailto.ts`                                                     | À faire |       |
| `src/core/domain/utils/clock.ts`                                                     | À faire |       |
| `src/core/domain/utils/deep-freeze.ts`                                               | À faire |       |

## 2. Validation et utilitaires transverses

### 2.1 Schémas de validation – `src/schemas`

| Chemin                                                  | Statut  | Notes |
| ------------------------------------------------------- | ------- | ----- |
| `src/schemas/blocks/blocks.ts`                          | À faire |       |
| `src/schemas/builders.ts`                               | À faire |       |
| `src/schemas/date.ts`                                   | À faire |       |
| `src/schemas/pages/page-intents.ts`                     | À faire |       |
| `src/schemas/pages/page.ts`                             | À faire |       |
| `src/schemas/routes/params.ts`                          | À faire |       |
| `src/schemas/setup-zod.ts`                              | À faire |       |
| `src/schemas/site/admin/admin-intents.ts`               | À faire |       |
| `src/schemas/site/admin/admin.ts`                       | À faire |       |
| `src/schemas/site/common.ts`                            | À faire |       |
| `src/schemas/site/footer/footer-intents.ts`             | À faire |       |
| `src/schemas/site/footer/footer.ts`                     | À faire |       |
| `src/schemas/site/header/header-intents.ts`             | À faire |       |
| `src/schemas/site/header/header.ts`                     | À faire |       |
| `src/schemas/site/identity/identity-intents.ts`         | À faire |       |
| `src/schemas/site/identity/identity.ts`                 | À faire |       |
| `src/schemas/site/legal-menu/legal-menu-intents.ts`     | À faire |       |
| `src/schemas/site/legal-menu/legal-menu.ts`             | À faire |       |
| `src/schemas/site/primary-menu/primary-menu-intents.ts` | À faire |       |
| `src/schemas/site/primary-menu/primary-menu.ts`         | À faire |       |
| `src/schemas/site/publish/publish-intents.ts`           | À faire |       |
| `src/schemas/site/publish/publish.ts`                   | À faire |       |
| `src/schemas/site/seo/seo-intents.ts`                   | À faire |       |
| `src/schemas/site/seo/seo.ts`                           | À faire |       |
| `src/schemas/site/site-index.ts`                        | À faire |       |
| `src/schemas/site/social/social-intents.ts`             | À faire |       |
| `src/schemas/site/social/social.ts`                     | À faire |       |
| `src/schemas/site/theme/theme-intents.ts`               | À faire |       |
| `src/schemas/site/theme/theme.ts`                       | À faire |       |

### 2.2 Bibliothèques partagées – `src/lib`

| Chemin                                 | Statut  | Notes |
| -------------------------------------- | ------- | ----- |
| `src/lib/abortError.ts`                | À faire |       |
| `src/lib/api/handle-route.ts`          | À faire |       |
| `src/lib/api/responses.ts`             | À faire |       |
| `src/lib/api/urls.ts`                  | À faire |       |
| `src/lib/cn.ts`                        | À faire |       |
| `src/lib/diff.ts`                      | À faire |       |
| `src/lib/equality.ts`                  | À faire |       |
| `src/lib/guards.ts`                    | À faire |       |
| `src/lib/http/api-fetch.ts`            | À faire |       |
| `src/lib/http/read-json.ts`            | À faire |       |
| `src/lib/http/validation.ts`           | À faire |       |
| `src/lib/log.ts`                       | À faire |       |
| `src/lib/merge.ts`                     | À faire |       |
| `src/lib/normalize.ts`                 | À faire |       |
| `src/lib/notify-presets.ts`            | À faire |       |
| `src/lib/notify.ts`                    | À faire |       |
| `src/lib/patch.ts`                     | À faire |       |
| `src/lib/public/content.ts`            | À faire |       |
| `src/lib/ui/footer-preview-classes.ts` | À faire |       |
| `src/lib/ui/header-preview-classes.ts` | À faire |       |
| `src/lib/ui/social-preview-helpers.ts` | À faire |       |
| `src/lib/zod-bootstrap.ts`             | À faire |       |

## 3. Infrastructure et présentation

### 3.1 Adapteurs & services – `src/infrastructure`

| Chemin                                                     | Statut  | Notes |
| ---------------------------------------------------------- | ------- | ----- |
| `src/infrastructure/constants/endpoints.ts`                | À faire |       |
| `src/infrastructure/http/admin/pages.client.ts`            | À faire |       |
| `src/infrastructure/http/admin/site-settings.client.ts`    | À faire |       |
| `src/infrastructure/http/admin/site.client.ts`             | À faire |       |
| `src/infrastructure/http/shared/_internal.ts`              | À faire |       |
| `src/infrastructure/http/shared/api-error.ts`              | À faire |       |
| `src/infrastructure/pages/file-system-pages-repository.ts` | À faire |       |
| `src/infrastructure/pages/in-memory-pages-repository.ts`   | À faire |       |
| `src/infrastructure/pages/index.ts`                        | À faire |       |
| `src/infrastructure/site/file-system-site-repository.ts`   | À faire |       |
| `src/infrastructure/site/in-memory-site-repository.ts`     | À faire |       |
| `src/infrastructure/site/index.ts`                         | À faire |       |
| `src/infrastructure/ui/atoms.ts`                           | À faire |       |
| `src/infrastructure/ui/container.ts`                       | À faire |       |
| `src/infrastructure/ui/patterns.ts`                        | À faire |       |
| `src/infrastructure/ui/runtime.ts`                         | À faire |       |
| `src/infrastructure/ui/size.ts`                            | À faire |       |
| `src/infrastructure/ui/theme-apply.ts`                     | À faire |       |
| `src/infrastructure/ui/theme.ts`                           | À faire |       |
| `src/infrastructure/utils/errors.ts`                       | À faire |       |
| `src/infrastructure/utils/fs.ts`                           | À faire |       |

### 3.2 Composants UI – `src/components`

| Chemin                                                                      | Statut  | Notes |
| --------------------------------------------------------------------------- | ------- | ----- |
| `src/components/admin/atoms/Heading.tsx`                                    | À faire |       |
| `src/components/admin/layouts/Footer.tsx`                                   | À faire |       |
| `src/components/admin/layouts/FormGrid.tsx`                                 | À faire |       |
| `src/components/admin/layouts/Header.tsx`                                   | À faire |       |
| `src/components/admin/molecules/ActionsBar.tsx`                             | À faire |       |
| `src/components/admin/molecules/EmptyHint.tsx`                              | À faire |       |
| `src/components/admin/molecules/MenuFieldsItem.tsx`                         | À faire |       |
| `src/components/admin/molecules/PageListItem.tsx`                           | À faire |       |
| `src/components/admin/molecules/SocialFieldsItem.tsx`                       | À faire |       |
| `src/components/admin/molecules/TabBar.tsx`                                 | À faire |       |
| `src/components/admin/molecules/TabPanel.tsx`                               | À faire |       |
| `src/components/admin/molecules/cards/CardBox.tsx`                          | À faire |       |
| `src/components/admin/molecules/cards/ChecklistCard.tsx`                    | À faire |       |
| `src/components/admin/molecules/cards/StatCard.tsx`                         | À faire |       |
| `src/components/admin/molecules/cards/skeletons/CardBoxSkeleton.tsx`        | À faire |       |
| `src/components/admin/molecules/cards/skeletons/ChecklistCardSkeleton.tsx`  | À faire |       |
| `src/components/admin/molecules/cards/skeletons/StatCardSkeleton.tsx`       | À faire |       |
| `src/components/admin/molecules/fields/InputField.tsx`                      | À faire |       |
| `src/components/admin/molecules/fields/SelectField.tsx`                     | À faire |       |
| `src/components/admin/molecules/fields/SwitchField.tsx`                     | À faire |       |
| `src/components/admin/molecules/fields/TextareaField.tsx`                   | À faire |       |
| `src/components/admin/molecules/fields/skeletons/InputFieldSkeleton.tsx`    | À faire |       |
| `src/components/admin/molecules/fields/skeletons/SelectFieldSkeleton.tsx`   | À faire |       |
| `src/components/admin/molecules/fields/skeletons/SwitchFieldSkeleton.tsx`   | À faire |       |
| `src/components/admin/molecules/fields/skeletons/TextareaFieldSkeleton.tsx` | À faire |       |
| `src/components/admin/molecules/panels/FieldPanel.tsx`                      | À faire |       |
| `src/components/admin/molecules/panels/PreviewPanel.tsx`                    | À faire |       |
| `src/components/admin/molecules/skeletons/ActionBarSkeleton.tsx`            | À faire |       |
| `src/components/admin/molecules/skeletons/MenuFieldsItemSkeleton.tsx`       | À faire |       |
| `src/components/admin/molecules/skeletons/PageListItemSkeleton.tsx`         | À faire |       |
| `src/components/admin/molecules/skeletons/SocialFieldsItemSkeleton.tsx`     | À faire |       |
| `src/components/admin/organisms/forms/FooterForm.tsx`                       | À faire |       |
| `src/components/admin/organisms/forms/HeaderForm.tsx`                       | À faire |       |
| `src/components/admin/organisms/forms/IdentityForm.tsx`                     | À faire |       |
| `src/components/admin/organisms/forms/LegalMenuForm.tsx`                    | À faire |       |
| `src/components/admin/organisms/forms/PageForm.tsx`                         | À faire |       |
| `src/components/admin/organisms/forms/PrimaryMenuForm.tsx`                  | À faire |       |
| `src/components/admin/organisms/forms/SeoForm.tsx`                          | À faire |       |
| `src/components/admin/organisms/forms/SocialForm.tsx`                       | À faire |       |
| `src/components/admin/organisms/forms/ThemeForm.tsx`                        | À faire |       |
| `src/components/admin/pages/Dashboard.tsx`                                  | À faire |       |
| `src/components/admin/pages/tabs/BlocksTab.tsx`                             | À faire |       |
| `src/components/admin/pages/tabs/FooterTab.tsx`                             | À faire |       |
| `src/components/admin/pages/tabs/HeaderTab.tsx`                             | À faire |       |
| `src/components/admin/pages/tabs/IdentityTab.tsx`                           | À faire |       |
| `src/components/admin/pages/tabs/MenuTab.tsx`                               | À faire |       |
| `src/components/admin/pages/tabs/OverviewTab.tsx`                           | À faire |       |
| `src/components/admin/pages/tabs/PagesTab.tsx`                              | À faire |       |
| `src/components/admin/pages/tabs/SeoTab.tsx`                                | À faire |       |
| `src/components/admin/pages/tabs/SocialTab.tsx`                             | À faire |       |
| `src/components/admin/pages/tabs/index.ts`                                  | À faire |       |
| `src/components/admin/previews/FooterPreview.tsx`                           | À faire |       |
| `src/components/admin/previews/HeaderPreview.tsx`                           | À faire |       |
| `src/components/admin/previews/IdentityLogoPreview.tsx`                     | À faire |       |
| `src/components/admin/previews/MenuPreview.tsx`                             | À faire |       |
| `src/components/admin/previews/SiteThemePreview.tsx`                        | À faire |       |
| `src/components/admin/previews/SocialPreview.tsx`                           | À faire |       |
| `src/components/admin/sections/BlocksSection.tsx`                           | À faire |       |
| `src/components/admin/sections/FooterSection.tsx`                           | À faire |       |
| `src/components/admin/sections/HeaderSection.tsx`                           | À faire |       |
| `src/components/admin/sections/IdentitySection.tsx`                         | À faire |       |
| `src/components/admin/sections/LegalMenuSection.tsx`                        | À faire |       |
| `src/components/admin/sections/OverviewSection.tsx`                         | À faire |       |
| `src/components/admin/sections/OverviewThemeSection.tsx`                    | À faire |       |
| `src/components/admin/sections/PageEditSection.tsx`                         | À faire |       |
| `src/components/admin/sections/PagesListSection.tsx`                        | À faire |       |
| `src/components/admin/sections/PrimaryMenuSection.tsx`                      | À faire |       |
| `src/components/admin/sections/SeoSection.tsx`                              | À faire |       |
| `src/components/admin/sections/SocialSection.tsx`                           | À faire |       |
| `src/components/admin/sections/skeletons/LegalMenuSectionSkeleton.tsx`      | À faire |       |
| `src/components/admin/sections/skeletons/PrimaryMenuSectionSkeleton.tsx`    | À faire |       |
| `src/components/admin/theme/PaletteSelect.tsx`                              | À faire |       |
| `src/components/admin/theme/ThemeProvider.tsx`                              | À faire |       |
| `src/components/admin/theme/ThemeToggle.tsx`                                | À faire |       |
| `src/components/public-site/layouts/PublicFooter.tsx`                       | À faire |       |
| `src/components/public-site/layouts/PublicHeader.tsx`                       | À faire |       |
| `src/components/shared/theme/PublicThemeScope.tsx`                          | À faire |       |
| `src/components/ui/button.tsx`                                              | À faire |       |
| `src/components/ui/card.tsx`                                                | À faire |       |
| `src/components/ui/input.tsx`                                               | À faire |       |
| `src/components/ui/label.tsx`                                               | À faire |       |
| `src/components/ui/select.tsx`                                              | À faire |       |
| `src/components/ui/separator.tsx`                                           | À faire |       |
| `src/components/ui/skeleton.tsx`                                            | À faire |       |
| `src/components/ui/sonner.tsx`                                              | À faire |       |
| `src/components/ui/switch.tsx`                                              | À faire |       |
| `src/components/ui/tabs.tsx`                                                | À faire |       |
| `src/components/ui/textarea.tsx`                                            | À faire |       |

### 3.3 Constantes d’interface – `src/constants`

| Chemin                             | Statut  | Notes |
| ---------------------------------- | ------- | ----- |
| `src/constants/admin/options.ts`   | À faire |       |
| `src/constants/admin/presets.ts`   | À faire |       |
| `src/constants/shared/entities.ts` | À faire |       |

### 3.4 Hooks client – `src/hooks`

| Chemin                                                        | Statut  | Notes |
| ------------------------------------------------------------- | ------- | ----- |
| `src/hooks/_shared/list/list.ts`                              | À faire |       |
| `src/hooks/_shared/list/useArrayField.ts`                     | À faire |       |
| `src/hooks/_shared/list/useObjectArrayField.ts`               | À faire |       |
| `src/hooks/_shared/usePreviewResource.ts`                     | À faire |       |
| `src/hooks/_shared/useSettingsResource.ts`                    | À faire |       |
| `src/hooks/_shared/utils.ts`                                  | À faire |       |
| `src/hooks/admin/pages/useCreatePage.ts`                      | À faire |       |
| `src/hooks/admin/pages/useDeletePage.ts`                      | À faire |       |
| `src/hooks/admin/pages/useReadPage.ts`                        | À faire |       |
| `src/hooks/admin/pages/useUpdatePage.ts`                      | À faire |       |
| `src/hooks/admin/site/footer/useFooterPreview.ts`             | À faire |       |
| `src/hooks/admin/site/footer/useFooterSettings.ts`            | À faire |       |
| `src/hooks/admin/site/header/useHeaderPreview.ts`             | À faire |       |
| `src/hooks/admin/site/header/useHeaderSettings.ts`            | À faire |       |
| `src/hooks/admin/site/identity/useIdentityLogoPreview.ts`     | À faire |       |
| `src/hooks/admin/site/identity/useIdentitySettings.ts`        | À faire |       |
| `src/hooks/admin/site/legal-menu/useLegalMenuPreview.ts`      | À faire |       |
| `src/hooks/admin/site/legal-menu/useLegalMenuSettings.ts`     | À faire |       |
| `src/hooks/admin/site/primary-menu/usePrimaryMenuPreview.ts`  | À faire |       |
| `src/hooks/admin/site/primary-menu/usePrimaryMenuSettings.ts` | À faire |       |
| `src/hooks/admin/site/seo/useSeoSettings.ts`                  | À faire |       |
| `src/hooks/admin/site/social/useSocialPreview.ts`             | À faire |       |
| `src/hooks/admin/site/social/useSocialSettings.ts`            | À faire |       |
| `src/hooks/admin/site/theme/usePalette.ts`                    | À faire |       |
| `src/hooks/admin/site/theme/useThemePreview.ts`               | À faire |       |
| `src/hooks/admin/site/theme/useThemeSettings.ts`              | À faire |       |
| `src/hooks/admin/site/useSiteIndex.ts`                        | À faire |       |

### 3.5 Routes & mises en page – `src/app`

| Chemin                                         | Statut  | Notes |
| ---------------------------------------------- | ------- | ----- |
| `src/app/[slug]/page.tsx`                      | À faire |       |
| `src/app/admin/error.tsx`                      | À faire |       |
| `src/app/admin/layout.tsx`                     | À faire |       |
| `src/app/admin/page.tsx`                       | À faire |       |
| `src/app/admin/pages/[slug]/page.tsx`          | À faire |       |
| `src/app/api/admin/pages/[slug]/route.ts`      | À faire |       |
| `src/app/api/admin/pages/route.ts`             | À faire |       |
| `src/app/api/admin/site/admin/route.ts`        | À faire |       |
| `src/app/api/admin/site/footer/route.ts`       | À faire |       |
| `src/app/api/admin/site/header/route.ts`       | À faire |       |
| `src/app/api/admin/site/identity/route.ts`     | À faire |       |
| `src/app/api/admin/site/legal-menu/route.ts`   | À faire |       |
| `src/app/api/admin/site/primary-menu/route.ts` | À faire |       |
| `src/app/api/admin/site/publish/route.ts`      | À faire |       |
| `src/app/api/admin/site/seo/route.ts`          | À faire |       |
| `src/app/api/admin/site/social/route.ts`       | À faire |       |
| `src/app/api/admin/site/theme/route.ts`        | À faire |       |
| `src/app/favicon.ico`                          | À faire |       |
| `src/app/globals.css`                          | À faire |       |
| `src/app/layout.tsx`                           | À faire |       |
| `src/app/page.tsx`                             | À faire |       |

## 4. Internationalisation – `src/i18n`

### 4.1 Fichiers i18n

| Chemin                                              | Statut  | Notes |
| --------------------------------------------------- | ------- | ----- |
| `src/i18n/LanguageSwitcher.tsx`                     | À faire |       |
| `src/i18n/context.tsx`                              | À faire |       |
| `src/i18n/default.ts`                               | À faire |       |
| `src/i18n/factories/admin/actions.ts`               | À faire |       |
| `src/i18n/factories/admin/blocks.ts`                | À faire |       |
| `src/i18n/factories/admin/content.ts`               | À faire |       |
| `src/i18n/factories/admin/entities.ts`              | À faire |       |
| `src/i18n/factories/admin/help.ts`                  | À faire |       |
| `src/i18n/factories/admin/identity-defaults.ts`     | À faire |       |
| `src/i18n/factories/admin/index.ts`                 | À faire |       |
| `src/i18n/factories/admin/layoutOptions.ts`         | À faire |       |
| `src/i18n/factories/admin/legal-menu-defaults.ts`   | À faire |       |
| `src/i18n/factories/admin/options.ts`               | À faire |       |
| `src/i18n/factories/admin/primary-menu-defaults.ts` | À faire |       |
| `src/i18n/factories/admin/seo-defaults.ts`          | À faire |       |
| `src/i18n/factories/admin/seo.ts`                   | À faire |       |
| `src/i18n/factories/admin/social.ts`                | À faire |       |
| `src/i18n/factories/admin/tabs.ts`                  | À faire |       |
| `src/i18n/index.ts`                                 | À faire |       |
| `src/i18n/locales/en.ts`                            | À faire |       |
| `src/i18n/locales/errors/en.ts`                     | À faire |       |
| `src/i18n/locales/errors/fr.ts`                     | À faire |       |
| `src/i18n/locales/fr.ts`                            | À faire |       |
| `src/i18n/locales/index.ts`                         | À faire |       |
| `src/i18n/meta.ts`                                  | À faire |       |
| `src/i18n/namespaces.ts`                            | À faire |       |
| `src/i18n/server.ts`                                | À faire |       |
| `src/i18n/types.ts`                                 | À faire |       |
| `src/i18n/useErrorI18n.ts`                          | À faire |       |
