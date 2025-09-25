/**
 * @file src/app/[slug]/page.tsx
 * @intro Page publique : rend une page publiée avec Header/Footer et thème
 */

import { PublicFooter } from "@/components/public-site/layouts/PublicFooter";
import { PublicHeader } from "@/components/public-site/layouts/PublicHeader";
import { PublicThemeScope } from "@/components/shared/theme/PublicThemeScope";
import { isValidSlug } from "@/core/domain/slug/utils";
import { getRequestT } from "@/i18n/server";
import { readPublishedPage, readPublishedSettings } from "@/lib/public/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { params: { slug: string } };

// (optionnel) SEO minimal basé sur settings.seo + page.title
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const slug = params.slug;
  if (!isValidSlug(slug)) return {};

  const [settings, page] = await Promise.all([
    readPublishedSettings(),
    readPublishedPage(slug),
  ]);
  if (!page) return {};

  const titleTemplate = settings?.seo?.titleTemplate;
  const defaultTitle = settings?.seo?.defaultTitle ?? page.title;
  const defaultDescription = settings?.seo?.defaultDescription ?? undefined;
  const og = settings?.seo?.openGraph?.defaultImageUrl;
  const twitterCard = settings?.seo?.twitter?.card;

  const computedTitle =
    titleTemplate && titleTemplate.includes("%s")
      ? titleTemplate.replace("%s", page.title || defaultTitle)
      : page.title || titleTemplate || defaultTitle;

  return {
    title: computedTitle,
    description: defaultDescription,
    openGraph: {
      title: computedTitle,
      description: defaultDescription,
      images: og ? [{ url: og }] : undefined,
    },
    twitter: {
      card: og ? "summary_large_image" : twitterCard,
      title: computedTitle,
      description: defaultDescription,
      images: og ? [og] : undefined,
    },
  };
}

// (optionnel) SSG des pages publiques
// export async function generateStaticParams() {
//   const { readPublishedIndex } = await import("@/lib/public/content");
//   const index = await readPublishedIndex();
//   return (index?.pages ?? []).map(p => ({ slug: p.slug }));
// }

/**
 * Route publique pour une page publiée (SSR).
 */
export default async function PublicPage({ params }: Params) {
  const slug = params.slug;
  const t = await getRequestT();

  // Sécurité basique côté serveur
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
      <PublicHeader
        settings={header}
        identity={identity}
        menu={primaryMenu}
        social={social}
      />

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

      <PublicFooter
        settings={footer}
        legalMenu={legalMenu}
        identityTitle={identity.title}
        identityLogoUrl={identity.logoUrl}
      />
    </PublicThemeScope>
  );
}
