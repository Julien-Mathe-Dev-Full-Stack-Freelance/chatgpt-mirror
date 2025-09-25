"use client";

/**
 * @file src/components/admin/theme/ThemeToggle.tsx
 * @intro Bouton de bascule du thème (sombre/clair)
 * @layer ui/theme
 */

import { useI18n } from "@/i18n/context";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Composant ThemeToggle (admin).
 * @returns Bouton permettant de passer du mode sombre au mode clair (et inversement).
 */
export function ThemeToggle() {
  const { t } = useI18n();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = (theme ?? resolvedTheme) || "system";
  const isDark = current === "dark";

  const nextTheme = isDark ? "light" : "dark";
  const title =
    nextTheme === "dark"
      ? t("ui.theme.toggle.toDark")
      : t("ui.theme.toggle.toLight");

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={t("ui.theme.toggle.aria")}
      aria-pressed={isDark}
      title={title}
    >
      {isDark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
      <span className="hidden sm:inline">
        {nextTheme === "dark"
          ? t("ui.theme.mode.dark")
          : t("ui.theme.mode.light")}
      </span>
    </button>
  );
}
