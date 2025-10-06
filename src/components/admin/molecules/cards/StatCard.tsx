"use client";

import { CardBox } from "@/components/admin/molecules/cards/CardBox";
import { StatCardSkeleton } from "@/components/admin/molecules/cards/skeletons/StatCardSkeleton";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { ATOM } from "@/infrastructure/ui/atoms";
import { useI18n } from "@/i18n/context";

type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  loading?: boolean;
};

export function StatCard({
  label,
  value,
  hint,
  loading = false,
}: StatCardProps) {
  const { t } = useI18n();
  return (
    <div aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("ui.loading")}
        </span>
      )}

      {loading ? (
        <StatCardSkeleton />
      ) : (
        <CardBox title={label} headingAs="h3">
          <div className="flex items-baseline justify-between gap-4">
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            {hint ? (
              <div className={cn("text-right text-xs", ATOM.textMuted)}>
                {hint}
              </div>
            ) : null}
          </div>
        </CardBox>
      )}
    </div>
  );
}
