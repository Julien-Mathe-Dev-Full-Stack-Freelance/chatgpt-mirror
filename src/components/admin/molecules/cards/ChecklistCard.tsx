"use client";

import { CardBox } from "@/components/admin/molecules/cards/CardBox";
import { ChecklistCardSkeleton } from "@/components/admin/molecules/cards/skeletons/ChecklistCardSkeleton";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { CheckCircle2, Circle } from "lucide-react";
import type { ReactNode } from "react";

type ChecklistItem = {
  label: ReactNode;
  done?: boolean;
  key?: string | number;
};

type ChecklistCardProps = {
  title: ReactNode;
  items: ChecklistItem[];
  description?: ReactNode;
  loading?: boolean;
};

export function ChecklistCard({
  title,
  items,
  description,
  loading = false,
}: ChecklistCardProps) {
  const { t } = useI18n();
  return (
    <div aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("ui.loading")}
        </span>
      )}

      {loading ? (
        <ChecklistCardSkeleton />
      ) : (
        <CardBox title={title} description={description} headingAs="h3">
          <ul className="space-y-2 text-sm">
            {items.map((it, i) => {
              const statusLabel = it.done
                ? t("ui.checklist.done")
                : t("ui.checklist.todo");

              const Icon = it.done ? CheckCircle2 : Circle;

              return (
                <li key={it.key ?? i} className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4" aria-hidden="true" />
                  <span className={ATOM.srOnly}>{statusLabel}</span>
                  <span className={it.done ? ATOM.textMuted : undefined}>
                    {it.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardBox>
      )}
    </div>
  );
}
