/**
 * @file src/app/[slug]/page.tsx
 * @intro Page publique : rend une page publiée avec Header/Footer et thème
 * @description
 * - Lit les contenus **published** (settings + page).
 * - Génère des métadonnées SEO **site-level** + page (title/desc/canonical/robots/OG/Twitter).
 * - Minimal MVP : contenu de page “vide” accepté (sans blocs) pour valider routing + menus.
 * @layer app/public
 */

import { PublicThemeScope } from "@/components/shared/theme/PublicThemeScope";
import { isValidSlug } from "@/core/domain/slug/utils";
import {
  canonicalFromBase,
  stripTrailingSlashes,
} from "@/core/domain/urls/tools";
import { getRequestT } from "@/i18n/server";
import { readPublishedPage, readPublishedSettings } from "@/lib/public/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const slug = params.slug;
  if (!isValidSlug(slug)) return {};

  const [settings, page] = await Promise.all([
    readPublishedSettings(),
    readPublishedPage(slug),
  ]);
  if (!page) return {};

  const identityTitle = settings.identity?.title;
  const seo = settings.seo;

  const titleTemplate = seo?.titleTemplate;
  const defaultTitle = seo?.defaultTitle ?? page.title;
  const defaultDescription = seo?.defaultDescription ?? undefined;

  const baseUrl = stripTrailingSlashes(seo?.baseUrl);
  const canonicalUrl = seo?.canonicalUrl ?? canonicalFromBase(baseUrl, slug);
  const robots = seo?.robots;

  const ogDefault = seo?.openGraph?.defaultImageUrl;
  const twitterCard = seo?.twitter?.card;
  const twitterSite = seo?.twitter?.site;
  const twitterCreator = seo?.twitter?.creator;

  const pageOrDefaultTitle = (page.title || defaultTitle || "").trim();
  const computedTitle =
    titleTemplate && titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", pageOrDefaultTitle)
      : page.title || titleTemplate || defaultTitle;

  return {
    title: computedTitle,
    description: defaultDescription,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots,
    openGraph: {
      title: computedTitle,
      description: defaultDescription,
      url: canonicalUrl,
      siteName: identityTitle,
      images: ogDefault ? [{ url: ogDefault }] : undefined,
    },
    twitter: {
      card: ogDefault ? "summary_large_image" : twitterCard,
      title: computedTitle,
      description: defaultDescription,
      images: ogDefault ? [ogDefault] : undefined,
      site: twitterSite,
      creator: twitterCreator,
    },
  };
}

export default async function PublicPage({ params }: Params) {
  const slug = params.slug;
  const t = await getRequestT();

  if (!isValidSlug(slug)) notFound();

  const [settings, page] = await Promise.all([
    readPublishedSettings(),
    readPublishedPage(slug),
  ]);

  if (!page) notFound();

  const { header, footer, identity, primaryMenu, social, legalMenu, theme } =
    settings;

  return (
    <PublicThemeScope theme={theme}>
      {/* <PublicHeader settings={header} identity={identity} menu={primaryMenu} social={social} /> */}
      <main id="main" className="min-h-60 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-12 space-y-6">
          <h1 className="text-2xl font-semibold">{page.title}</h1>
          {Array.isArray(page.blocks) && page.blocks.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {page.blocks.map((_, i) => (
                <li key={i}>
                  {t("public.page.block.item", { n: String(i + 1) })}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("public.page.blocks.empty")}
            </p>
          )}
        </div>
      </main>
      {/* <PublicFooter settings={footer} legalMenu={legalMenu} identityTitle={identity.title} identityLogoUrl={""} /> */}
    </PublicThemeScope>
  );
}
