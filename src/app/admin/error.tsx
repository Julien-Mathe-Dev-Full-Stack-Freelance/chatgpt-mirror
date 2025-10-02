"use client";

/**
 * @file src/app/admin/error.tsx
 * @intro Vue d’affichage des erreurs pour les routes d’administration
 */

import { Button } from "@/components/ui/button";
import type { ErrorCode } from "@/core/domain/errors/codes";
import { isDomainError } from "@/core/domain/errors/domain-error";
import { useI18n } from "@/i18n/context";
import { log } from "@/lib/log";
import { notify } from "@/lib/notify";
import { useEffect, useMemo, useRef } from "react";

interface AdminRouteError extends Error {
  digest?: string;
  code?: ErrorCode;
}

type AdminErrorProps = {
  error: AdminRouteError;
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  const logger = useMemo(
    () => log.child({ ns: "ui", comp: "AdminError", route: "/admin/*" }),
    []
  );

  const lastKeyRef = useRef<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const key =
      error?.digest ??
      (isDomainError(error) ? error.code : undefined) ??
      error?.message ??
      "unknown";

    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;

      logger.error("Route segment error", {
        name: error?.name,
        message: error?.message,
        code: isDomainError(error) ? error.code : undefined,
        digest: error?.digest,
        stack: error?.stack,
      });

      notify.fromError(error);
    }
  }, [error, logger]);

  return (
    <div
      className="mx-auto my-10 max-w-lg space-y-4 rounded-xl border bg-card p-6"
      role="alert"
      aria-atomic="true"
      aria-labelledby="admin-error-title"
    >
      <h2 id="admin-error-title" className="text-lg font-semibold">
        {t("admin.error.title")}
      </h2>

      <p className="text-sm text-muted-foreground">
        {t("admin.error.subtitle")}
      </p>

      <div className="flex gap-2">
        <Button onClick={reset}>{t("admin.error.retry")}</Button>
      </div>

      {process.env.NODE_ENV !== "production" && error?.digest && (
        <p className="text-xs text-muted-foreground/80">
          {t("admin.error.digest")} <code>{error.digest}</code>
        </p>
      )}
    </div>
  );
}
