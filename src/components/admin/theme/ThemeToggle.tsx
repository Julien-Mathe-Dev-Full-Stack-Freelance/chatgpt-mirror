"use client";

/**
 * @file src/components/admin/theme/ThemeToggle.tsx
 * @intro Bouton de bascule du thème (sombre/clair)
 * @layer ui/theme
 */

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/context";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
      ? t("admin.theme.toggle.toDark")
      : t("admin.theme.toggle.toLight");

  return (
    <Button
      onClick={() => setTheme(nextTheme)}
      variant="secondary"
      aria-label={t("admin.theme.toggle.aria")}
      aria-pressed={isDark}
      title={title}
      className="relative overflow-hidden"
    >
      {/* Wrapper animé */}
      <span
        className={[
          "inline-flex items-center justify-center",
          "transition-transform duration-300",
          isDark ? "rotate-180" : "rotate-0",
        ].join(" ")}
        aria-hidden="true"
      >
        {/* Crossfade des icônes */}
        <span className="relative inline-block h-4 w-4">
          <Sun
            className={[
              "absolute inset-0 transition-opacity duration-200",
              isDark ? "opacity-100" : "opacity-0",
            ].join(" ")}
            size={16}
          />
          <Moon
            className={[
              "absolute inset-0 transition-opacity duration-200",
              isDark ? "opacity-0" : "opacity-100",
            ].join(" ")}
            size={16}
          />
        </span>
      </span>
    </Button>
  );
}
