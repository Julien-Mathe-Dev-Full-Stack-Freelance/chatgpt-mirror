"use client";

/**
 * @file src/components/admin/molecules/HintList.tsx
 * @intro Liste de messages d’aide (info, warning, success, error)
 */

import { cn } from "@/lib/cn";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useId, type ReactNode } from "react";

type Variant = "info" | "warning" | "success" | "error";

const VARIANT_STYLES: Record<Variant, string> = {
  info: "border-blue-300 bg-blue-50 text-blue-900",
  warning: "border-amber-300 bg-amber-50/60 text-amber-900",
  success: "border-emerald-300 bg-emerald-50 text-emerald-900",
  error: "border-red-300 bg-red-50 text-red-900",
};

const VARIANT_ICON: Record<Variant, ReactNode> = {
  info: <Info className="size-4" aria-hidden="true" />,
  warning: <AlertTriangle className="size-4" aria-hidden="true" />,
  success: <CheckCircle2 className="size-4" aria-hidden="true" />,
  error: <XCircle className="size-4" aria-hidden="true" />,
};

type HintListProps = {
  hints?: ReadonlyArray<ReactNode>;
  title?: ReactNode;
  variant?: Variant;
  dense?: boolean;
  className?: string;
  /** A11y: rôle du container (par défaut: error→alert, sinon→status) */
  role?: "status" | "alert" | "note";
  /** A11y: aria-live (par défaut: error→assertive, sinon→polite) */
  ariaLive?: "polite" | "assertive";
};

export function HintList({
  hints = [],
  title,
  variant = "warning",
  dense = false,
  className,
  role,
  ariaLive,
}: HintListProps) {
  const titleId = useId();
  if (!hints || hints.length === 0) return null;

  const computedRole = role ?? (variant === "error" ? "alert" : "status");
  const live = ariaLive ?? (variant === "error" ? "assertive" : "polite");

  return (
    <div
      role={computedRole}
      aria-live={live}
      aria-atomic="true"
      aria-labelledby={title ? titleId : undefined}
      className={cn(
        "rounded-md border p-3",
        "flex flex-col gap-2",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {(title || variant) && (
        <div className="flex items-center gap-2">
          <span>{VARIANT_ICON[variant]}</span>
          {title ? (
            <p id={titleId} className="text-sm font-medium">
              {title}
            </p>
          ) : null}
        </div>
      )}

      <ul
        className={cn(
          "list-disc pl-5",
          dense ? "space-y-0.5 text-[13px]" : "space-y-1 text-sm"
        )}
      >
        {hints.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
