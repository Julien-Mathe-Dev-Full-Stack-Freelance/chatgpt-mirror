// "use client";

// /**
//  * @file src/components/public-site/layouts/PublicHeader.tsx
//  * @intro Header public (rendu réel côté client)
//  * @layer public/layout
//  */

// import Image from "next/image";

// import type {
//   HeaderSettingsDTO,
//   IdentitySettingsDTO,
//   PrimaryMenuSettingsDTO,
//   SocialSettingsDTO,
// } from "@/core/domain/site/dto";
// import { useI18n } from "@/i18n/context";
// import { cn } from "@/lib/cn";
// import { toStableKey } from "@/lib/guards";
// import { headerPreviewClasses } from "@/lib/ui/header-preview-classes";
// import {
//   socialBrandIcon,
//   socialGenericIcon,
//   socialKindLabel,
// } from "@/lib/ui/social-preview-helpers";

// type PublicHeaderProps = {
//   /** Réglages (sticky, blur, hauteur, conteneur). */
//   settings: HeaderSettingsDTO;
//   /** Identité du site (titre + logoUrl). */
//   identity: IdentitySettingsDTO;
//   /** Menu principal (items ordonnés). */
//   menu: PrimaryMenuSettingsDTO;
//   /** Réseaux sociaux (items ordonnés). */
//   social: SocialSettingsDTO;
//   /** Indicateur de chargement externe (si piloté par le parent). */
//   loading?: boolean;
//   /** Neutraliser la navigation pour l’aperçu admin. */
//   disableNav?: boolean;
// };

// /**
//  * Header public minimal (UI pure, stateless).
//  * @returns Un `<header>` accessible, aligné sur les réglages fournis.
//  */
// export function PublicHeader({
//   settings,
//   identity,
//   menu,
//   social,
//   loading = false,
//   disableNav = false,
// }: PublicHeaderProps) {
//   const { t } = useI18n();
//   const { height, container, sticky, bg } = headerPreviewClasses(settings);
//   const identityTitle = identity.title?.trim();

//   return (
//     <header
//       aria-label={t("public.header.aria") || "En-tête du site"}
//       aria-busy={loading || undefined}
//       className={cn(sticky, bg, height, "w-full")}
//     >
//       <div
//         className={cn(
//           "mx-auto flex h-full items-center justify-between px-4",
//           container
//         )}
//       >
//         {/* Logo / Titre ← identité */}
//         <div className="flex items-center gap-2">
//           {identity.logoLightUrl ? (
//             <div className="relative h-6 w-auto max-w-[96px] overflow-hidden">
//               <Image
//                 src={identity.logoLightUrl}
//                 alt={
//                   identityTitle || t("public.header.logoAlt") || "Logo du site"
//                 }
//                 width={96}
//                 height={24}
//                 className="h-6 w-auto"
//                 priority={false}
//               />
//             </div>
//           ) : (
//             <span className="font-semibold tracking-tight text-foreground">
//               {identity.title || t("public.common.siteDefault") || "Mon site"}
//             </span>
//           )}
//         </div>

//         {/* Navigation + Réseaux */}
//         {loading ? (
//           <span
//             className="text-sm text-muted-foreground opacity-60"
//             role="status"
//             aria-live="polite"
//           >
//             {t("public.common.loading") || "Chargement…"}
//           </span>
//         ) : (
//           <div className="flex items-center gap-4">
//             {/* Menu principal */}
//             {menu?.items?.length ? (
//               <nav aria-label={t("public.header.mainNav") || "Menu principal"}>
//                 <ul
//                   role="list"
//                   className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"
//                 >
//                   {menu.items.map((it, i) => (
//                     <li
//                       key={toStableKey([it.label, it.href], i)}
//                       className="inline-flex items-center gap-1"
//                     >
//                       {disableNav ? (
//                         <>
//                           <span className="font-medium text-foreground">
//                             {it.label}
//                           </span>
//                           <span className="opacity-60">
//                             ({it.href}
//                             {it.newTab ? ", _blank" : ""})
//                           </span>
//                         </>
//                       ) : (
//                         <a
//                           href={it.href}
//                           {...(it.newTab
//                             ? { target: "_blank", rel: "noreferrer noopener" }
//                             : {})}
//                           className="font-medium text-foreground hover:opacity-80"
//                         >
//                           {it.label}
//                         </a>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </nav>
//             ) : (
//               <nav
//                 aria-label={t("public.header.mainNav") || "Menu principal"}
//                 className="text-sm text-muted-foreground opacity-60"
//               >
//                 {t("public.common.none") || "Aucun lien"}
//               </nav>
//             )}

//             {/* Réseaux sociaux (icône + label) */}
//             {social?.items?.length ? (
//               <nav
//                 aria-label={t("public.header.socialNav") || "Réseaux sociaux"}
//                 className="text-sm"
//               >
//                 <ul
//                   role="list"
//                   className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground"
//                 >
//                   {social.items.map((it, i) => {
//                     const Brand = socialBrandIcon(it.kind) ?? null;
//                     const Icon = Brand ?? socialGenericIcon(it.kind);
//                     const content = (
//                       <>
//                         {Brand ? (
//                           <Brand size={16} aria-hidden="true" />
//                         ) : (
//                           <Icon className="h-4 w-4" aria-hidden="true" />
//                         )}
//                         <span className="opacity-70">
//                           {socialKindLabel(it.kind, t)}
//                         </span>
//                       </>
//                     );

//                     return (
//                       <li
//                         key={toStableKey([it.kind, it.href], i)}
//                         className="inline-flex items-center gap-2"
//                         title={it.href}
//                       >
//                         {disableNav ? (
//                           content
//                         ) : (
//                           <a
//                             href={it.href}
//                             target="_blank"
//                             rel="noreferrer noopener"
//                             className="inline-flex items-center gap-2 opacity-80 hover:opacity-100"
//                           >
//                             {content}
//                           </a>
//                         )}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </nav>
//             ) : null}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
