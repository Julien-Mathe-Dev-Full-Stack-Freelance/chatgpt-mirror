// "use client";

// /**
//  * @file src/components/admin/previews/SocialPreview.tsx
//  * @intro Aperçu des liens sociaux (icône + libellé)
//  * @description
//  * Affiche la liste des réseaux sociaux configurés avec leur icône Tabler/Lucide
//  * et le libellé humain. Composant de prévisualisation sans interaction réelle.
//  *
//  * Accessibilité : nav avec `aria-label`, liens neutralisés (`title` uniquement).
//  * Observabilité : aucune (présentation pure).
//  *
//  * @layer ui/previews
//  */

// import { PreviewPanel } from "@/components/admin/molecules/panels/PreviewPanel";
// import type { SocialSettingsDTO } from "@/core/domain/site/dto";
// import { useI18n } from "@/i18n/context";
// import { toStableKey } from "@/lib/guards";
// import {
//   socialBrandIcon,
//   socialGenericIcon,
//   socialKindLabel,
// } from "@/lib/ui/social-preview-helpers";

// function SocialInlinePreview({ settings }: { settings: SocialSettingsDTO }) {
//   const { t } = useI18n();
//   const items = settings.items ?? [];

//   return (
//     <nav aria-label={t("ui.preview.social.ariaLabel")}>
//       <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
//         {items.length > 0 ? (
//           items.map((it, i) => {
//             const Brand = socialBrandIcon(it.kind) ?? null;
//             const Generic = socialGenericIcon(it.kind);
//             const IconComponent = Brand ?? Generic;
//             return (
//               <li
//                 key={toStableKey([it.kind, it.href], i)}
//                 className="inline-flex items-center gap-2"
//                 title={it.href}
//               >
//                 <IconComponent className="h-4 w-4" aria-hidden />
//                 <span className="opacity-70">
//                   {socialKindLabel(it.kind, t)}
//                 </span>
//               </li>
//             );
//           })
//         ) : (
//           <li className="opacity-60">{t("ui.preview.social.empty")}</li>
//         )}
//       </ul>
//     </nav>
//   );
// }

// function SocialPreview({ settings }: { settings: SocialSettingsDTO }) {
//   const { t } = useI18n();
//   return (
//     <PreviewPanel
//       label={t("admin.ui.preview.social.label") || "Social preview"}
//     >
//       <SocialInlinePreview settings={settings} />
//     </PreviewPanel>
//   );
// }
// SocialInlinePreview.displayName = "SocialInlinePreview";
// SocialPreview.displayName = "SocialPreview";
