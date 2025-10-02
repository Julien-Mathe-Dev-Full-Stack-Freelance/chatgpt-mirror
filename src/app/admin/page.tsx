/**
 * @file src/app/admin/page.tsx
 * @intro Vue d’accueil de l’interface d’administration (Dashboard)
 * @description
 * Monte `AdminTabs` pour organiser les sections clés (Overview, Header, Menu, Footer, Pages, Blocks).
 * L’onglet actif est persistant via `?tab=...` (deeplink, refresh, partage).
 *
 * @layer ui
 * @remarks
 * - Le layout admin fournit déjà le conteneur et les espacements : pas de wrapper supplémentaire.
 * - H1 unique, landmarks sémantiques, navigation clavier (skip-link géré par <AdminHeader />).
 */

import { Dashboard } from "@/components/admin/pages/Dashboard";
import { getRequestT } from "@/i18n/server";

/**
 * Page d’administration (Dashboard).
 * @returns JSX.Element — Section principale du dashboard admin (titre + onglets).
 */
export default async function AdminPage({
  searchParams,
}: Readonly<{ searchParams: Record<string, string | string[] | undefined> }>) {
  const t = await getRequestT();
  const params = await searchParams; // ✅ attendre ici
  const rawTab = params?.["tab"]; // ✅ on lit après
  const initialTab = Array.isArray(rawTab) ? rawTab.at(-1) : rawTab;
  return (
    <section aria-labelledby="admin-title" className="space-y-6">
      <h1
        id="admin-title"
        className="text-xl md:text-2xl font-semibold tracking-tight"
      >
        {t("admin.dashboard.title")}
      </h1>
      <Dashboard initialTab={initialTab} />
    </section>
  );
}
