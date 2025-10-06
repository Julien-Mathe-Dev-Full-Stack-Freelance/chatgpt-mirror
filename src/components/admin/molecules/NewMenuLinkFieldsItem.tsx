"use client";

/**
 * @file src/components/admin/molecules/NewMenuLinkFieldsItem.tsx
 * @intro Ligne éditable d’un lien (menu + social)
 */

import { InputField } from "@/components/admin/molecules/fields/InputField";
import { SwitchField } from "@/components/admin/molecules/fields/SwitchField";
import { MenuBadges } from "@/components/admin/molecules/MenuBadges";
import { useI18n } from "@/i18n/context";
import { toExternalDraft, toInternalDraft } from "@/lib/normalize";
import { useEffect, useMemo, useState } from "react";

type MenuItemLike = Readonly<{
  label: string;
  href: string;
  newTab: boolean;
  isExternal: boolean;
  children?: ReadonlyArray<unknown>;
  id?: string;
}>;

type NewLinkFieldsItemProps<TItem extends MenuItemLike> = Readonly<{
  id: string;
  item: TItem;
  disabled?: boolean;
  onPatch: (patch: Partial<TItem>) => void;
  onBlurValidate?: () => void;
  invalid?: boolean;
}>;

export function NewMenuLinkFieldsItem<TItem extends MenuItemLike>({
  id,
  item,
  disabled,
  onPatch,
  onBlurValidate,
  invalid,
}: NewLinkFieldsItemProps<TItem>) {
  const { t } = useI18n();
  const hrefStr = String(item.href ?? "");

  const [hrefDraft, setHrefDraft] = useState<string>(
    item.isExternal ? toExternalDraft(hrefStr) : toInternalDraft(hrefStr)
  );

  useEffect(() => {
    const next = item.isExternal
      ? toExternalDraft(hrefStr)
      : toInternalDraft(hrefStr);
    setHrefDraft((prev) => (prev === next ? prev : next));
  }, [hrefStr, item.isExternal]);

  const commitHrefFromDraft = () => {
    const normalized = item.isExternal
      ? toExternalDraft(hrefDraft)
      : toInternalDraft(hrefDraft);
    onPatch({ href: normalized } as Partial<TItem>);
  };

  const handleModeChange = (checked: boolean) => {
    const nx = checked
      ? toExternalDraft(hrefDraft)
      : toInternalDraft(hrefDraft);
    setHrefDraft(nx);
    onPatch({
      isExternal: checked,
      newTab: checked,
      href: nx,
    } as Partial<TItem>);
    onBlurValidate?.();
  };

  const linkTypeAria = useMemo(() => t("admin.menu.linkType.arialabel"), [t]);

  return (
    <div className="space-y-1.5">
      <InputField
        id={`${id}-href`}
        label={t("admin.menu.link")}
        value={hrefDraft}
        onChange={(v) => {
          const nx = item.isExternal ? toExternalDraft(v) : toInternalDraft(v);
          setHrefDraft(nx);
          onPatch({ href: nx } as Partial<TItem>);
        }}
        onBlur={() => {
          commitHrefFromDraft();
          onBlurValidate?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitHrefFromDraft();
            onBlurValidate?.();
          }
        }}
        disabled={disabled}
        invalid={invalid}
      />

      <div className="flex items-center justify-between pt-1">
        <SwitchField
          id={`${id}-linktype`}
          label={t("admin.menu.linkType.external")}
          help={t("admin.menu.linkType.help")}
          checked={item.isExternal}
          onCheckedChange={handleModeChange}
          disabled={disabled}
          aria-label={linkTypeAria}
        />
        <MenuBadges item={{ ...item, href: hrefDraft }} />
      </div>

      <div className="flex w-full flex-col pt-1">
        <SwitchField
          id={`${id}-newtab`}
          label={t("admin.menu.newTab.label")}
          help={t("admin.menu.newTab.help")}
          checked={item.newTab}
          onCheckedChange={(v) => onPatch({ newTab: v } as Partial<TItem>)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
