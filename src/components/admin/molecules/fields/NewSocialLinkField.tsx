"use client";

import { InputField } from "@/components/admin/molecules/fields/InputField";
import { useI18n } from "@/i18n/context";
import { toExternalDraft, toMailtoDraft } from "@/lib/normalize";
import { useEffect, useMemo, useState } from "react";

type NewSocialLinkFieldProps = Readonly<{
  id: string;
  isEmail: boolean;
  href: string;
  onPatch: (patch: { href: string }) => void;
  onBlurValidate?: () => void;
  invalid?: boolean;
  disabled?: boolean;
  placeholderEmail?: string;
  placeholderUrl?: string;
  helpEmail?: string;
  helpUrl?: string;
}>;

export function NewSocialLinkField({
  id,
  isEmail,
  href,
  onPatch,
  onBlurValidate,
  invalid,
  disabled,
  placeholderEmail,
  placeholderUrl,
  helpEmail,
  helpUrl,
}: NewSocialLinkFieldProps) {
  const { t } = useI18n();

  const [hrefDraft, setHrefDraft] = useState<string>(() =>
    isEmail ? toMailtoDraft(href) : toExternalDraft(href)
  );

  useEffect(() => {
    setHrefDraft(isEmail ? toMailtoDraft(href) : toExternalDraft(href));
  }, [href, isEmail]);

  const commitHrefFromDraft = () => {
    const normalized = isEmail
      ? toMailtoDraft(hrefDraft)
      : toExternalDraft(hrefDraft);
    onPatch({ href: normalized });
  };

  const inputType = useMemo<React.HTMLInputTypeAttribute>(
    () => (isEmail ? "text" : "url"),
    [isEmail]
  );
  const inputMode = useMemo<
    React.HTMLAttributes<HTMLInputElement>["inputMode"]
  >(() => (isEmail ? "email" : "url"), [isEmail]);

  return (
    <div className="space-y-1.5">
      <InputField
        id={`${id}-href`}
        label={t("admin.social.link")}
        value={hrefDraft}
        onChange={(v) => {
          const nx = isEmail ? toMailtoDraft(v) : toExternalDraft(v);
          setHrefDraft(nx);
          onPatch({ href: nx });
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
        placeholder={isEmail ? placeholderEmail : placeholderUrl}
        help={isEmail ? helpEmail : helpUrl}
        type={inputType}
        inputMode={inputMode}
        aria-invalid={invalid ? true : undefined}
        disabled={disabled}
        invalid={invalid}
      />
    </div>
  );
}
