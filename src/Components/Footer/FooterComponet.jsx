import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import istadLogo from "../../assets/Website/istad-logo.png";

const quickLinks = ["Home", "Community Q&A", "Lost & Found", "About"];
const Legal = ["Privacy Policy", "Terms & Conditions"];
export default function FooterComponent() {
  return (
    <footer className="relative overflow-hidden bg-brand-primary text-gray-300">
      {/* subtle vertical stripe background, matches reference */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.08) 38px, rgba(255,255,255,0.08) 40px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 items-start">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-secondary text-white font-bold text-sm shrink-0">
                A
              </span>
              <span className="text-lg font-semibold text-white">
                Ask &amp; Found
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-[220px]">
              We are a leading company dedicated to products and services to
              cater to their needs.
            </p>
          </div>

          {/* Quick Link */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide mb-4">
              QUICK LINK
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-brand-secondary transition-colors duration-200 no-underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Link (duplicate, as shown in reference) */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide mb-4">
              LEGAL & POLICIES
            </h3>
            <ul className="space-y-3">
              {Legal.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-brand-secondary transition-colors duration-200 no-underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide mb-4">
              ADDRESS &amp; CONTACT
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

          {/* Organized and Sponsors */}
          <div className="self-start">
            <h3 className="text-white font-semibold text-sm tracking-wide mb-4">
              ORGANIZED AND SPONSORS
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
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 order-2 sm:order-1">
            © 2023 Estrella Inc. All rights reserved
          </p>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-gray-300 hover:bg-brand-secondary hover:text-white transition-colors duration-200"
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