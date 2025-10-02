"use client";

/**
 * @file src/components/admin/sections/BlocksSection.tsx
 */

import { Heading } from "@/components/admin/atoms/Heading";
import { useI18n } from "@/i18n/context";
import { ATOM } from "@/infrastructure/ui/atoms";
import { PREVIEW_BLOCKS } from "@/infrastructure/ui/patterns";
import { cn } from "@/lib/cn";

export function BlocksSection() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="blocks-title" className={ATOM.space.sectionGap}>
      <Heading id="blocks-title" as="h3" visuallyHidden>
        {t("admin.blocks.title")}
      </Heading>

      <div className={PREVIEW_BLOCKS.spacerSm}>
        <p className={cn("text-sm", ATOM.textMuted)}>
          {t("admin.blocks.placeholder")}
        </p>
      </div>
    </section>
  );
}
BlocksSection.displayName = "BlocksSection";
