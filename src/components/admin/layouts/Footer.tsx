"use client";

/**
 * @file src/components/admin/layouts/Footer.tsx
 * @intro Pied de page de l’interface d’administration
 * @description
 * - Copyright centré (desktop), liens légaux à droite.
 * - Mobile : stacked, tout centré.
 */

import { DEFAULT_LEGAL_MENTIONS_PATH } from "@/core/domain/constants/urls"; // remplace si besoin
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/cn";
import Link from "next/link";

const YEAR_UTC = new Date().getUTCFullYear();
const APP_VERSION = process.env["NEXT_PUBLIC_APP_VERSION"] ?? "v0.1";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer
      aria-label={t("admin.footer.ariaFooter") || "Pied de page"}
      className={cn(
        "w-full border-t border-border bg-muted/40 text-foreground/80"
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-screen-xl",
          "px-3 md:px-4 lg:px-6 py-4",
          "grid grid-cols-1 items-center gap-3 text-sm",
          "lg:[grid-template-columns:1fr_auto_1fr]"
        )}
      >
        {/* Copyright — centré sur desktop */}
        <p className={cn("lg:col-start-2", "justify-self-center text-center")}>
          Compoz Studio© — {APP_VERSION} —{" "}
          <time dateTime={String(YEAR_UTC)}>{YEAR_UTC}</time>
        </p>

        {/* Liens légaux — à droite sur desktop */}
        <nav
          aria-label={t("admin.footer.ariaLinks") || "Liens légaux"}
          className={cn(
            "justify-self-center",
            "lg:col-start-3 lg:justify-self-end",
            "lg:mr-6"
          )}
        >
          <ul
            className={cn(
              "m-0 p-0 list-none",
              "flex flex-wrap",
              "gap-6 lg:gap-4"
            )}
          >
            <li>
              <Link
                href={DEFAULT_LEGAL_MENTIONS_PATH ?? "/mentions-legales"}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  "underline-offset-2 hover:underline"
                )}
              >
                {t("admin.footer.legalMentions") || "Mentions légales"}
              </Link>
            </li>
            <li>
              <Link
                href="/cookies"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  "underline-offset-2 hover:underline"
                )}
              >
                {t("admin.footer.cookies") || "Cookies"}
              </Link>
            </li>
            {/* Exemple optionnel :
            <li>
              <Link
                href="/confidentialite"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  "underline-offset-2 hover:underline"
                )}
              >
                {t("admin.footer.privacy") || "Confidentialité"}
              </Link>
            </li>
            */}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
