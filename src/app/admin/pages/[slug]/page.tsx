"use client";
/**
 * @file src/app/admin/pages/[slug]/page.tsx
 * @intro Page d’édition du contenu d’une page (version admin)
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { PreviewPanel } from "@/components/admin/molecules/panels/PreviewPanel";
// import { PublicFooter } from "@/components/public-site/layouts/PublicFooter";
// import { PublicHeader } from "@/components/public-site/layouts/PublicHeader";
import { PublicThemeScope } from "@/components/shared/theme/PublicThemeScope";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useReadPage } from "@/hooks/admin/pages/useReadPage";
import { useFooterPreview } from "@/hooks/admin/site/footer/useFooterPreview";
import { useHeaderPreview } from "@/hooks/admin/site/header/useHeaderPreview";
import { useIdentityLogoPreview } from "@/hooks/admin/site/identity/useIdentityLogoPreview";
import { useLegalMenuPreview } from "@/hooks/admin/site/legal-menu/useLegalMenuPreview";
import { usePrimaryMenuPreview } from "@/hooks/admin/site/primary-menu/usePrimaryMenuPreview";
import { useSocialPreview } from "@/hooks/admin/site/social/useSocialPreview";
import { useThemeSettings } from "@/hooks/admin/site/theme/useThemeSettings";
import { useI18n } from "@/i18n/context";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PageContentEditor() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const { page, loading: pageLoading } = useReadPage(slug, "draft");
  const { settings: theme } = useThemeSettings();
  const { settings: header } = useHeaderPreview("draft");
  const { settings: footer } = useFooterPreview("draft");
  const { settings: identity } = useIdentityLogoPreview("draft");
  const { settings: menu } = usePrimaryMenuPreview("draft");
  const { settings: social } = useSocialPreview("draft");
  const { settings: legalMenu } = useLegalMenuPreview("draft");
  const { t } = useI18n();

  return (
    <div
      className="space-y-6"
      aria-busy={pageLoading || undefined}
      aria-labelledby="page-editor-title"
    >
      <Heading as="h2" id="page-editor-title">
        {t("admin.pageEditor.title")}
      </Heading>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {pageLoading
            ? t("admin.pageEditor.loading")
            : page
            ? t("admin.pageEditor.header.loaded", {
                title: page.title,
                slug: `/${page.slug}`,
              })
            : t("admin.pageEditor.header.notFound")}
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/admin">{t("admin.pageEditor.backDashboard")}</Link>
          </Button>
          <Button asChild>
            <Link href={{ pathname: "/admin", query: { tab: "pages" } }}>
              {t("admin.pageEditor.backList")}
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Layout 2 colonnes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Colonne gauche — Blocks */}
        <aside
          className="lg:col-span-4 space-y-3 rounded-xl border p-4"
          aria-labelledby="blocks-panel-title"
        >
          <Heading as="h3" id="blocks-panel-title">
            {t("admin.pageEditor.blocks.title")}
          </Heading>
          <p className="text-sm text-muted-foreground">
            {t("admin.pageEditor.blocks.desc")}
          </p>
          <Button variant="outline" disabled>
            {t("admin.pageEditor.blocks.add")}
          </Button>
        </aside>

        {/* Colonne droite — Preview */}
        <div className="lg:col-span-8">
          <PreviewPanel>
            <PublicThemeScope theme={theme}>
              {/* <PublicHeader
                settings={header}
                identity={identity}
                menu={menu}
                social={social}
                disableNav
              /> */}

              <main className="min-h-60 bg-muted/30">
                <div className="mx-auto max-w-5xl px-4 py-12">
                  {pageLoading ? (
                    <div className="text-sm text-muted-foreground">
                      {t("admin.pageEditor.preview.loading")}
                    </div>
                  ) : page ? (
                    <div className="space-y-3">
                      <h4 className="text-xl font-semibold">
                        {t("admin.pageEditor.preview.title")}
                      </h4>

                      {Array.isArray(page.blocks) && page.blocks.length > 0 ? (
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {page.blocks.map((_, i) => (
                            <li key={i}>
                              {t("admin.pageEditor.preview.blockItem", {
                                n: String(i + 1),
                              })}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t("admin.pageEditor.preview.empty")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-destructive">
                      {t("admin.pageEditor.preview.error")}
                    </div>
                  )}
                </div>
              </main>

              {/* <PublicFooter
                settings={footer}
                legalMenu={legalMenu}
                disableNav
                identityTitle={identity.title}
                identityLogoUrl={""}
              /> */}
            </PublicThemeScope>
          </PreviewPanel>
        </div>
      </div>
    </div>
  );
}
