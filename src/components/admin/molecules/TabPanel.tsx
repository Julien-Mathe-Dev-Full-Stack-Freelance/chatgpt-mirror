"use client";

/**
 * @file src/components/admin/molecules/TabPanel.tsx
 * @intro Wrapper uniforme pour contenu d’onglet
 * @description Standardise l’espacement. Rôles gérés par shadcn/ui.
 * Observabilité : Aucune.
 * @layer ui/molecules
 */

import { TabsContent } from "@/components/ui/tabs";
import { ATOM } from "@/infrastructure/ui/atoms";

type TabPanelProps = {
  value: string;
  children: React.ReactNode;
};

export function TabPanel({ value, children }: TabPanelProps) {
  return (
    <TabsContent value={value} className={ATOM.space.sectionGap}>
      {children}
    </TabsContent>
  );
}
