"use client";

import { Heading } from "@/components/admin/atoms/Heading";
import { CardBoxSkeleton } from "@/components/admin/molecules/cards/skeletons/CardBoxSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { CARD_BOX } from "@/infrastructure/ui/patterns";
import type { ReactNode } from "react";

type CardBoxProps = {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  headingAs?: "h2" | "h3" | "h4";
  loading?: boolean;
};

export function CardBox({
  title,
  description,
  action,
  footer,
  headingAs = "h3",
  children,
  loading = false,
}: CardBoxProps) {
  const showHeader = Boolean(title || description || action);
  const { t } = useI18n();
  return (
    <div aria-busy={loading || undefined}>
      {loading && (
        <span role="status" aria-live="polite" className={ATOM.srOnly}>
          {t("ui.loading")}
        </span>
      )}

      {loading ? (
        <CardBoxSkeleton />
      ) : (
        <Card className={CARD_BOX.root}>
          {showHeader && (
            <CardHeader className={CARD_BOX.header}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {title ? (
                    <Heading as={headingAs} truncate>
                      {title}
                    </Heading>
                  ) : null}

                  {description ? (
                    <CardDescription className="mt-1">
                      {description}
                    </CardDescription>
                  ) : null}
                </div>
                {action ? <div className="shrink-0">{action}</div> : null}
              </div>
            </CardHeader>
          )}

          <CardContent className={CARD_BOX.content}>{children}</CardContent>

          {footer ? (
            <CardFooter className={CARD_BOX.footer}>{footer}</CardFooter>
          ) : null}
        </Card>
      )}
    </div>
  );
}
