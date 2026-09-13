import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

import istadLogo from "../../assets/Website/istad-logo.png";

const quickLinks = [
  "Home",
  "Community Q&A",
  "Lost & Found",
  "About",
];

const legalLinks = [
  "Contact",
  "Privacy Policy",
  "Terms of Service",
  "Legal",
];

export default function FooterComponent() {
  const socialLinks = [
    {
      label: "Facebook",
      icon: FaFacebookF,
    },
    {
      label: "Twitter",
      icon: FaTwitter,
    },
    {
      label: "Instagram",
      icon: FaInstagram,
    },
    {
      label: "LinkedIn",
      icon: FaLinkedinIn,
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-brand-primary-dark text-gray-300 transition-colors duration-300 dark:bg-black">
      {/* Background vertical pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.08) 38px, rgba(255,255,255,0.08) 40px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-14">
        <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-sm font-bold text-white">
                A
              </span>

              <span className="text-lg font-semibold text-white">
                Ask &amp; Found
              </span>
            </div>

            <p className="max-w-[220px] text-sm leading-relaxed text-gray-400">
              We are a leading company dedicated to products and services to
              cater to their needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
              QUICK LINK
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-brand-secondary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
              QUICK LINK
            </h3>

            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-brand-secondary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
              ADDRESS &amp; CONTACT
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-secondary"
                />

                <span>
                  #40, St 273, Sangkat Boeung Kak II, Khan Toul Kork, Phnom
                  Penh, Cambodia
                </span>
              </li>

              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone
                  size={16}
                  className="shrink-0 text-brand-secondary"
                />

                <span>
                  (+855) 95-990-910
                </span>
              </li>

              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail
                  size={16}
                  className="shrink-0 text-brand-secondary"
                />

                <span>
                  info.istad@gmail.com
                </span>
              </li>
            </ul>
          </div>

          {/* Sponsor */}
          <div className="self-start">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white">
            ORGANIZED AND SPONSORED BY 
            </h3>

            <img
              src={istadLogo}
              alt="ISTAD logo"
              className="block h-auto w-auto max-w-full object-contain"
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="order-2 text-xs text-gray-500 sm:order-1">
            © 2026 AskKH. All rights reserved.
          </p>

          <div className="order-1 flex items-center gap-3 sm:order-2">
            {socialLinks.map(
              ({
                icon: Icon,
                label,
              }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors duration-200 hover:bg-brand-secondary hover:text-white"
                >
                  <Icon size={13} />
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}