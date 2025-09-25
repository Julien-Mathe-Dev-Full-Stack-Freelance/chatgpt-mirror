"use client";

/**
 * @file src/components/layouts/Footer.tsx
 * @intro Pied de page de l’interface d’administration
 * @description
 * Footer discret avec infos minimales et liens utiles.
 * Minimal par défaut ; extensible (build info, commit, env).
 *
 * Observabilité : Aucune (présentation pure).
 *
 * @layer ui
 * @remarks
 * - Année **UTC** (limite les mismatches SSR/CSR).
 * - Version lue depuis `NEXT_PUBLIC_APP_VERSION` (fallback "v0.1").
 * - Aucun `className` en props (pas de surcharge côté admin).
 */

import { DEFAULT_LEGAL_MENTIONS_PATH } from "@/core/domain/constants/urls";
import { useI18n } from "@/i18n/context";
import { CONTAINER_CLASS } from "@/infrastructure/ui/container";
import { cn } from "@/lib/cn";
import Link from "next/link";

const APP_VERSION = process.env["NEXT_PUBLIC_APP_VERSION"] ?? "v0.1";
const YEAR_UTC = new Date().getUTCFullYear();

export function Footer() {
  const { t } = useI18n();
  return (
    <footer
      className="border-t border-border/60 bg-muted/40 text-foreground/80"
      aria-label={t("admin.footer.ariaFooter")}
    >
      <div
        className={cn(
          CONTAINER_CLASS.normal,
          "flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between"
        )}
      >
        <p className="text-xs">
          Admin · {APP_VERSION} — ©{" "}
          <time dateTime={String(YEAR_UTC)}>{YEAR_UTC}</time>
        </p>

        <nav
          className="flex items-center gap-4 text-xs"
          aria-label={t("admin.footer.ariaLinks")}
        >
          <ul className="flex items-center gap-4 text-xs">
            <li>
              <Link
                className="underline-offset-2 hover:underline"
                href="/admin"
              >
                {t("admin.footer.dashboard")}
              </Link>
            </li>
            <li>
              <Link
                className="underline-offset-2 hover:underline"
                href={DEFAULT_LEGAL_MENTIONS_PATH}
              >
                {t("admin.footer.legalMentions")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
