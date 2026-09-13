import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import istadLogo from "../../assets/Website/istad-logo.png";

export default function FooterComponent({ darkMode }) {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("home"), href: "#" },
    { label: t("qaCommunity"), href: "#" },
    { label: t("lostFoundCommunity"), href: "#" },
    { label: t("about"), href: "#" },
  ];

  return (
    <footer
      className={`font-[family-name:var(--font-brand)] relative overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-zinc-950 text-slate-300 border-t border-zinc-800/80"
          : "bg-white text-gray-700 border-t border-gray-200"
      }`}
    >
      {/* subtle vertical stripe background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: darkMode
            ? "repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.05) 38px, rgba(255,255,255,0.05) 40px)"
            : "repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(0,0,0,0.03) 38px, rgba(0,0,0,0.03) 40px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 items-start">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-brand-secondary)] text-white font-bold text-sm shrink-0">
                A
              </span>
              <span
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("footerBrandName")}
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed max-w-[220px] ${
                darkMode ? "text-slate-400" : "text-gray-600"
              }`}
            >
              {t("footerBrandDescription")}
            </p>
          </div>

          {/* Quick Link */}
          <div>
            <h3
              className={`font-semibold text-sm tracking-wide mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("footerQuickLinkTitle")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors duration-200 no-underline ${
                      darkMode
                        ? "text-slate-400 hover:text-[var(--color-brand-secondary)]"
                        : "text-gray-600 hover:text-[var(--color-brand-primary)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Link (duplicate) */}
          <div>
            <h3
              className={`font-semibold text-sm tracking-wide mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("footerQuickLinkTitle")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors duration-200 no-underline ${
                      darkMode
                        ? "text-slate-400 hover:text-[var(--color-brand-secondary)]"
                        : "text-gray-600 hover:text-[var(--color-brand-primary)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Contact */}
          <div>
            <h3
              className={`font-semibold text-sm tracking-wide mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("footerAddressContactTitle")}
            </h3>
            <ul className="space-y-3">
              <li
                className={`flex items-start gap-2.5 text-sm ${
                  darkMode ? "text-slate-400" : "text-gray-600"
                }`}
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--color-brand-secondary)]"
                />
                <span>{t("footerAddress")}</span>
              </li>
              <li
                className={`flex items-center gap-2.5 text-sm ${
                  darkMode ? "text-slate-400" : "text-gray-600"
                }`}
              >
                <Phone
                  size={16}
                  className="shrink-0 text-[var(--color-brand-secondary)]"
                />
                <span>{t("footerPhone")}</span>
              </li>
              <li
                className={`flex items-center gap-2.5 text-sm ${
                  darkMode ? "text-slate-400" : "text-gray-600"
                }`}
              >
                <Mail
                  size={16}
                  className="shrink-0 text-[var(--color-brand-secondary)]"
                />
                <span>{t("footerEmail")}</span>
              </li>
            </ul>
          </div>

          {/* Organized and Sponsors */}
          <div className="self-start">
            <h3
              className={`font-semibold text-sm tracking-wide mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("footerOrganizedTitle")}
            </h3>
            <div className="flex items-center gap-2 mt-0">
              <img
                src={istadLogo}
                alt="ISTAD logo"
                style={{
                  height: "auto",
                  width: "auto",
                  objectFit: "contain",
                  flexShrink: 0,
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode ? "border-zinc-800/80" : "border-gray-200"
          }`}
        >
          <p
            className={`text-xs order-2 sm:order-1 ${
              darkMode ? "text-slate-500" : "text-gray-500"
            }`}
          >
            {t("footerCopyright")}
          </p>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${
                  darkMode
                    ? "bg-zinc-900 text-slate-400 hover:bg-[var(--color-brand-secondary)] hover:text-white border border-zinc-800"
                    : "bg-gray-100 text-gray-600 hover:bg-[var(--color-brand-primary)] hover:text-white"
                }`}
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