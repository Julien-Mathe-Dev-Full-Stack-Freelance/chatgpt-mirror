"use client";

/**
 * @file src/components/admin/molecules/SocialFieldsItem.tsx
 * @intro Ligne éditable d’un lien social
 * @description Plateforme + lien + actions Monter/Descendre/Supprimer.
 * Observabilité : Aucune.
 * @layer ui/molecules
 */

import { InputField } from "@/components/admin/molecules/fields/InputField";
import { SelectField } from "@/components/admin/molecules/fields/SelectField";
import { Button } from "@/components/ui/button";
import type { SocialItemDTO } from "@/core/domain/site/dto";
import { SOCIAL_KIND_EMAIL } from "@/core/domain/site/social/constants";
import { brandHrefSafe } from "@/core/domain/urls/href";
import { useI18n } from "@/i18n/context";
import { makeSocialKindOptions } from "@/i18n/factories/admin/social";
import { useMemo } from "react";

export type SocialFieldsItemProps = {
  idPrefix: string;
  index: number;
  item: SocialItemDTO;

  onChange: (patch: Partial<SocialItemDTO>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;

  isFirst?: boolean;
  isLast?: boolean;
  disabled?: boolean;
};

export function SocialFieldsItem({
  idPrefix,
  index,
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  disabled = false,
}: SocialFieldsItemProps) {
  const { t } = useI18n();
  const baseId = `${idPrefix}-${index}`;
  const isEmail = item.kind === SOCIAL_KIND_EMAIL;
  const options = useMemo(() => makeSocialKindOptions(t), [t]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <SelectField
          id={`${baseId}-kind`}
          label={t("admin.social.ui.platform")}
          value={item.kind}
          onChange={(v) => onChange({ kind: v as SocialItemDTO["kind"] })}
          items={options}
          placeholder={t("admin.social.ui.platformPlaceholder")}
          disabled={disabled}
        />

        <InputField
          id={`${baseId}-href`}
          label={t("admin.social.ui.link")}
          value={item.href}
          onChange={(v) => onChange({ href: brandHrefSafe(v, item.href) })}
          // `mailto:` complet → type="email" refuserait la valeur.
          type={isEmail ? "text" : "url"}
          inputMode={isEmail ? "email" : "url"}
          placeholder={
            isEmail
              ? t("admin.social.ui.linkPlaceholder.email")
              : t("admin.social.ui.linkPlaceholder.url")
          }
          help={
            isEmail
              ? t("admin.social.ui.linkHelp.email")
              : t("admin.social.ui.linkHelp.url")
          }
          disabled={disabled}
        />

        <div className="hidden sm:block" />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveUp}
            disabled={isFirst || disabled}
            aria-label={t("admin.social.ui.moveUp.aria")}
            title={t("admin.social.ui.moveUp.title")}
          >
            {t("admin.social.ui.moveUp.title")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onMoveDown}
            disabled={isLast || disabled}
            aria-label={t("admin.social.ui.moveDown.aria")}
            title={t("admin.social.ui.moveDown.title")}
          >
            {t("admin.social.ui.moveDown.title")}
          </Button>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          disabled={disabled}
          aria-label={t("admin.social.ui.delete.aria")}
          title={t("admin.social.ui.delete.title")}
        >
          {t("admin.social.ui.delete.title")}
        </Button>
      </div>
    </div>
  );
}
