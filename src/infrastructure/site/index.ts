/**
 * @file src/infrastructure/site/index.ts
 * @intro Factory/Singleton du `SiteRepository` (override via env)
 * @layer infrastructure
 */

import type { SiteRepository } from "@/core/domain/site/ports/site-repository";
import { FileSystemSiteRepository } from "@/infrastructure/site/file-system-site-repository";
import { InMemorySiteRepository } from "@/infrastructure/site/in-memory-site-repository";
import { log } from "@/lib/log";

const lg = log.child({ ns: "infra:site", factory: "siteRepo" });

let repo: SiteRepository | null = null;
let inited = false;

function createRepo(): SiteRepository {
  const impl = (process.env["SITE_REPO_IMPL"] ?? "fs").toLowerCase();
  if (impl === "memory") {
    lg.debug("site.repository.init", { impl: "memory" });
    return new InMemorySiteRepository();
  }
  // impl === "fs" (défaut)
  const root = process.env["CONTENT_ROOT"] ?? undefined;
  lg.debug("site.repository.init", {
    impl: "fs",
    root: root ?? "(cwd)/content",
  });
  return new FileSystemSiteRepository(root);
}

/** Retourne l’implémentation par défaut du `SiteRepository` (lazy) */
export function getSiteRepository(): SiteRepository {
  if (!repo) {
    repo = createRepo();
    inited = true;
  } else if (!inited) {
    lg.debug("site.repository.reuse");
    inited = true;
  }
  return repo;
}
