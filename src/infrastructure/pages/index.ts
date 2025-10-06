/**
 * @file src/infrastructure/pages/index.ts
 * @intro Factory/Singleton du `PagesRepository` (override via env)
 * @layer infrastructure
 */

import type { PagesRepository } from "@/core/domain/pages/ports/pages-repository";
import { FileSystemPagesRepository } from "@/infrastructure/pages/file-system-pages-repository";
import { InMemoryPagesRepository } from "@/infrastructure/pages/in-memory-pages-repository";
import { log } from "@/lib/log";

const lg = log.child({ ns: "infra:pages", factory: "pagesRepo" });

let repo: PagesRepository | null = null;
let inited = false;

function createRepo(): PagesRepository {
  const impl = (process.env["PAGES_REPO_IMPL"] ?? "fs").toLowerCase();
  if (impl === "memory") {
    lg.debug("pages.repository.init", { impl: "memory" });
    return new InMemoryPagesRepository();
  }
  // impl === "fs" (défaut)
  const root = process.env["CONTENT_ROOT"] ?? undefined;
  lg.debug("pages.repository.init", {
    impl: "fs",
    root: root ?? "(cwd)/content",
  });
  return new FileSystemPagesRepository(root);
}

/** Retourne l’implémentation par défaut du `PagesRepository` (lazy) */
export function getPagesRepository(): PagesRepository {
  if (!repo) {
    repo = createRepo();
    inited = true;
  } else if (!inited) {
    // garde HMR très conservative
    lg.debug("pages.repository.reuse");
    inited = true;
  }
  return repo;
}
