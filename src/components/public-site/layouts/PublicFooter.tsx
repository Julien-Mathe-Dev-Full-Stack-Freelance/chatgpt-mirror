// "use client";

// /**
//  * @file src/components/public-site/layouts/PublicFooter.tsx
//  * @intro Footer public (rendu réel côté client)
//  * @layer public/layout
//  */

// import Image from "next/image";

// import type {
//   FooterSettingsDTO,
//   LegalMenuSettingsDTO,
// } from "@/core/domain/site/dto";
// import { useI18n } from "@/i18n/context";
// import { cn } from "@/lib/cn";
// import { toStableKey } from "@/lib/guards";

// type PublicFooterProps = {
//   /** Réglages de footer. */
//   settings: FooterSettingsDTO;
//   /** Menu légal (items ordonnés). */
//   legalMenu: LegalMenuSettingsDTO | null;
//   /** Titre de l'identité (pour alt logo). */
//   identityTitle?: string | null;
//   /** Logo de l'identité (source de vérité). */
//   identityLogoUrl?: string | null;
//   /** État de chargement externe (optionnel, géré par le parent). */
//   legalLoading?: boolean;
//   /** Neutraliser la navigation (texte-only) pour l’aperçu admin. */
//   disableNav?: boolean;
// };

// /**
//  * Footer public minimal (UI pure, stateless).
//  * @returns Un `<footer>` accessible, aligné sur les réglages fournis.
//  */
// export function PublicFooter({
//   settings,
//   legalMenu,
//   identityTitle,
//   identityLogoUrl,
//   legalLoading = false,
//   disableNav = false,
// }: PublicFooterProps) {
//   const { t } = useI18n();
//   const YEAR_UTC = new Date().getUTCFullYear();

//   const logoSrc = identityLogoUrl?.trim() || null;
//   const logoAlt =
//     identityTitle?.trim() || t("public.footer.logoAlt") || "Logo du site";

//   return (
//     <footer
//       aria-label={t("public.footer.aria") || "Pied de page"}
//       className={cn(bg, border, height, "w-full")}
//     >
//       <div
//         className={cn(
//           "mx-auto flex h-full items-center justify-between px-4",
//           container
//         )}
//       >
//         {/* Marque (logo optionnel) */}
//         <div className="flex items-center gap-2">
//           {logoSrc && (
//             <div className="relative h-6 w-auto max-w-[96px] overflow-hidden">
//               <Image
//                 src={logoSrc}
//                 alt={logoAlt}
//                 width={96}
//                 height={24}
//                 className="h-6 w-auto"
//                 priority={false}
//               />
//             </div>
//           )}
//         </div>

//         {/* Droite : copyright + liens légaux */}
//         <div className="flex items-center gap-3">
//           <div className="text-xs text-muted-foreground">
//             <span>©</span>
//             {settings.copyrightShowYear ? (
//               <>
//                 {" "}
//                 <time dateTime={String(YEAR_UTC)}>{YEAR_UTC}</time>
//               </>
//             ) : null}
//             {settings.copyright
//               ? ` ${settings.copyright}`
//               : ` ${t("public.footer.rights")}`}
//           </div>

//           <nav
//             aria-label={t("public.footer.legalNav") || "Liens légaux"}
//             className="text-xs"
//           >
//             {legalLoading ? (
//               <span className="text-muted-foreground opacity-60">
//                 {t("public.common.loading") || "Chargement…"}
//               </span>
//             ) : legalMenu?.items?.length ? (
//               <ul
//                 role="list"
//                 className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground"
//               >
//                 {legalMenu.items.map((it, i) => (
//                   <li
//                     key={toStableKey([it.label, it.href], i)}
//                     className="inline-flex items-center gap-1"
//                   >
//                     {disableNav ? (
//                       <>
//                         <span className="font-medium text-foreground">
//                           {it.label}
//                         </span>
//                         <span className="opacity-60">
//                           ({it.href}
//                           {it.newTab ? ", _blank" : ""})
//                         </span>
//                       </>
//                     ) : (
//                       <a
//                         href={it.href}
//                         {...(it.newTab
//                           ? { target: "_blank", rel: "noreferrer noopener" }
//                           : {})}
//                         className="font-medium text-foreground hover:opacity-80"
//                       >
//                         {it.label}
//                       </a>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <span className="text-muted-foreground opacity-60">
//                 {t("public.common.none") || "Aucun lien"}
//               </span>
//             )}
//           </nav>
//         </div>
//       </div>
//     </footer>
//   );
// }
