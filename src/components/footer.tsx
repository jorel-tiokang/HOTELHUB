import * as React from "react";
import { ChevronDown, Mail, Globe } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiWhatsapp
} from "@icons-pack/react-simple-icons";
import { useTranslations } from "next-intl";


// Types
interface FooterLink {
  label: string;
  href: string;
}
interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Data
const COMPANY_LINKS: FooterLink[] = [
  {
    label: "Emploi",
    href: "#",
  },
  {
    label: "Presse",
    href: "#",
  },
  {
    label: "Relations investisseur",
    href: "#",
  },
  {
    label: "Appli mobile",
    href: "#",
  },
  {
    label: "hotelhub pour hoteliers",
    href: "#",
  },
  {
    label: "Affiliation",
    href: "#",
  },
];
const HELP_LEGAL_LINKS: FooterLink[] = [
  {
    label: "Apprendre comment hotelhub fonctionne",
    href: "#",
  },
  {
    label: "Termes et conditions",
    href: "#",
  },
  {
    label: "Information légale",
    href: "#",
  },
  {
    label: "Vos choix privées",
    href: "#",
  },
  {
    label: "Notice privée",
    href: "#",
  },
  {
    label: "Information DSA",
    href: "#",
  },
  {
    label: "Close de vulnérabilité",
    href: "#",
  },
];
const SOCIAL_LINKS = [
  {
    icon: SiFacebook,
    label: "Facebook",
    href: "#",
  },
  {
    icon: SiWhatsapp,
    label: "Whatsapp",
    href: "#",
  },
  {
    icon: SiInstagram,
    label: "Instagram",
    href: "#",
  },
  {
    icon: SiYoutube,
    label: "YouTube",
    href: "#",
  },
];

// Sub-components

const LanguageSelector = () => (
  <button
    type="button"
    className="flex items-center gap-3 px-4 py-2 mt-6 border border-white/20 rounded hover:bg-white/5 transition-colors text-white text-sm"
  >
    <div className="flex items-center gap-2">
      <span role="img" aria-label="USA Flag" className="text-lg leading-none">
        🇺🇸
      </span>
      <span className="font-medium">USA</span>
    </div>
    <ChevronDown className="w-4 h-4 text-gray-400" />
  </button>
);
const FooterColumn = ({ title, links }: FooterColumn) => (
  <div className="flex flex-col gap-4">
    <h3 className="dark:text-white text-black font-bold text-base">{title}</h3>
    <ul className="flex flex-col gap-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="dark:text-white/60 text-black/60 dark:hover:text-white hover:text-black transition-colors text-[15px] leading-relaxed"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer: React.FC = () => {
  const t = useTranslations("footer");
  return (
    <footer className="w-full backdrop-blur-2xl bg-gradient-to-b from-[color-var(--charcoal)] to-purple/20 dark:text-white/90 text-black/90 font-medium selection:bg-purple/40 selection:text-white border-t-2 border-purple/10 dark:border-t-0">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Column 1: Logo & Language */}
          <div className="flex items-center gap-6">
            <img
              src="/hotelhublogo.png"
              alt="HotelHub Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
            {/* Shifted the logo text to purple to match the new theme */}
            <h1 className="text-(--purple) text-3xl font-black tracking-tighter leading-none">
              HOTELHUB
            </h1>
            {/*<LanguageSelector />*/}
          </div>

          {/* Column 2: Company */}
          <FooterColumn title="Entreprise" links={COMPANY_LINKS} />

          {/* Column 3: Help & Legal */}
          <FooterColumn title="Aide & Légale" links={HELP_LEGAL_LINKS} />
        </div>
      </div>

      {/* Social Media Bar */}
      {/* Softened the border to blend with the purple gradient */}
      <div className="border-t border-(--purple)/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-7xl mx-auto text-center md:text-left">
            <p className="text-[11px] tracking-wide dark:text-white/60 text-black/60 uppercase font-bold">
              {t("copyright")}
            </p>
          </div>
          <div className="flex items-center gap-6 md:ml-auto">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="dark:text-white/60 text-black/60 hover:text-purple transition-all transform hover:scale-110 duration-300"
                aria-label={item.label}
              >
                <item.icon className="w-6 h-6" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};