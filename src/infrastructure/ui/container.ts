/**
 * @file src/infrastructure/ui/container.ts
 * @intro Adapter UI — mapping ContainerKey → classes CSS
 * @layer infra/ui
 */
import type { ContainerKey } from "@/core/domain/constants/theme";

/** Exemple Tailwind ; ajuste selon ton design system. */
export const CONTAINER_CLASS: Record<ContainerKey, string> = {
  narrow: "mx-auto w-full max-w-screen-md px-4",
  normal: "mx-auto w-full max-w-screen-xl px-6",
  wide: "mx-auto w-full max-w-screen-2xl px-8",
  full: "w-full", // pleine largeur
};
