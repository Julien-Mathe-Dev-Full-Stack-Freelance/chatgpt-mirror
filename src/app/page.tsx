/**
 * @file page.tsx
 * @intro Accueil minimal — entrée vers l’admin Compoz
 * @description
 * - Page ultra-simple avec un encart et un CTA vers /admin.
 * - Sert de point de départ pour ajouter un formulaire d’auth plus tard.
 *
 * @layer ui/pages
 * @remarks
 * - Server Component (async) : lit l’index publié côté serveur via `readPublishedIndex()`.
 * - Le lien “site publié” ouvre un nouvel onglet avec `rel="noreferrer noopener"`.
 * @todo Remplacer le CTA par un <LoginForm /> (id/password) + gestion de session.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRequestT } from "@/i18n/server";
import { log } from "@/lib/log";
import { readPublishedIndex } from "@/lib/public/content";
import Link from "next/link";

/**
 * Page d’accueil (SSR) avec CTA vers l’admin et lien vers la première page publiée.
 * @returns Le markup de la page d’accueil.
 */
export default async function Home() {
  const t = await getRequestT();
  // On lit l'index publié côté serveur (pas de "use client" ici)
  let firstSlug: string | null = null;
  try {
    const index = await readPublishedIndex();
    firstSlug = index?.pages?.[0]?.slug ?? null;
  } catch (e) {
    // Pas encore publié → on laisse firstSlug à null
    log.debug("home.readIndex.failed", {
      msg: e instanceof Error ? e.message : String(e),
    });
  }

  return (
    <main
      id="home-main"
      aria-labelledby="home-title"
      className="min-h-dvh grid place-items-center px-6 py-10"
    >
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <h1
            id="home-title"
            className="text-xl md:text-2xl font-semibold tracking-tight"
          >
            {t("home.title")}
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("home.subtitle")}</p>

          <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
            <Button asChild>
              <Link href="/admin">{t("home.cta.admin")}</Link>
            </Button>

            {firstSlug ? (
              <Button asChild variant="outline">
                <Link
                  href={`/${firstSlug}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t("home.cta.viewPublished")}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                {t("home.cta.none")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
