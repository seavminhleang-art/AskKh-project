import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext.jsx";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

import istadLogo from "../../assets/Website/istad-logo.png";
import nexaLogo from "../../assets/Website/nexa-logo.svg";

export default function FooterComponent() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  const quickLinks = [
    { label: t("footer.quickLinks.home"), to: "/" },
    { label: t("footer.quickLinks.qa"), to: "/community/qa" },
    { label: t("footer.quickLinks.lostFound"), to: "/community/lost-found" },
    { label: t("footer.quickLinks.about"), to: "/about" },
  ];

  const Legal = [
    { label: t("footer.legal.privacy"), to: "/privacy-policy" },
    { label: t("footer.legal.terms"), to: "/terms" },
  ];

  return (
    <footer className={`relative overflow-hidden transition-colors duration-300 ${darkMode ? "bg-zinc-950 text-gray-300" : "bg-brand-primary-dark text-gray-300"}`}>
      {/* subtle vertical stripe background, matches reference */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: darkMode
            ? "repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.05) 38px, rgba(255,255,255,0.05) 40px)"
            : "repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(0,0,0,0.03) 38px, rgba(0,0,0,0.03) 40px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Link to="/" className="flex items-center group py-0.9 shrink-0">
                <img
                  src={nexaLogo}
                  alt="NEXA"
                  className="h-18 w-50 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-[220px]">
              {t("footer.brandDesc")}
            </p>
          </div>

          {/* Quick Link */}
          <div className="no-transition">
            <h3 className="text-white font-semibold text-lg tracking-wide mb-4">
              {t("footer.quickLinksTitle")}
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-brand-secondary transition-all duration-200 no-underline hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="no-transition">
            <h3 className="text-white font-semibold text-lg tracking-wide mb-4">
              {t("footer.legalTitle")}
            </h3>

            <ul className="space-y-3">
              {Legal.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-brand-secondary transition-all duration-200 no-underline hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Contact */}
          <div className="no-transition">
            <h3 className="text-white font-semibold text-lg tracking-wide mb-4">
              {t("footer.contactTitle")}
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-secondary" />
                <span>
                  #40, St 273, Sangkat Boeung Kak II, Khan Toul Kork, Phnom
                  Penh, Cambodia
                </span>
              </li>

              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone size={16} className="shrink-0 text-brand-secondary" />
                <span>(+855) 95-990-910</span>
              </li>

              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail size={16} className="shrink-0 text-brand-secondary" />
                <span>info.istad@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Sponsor */}
          <div className="self-start">
            <h3 className="text-white font-semibold text-lg tracking-wide mb-4">
              {t("footer.organizedTitle")}
            </h3>

            <img
              src={istadLogo}
              alt="ISTAD logo"
              className="block h-auto w-auto max-w-full object-contain"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 order-2 sm:order-1">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-gray-300 hover:bg-brand-secondary hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
