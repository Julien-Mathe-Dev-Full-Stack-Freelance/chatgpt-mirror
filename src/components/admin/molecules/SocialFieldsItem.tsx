"use client";

/**
 * @file src/components/admin/molecules/SocialFieldsItem.tsx
 * @intro Ligne éditable d’un lien social (plateforme + lien + actions)
 * @layer ui/molecules
 */

import { NewSocialLinkField } from "@/components/admin/molecules/fields/NewSocialLinkField";
import { SelectField } from "@/components/admin/molecules/fields/SelectField";
import { Button } from "@/components/ui/button";
import { SOCIAL_KIND_EMAIL } from "@/core/domain/site/social/constants";
import { useI18n } from "@/i18n/context";
import { makeSocialKindOptions } from "@/i18n/factories/admin/social";
import { normalizeSocialHref } from "@/lib/normalize";
import type { SocialItemInput } from "@/schemas/site/social/social";
import { useMemo } from "react";

type SocialFieldsItemProps = Readonly<{
  idPrefix: string;
  index: number;
  item: SocialItemInput;

  onPatch: (patch: Partial<SocialItemInput>) => void; // ← harmonisé
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;

  isFirst?: boolean;
  isLast?: boolean;
  disabled?: boolean;

  /** Optionnel : border rouge si touched+invalid côté Section */
  invalidHref?: boolean;
}>;

export function SocialFieldsItem({
  idPrefix,
  index,
  item,
  onPatch,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  disabled = false,
  invalidHref,
}: SocialFieldsItemProps) {
  const { t } = useI18n();
  const baseId = `${idPrefix}-${index}`;

  const options = useMemo(() => makeSocialKindOptions(t), [t]);
  const isEmail = item.kind === SOCIAL_KIND_EMAIL;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <SelectField
          id={`${baseId}-kind`}
          label={t("admin.social.platform")}
          value={item.kind}
          onChange={(v) => {
            const nextKind = v as SocialItemInput["kind"];
            onPatch({
              kind: nextKind,
              href: normalizeSocialHref(nextKind, item.href),
            });
          }}
          items={options}
          placeholder={t("admin.social.platformPlaceholder")}
          disabled={disabled}
        />

        {/* Champ lien spécialisé : mailto vs https */}
        <div className="sm:col-span-2">
          <NewSocialLinkField
            id={`${baseId}-href`}
            isEmail={isEmail}
            href={item.href}
            invalid={invalidHref}
            disabled={disabled}
            onPatch={onPatch} // Item → Field reste onPatch
            placeholderEmail={t("admin.social.placeholder.link.email")}
            placeholderUrl={t("admin.social.placeholder.link.url")}
            helpEmail={t("admin.social.help.link.email")}
            helpUrl={t("admin.social.help.link.url")}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveUp}
            disabled={isFirst || disabled}
            aria-label={t("admin.social.actions.moveUp")}
            title={t("admin.social.actions.moveUp")}
          >
            {t("admin.social.actions.moveUp")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveDown}
            disabled={isLast || disabled}
            aria-label={t("admin.social.actions.moveDown")}
            title={t("admin.social.actions.moveDown")}
          >
            {t("admin.social.actions.moveDown")}
          </Button>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          disabled={disabled}
          aria-label={t("admin.social.actions.delete")}
          title={t("admin.social.actions.delete")}
        >
          {t("admin.social.actions.delete")}
        </Button>
      </div>
    </div>
  );
}
