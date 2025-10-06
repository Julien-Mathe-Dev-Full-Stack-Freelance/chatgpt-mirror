"use client";

/**
 * @file src/components/admin/sections/OverviewSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { CardBox } from "@/components/admin/molecules/cards/CardBox";
import { ChecklistCard } from "@/components/admin/molecules/cards/ChecklistCard";
import { StatCard } from "@/components/admin/molecules/cards/StatCard";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONTENT_STATE } from "@/constants/shared/common";
import type { PublishSiteResultDTO } from "@/core/domain/site/dto";
import { useI18n } from "@/i18n/context";
import { siteAdminApi } from "@/infrastructure/http/admin/site.client";
import { ATOM } from "@/infrastructure/ui/atoms";
import { log } from "@/lib/log";
import { notify } from "@/lib/notify";
import { useState } from "react";

const lg = log.child({ ns: "ui", comp: "OverviewSection" });

export function OverviewSection() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="overview-title" className={ATOM.space.sectionGap}>
      <Heading id="overview-title" as="h3" visuallyHidden>
        {t("admin.overview.title")}
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* TODO(data): brancher un vrai compteur */}
        <StatCard
          label={t("admin.overview.stats.pages.label")}
          value={4}
          hint={t("admin.overview.stats.pages.hint")}
        />

        <PublishCard />

        <ChecklistCard
          title={t("admin.overview.next.title")}
          items={[
            {
              label: t("admin.overview.next.headerFooter"),
              done: true,
            },
            {
              label: t("admin.overview.next.menu"),
              done: true,
            },
            { label: t("admin.overview.next.blocks") },
          ]}
        />
      </div>
    </section>
  );
}

function PublishCard() {
  const [publishing, setPublishing] = useState(false);
  const [last, setLast] = useState<PublishSiteResultDTO | null>(null);

  const { t } = useI18n();

  async function handlePublish() {
    setPublishing(true);
    const t0 = Date.now();
    lg.info("publish.start", { from: DEFAULT_CONTENT_STATE, to: "published" });

    try {
      const res = await siteAdminApi.publish({
        from: DEFAULT_CONTENT_STATE,
        to: "published",
      });
      setLast(res);

      notify.success(
        t("admin.overview.publish.ok.title"),
        t("admin.overview.publish.ok.body")
      );

      if (res.warnings.length) {
        notify.warning(
          t("admin.overview.publish.warn.title"),
          res.warnings.join("\n")
        );
      }

      lg.info("publish.ok", {
        ms: Date.now() - t0,
        pagesCopied: res.pagesCopied,
        settingsCopied: res.settingsCopied,
        warnings: res.warnings.length,
      });
    } catch (error: unknown) {
      notify.fromError(error);
      const message =
        error instanceof Error ? error.message : String(error ?? "unknown");
      lg.error("publish.failed", { msg: message });
    } finally {
      setPublishing(false);
    }
  }

  return (
    <CardBox
      title={t("admin.overview.publish.card.title")}
      description={t("admin.overview.publish.card.desc")}
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {t("admin.overview.publish.flow")}
        </p>

        <div
          className="flex items-center justify-between"
          aria-live="polite"
          aria-busy={publishing || undefined}
        >
          <Button type="button" onClick={handlePublish} disabled={publishing}>
            {publishing
              ? t("admin.overview.publish.btn.loading")
              : t("admin.overview.publish.btn.label")}
          </Button>

          {last && (
            <div className="text-xs text-muted-foreground" role="status">
              {t("admin.overview.publish.last", {
                pages: String(last.pagesCopied),
                settings: last.settingsCopied ? "OK" : "—",
              })}
            </div>
          )}
        </div>
      </div>
    </CardBox>
  );
}
OverviewSection.displayName = "OverviewSection";
