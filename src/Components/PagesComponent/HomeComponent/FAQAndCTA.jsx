import ctaBackground from "@/assets/Website/6c7ff7fe28445370734294dd07ed376b.jpg";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function FAQAndCTA({ darkMode }) {
  const { t } = useTranslation();
  const [emailInput, setEmailInput] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const handleCtaSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setStatus("error");
      setMessage(t("emailError"));
      return;
    }
    setStatus("success");
    setMessage(t("emailSuccess").replace("{{email}}", emailInput));
    setEmailInput("");
  };

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative z-10 mt-28 font-[family-name:var(--font-brand)]">
      {/* FAQ Section */}
      <section className="mb-28 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div
            className={`inline-block text-base font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 ${
              darkMode
                ? "bg-zinc-800 text-[var(--home-primary-text)]"
                : "bg-[var(--color-brand-primary-light)] text-[var(--home-primary-text)]"
            }`}
          >
            {t("faqBadge")}
          </div>
          <h2 className="text-5xl md:text-5xl font-bold text-[var(--home-primary-text)] mb-3">
            {t("faqTitle")}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => toggleFAQ(idx)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`backdrop-blur-md rounded-3xl p-6 sm:p-8 cursor-pointer overflow-hidden transition-colors duration-300 ${
                  darkMode
                    ? "bg-zinc-900/90 text-slate-100"
                    : "bg-white/95 text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3
                    className={`text-base sm:text-lg font-bold ${
                      darkMode ? "text-slate-100" : "text-gray-900"
                    }`}
                  >
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 text-[var(--home-primary-text)] p-2 rounded-full ${
                      darkMode
                        ? "bg-zinc-800"
                        : "bg-[var(--color-brand-primary-light)]"
                    }`}
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p
                        className={`text-base leading-relaxed pt-4 border-t ${
                          darkMode
                            ? "border-zinc-800 text-slate-300"
                            : "border-gray-100 text-gray-600"
                        }`}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner Section with Background Image */}
      <section
        style={{
          // PUT YOUR BACKGROUND IMAGE HERE:
          backgroundImage: `url("${ctaBackground}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className={`relative rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center shadow-xl mx-4 sm:mx-6 max-w-7xl lg:mx-auto border transition-colors duration-300 ${
          darkMode ? "border-zinc-800" : "border-gray-800"
        }`}
      >
        {/* Dark overlay so the white text always stands out sharply against any background image */}
        <div className="absolute inset-0 pointer-events-none bg-black/50" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Forced white text color */}
          <h2 className="text-5xl sm:text-5xl font-bold mb-4 tracking-tight max-w-3xl mx-auto leading-normal sm:leading-snug text-white">
            {t("ctaTitle")}
          </h2>
          {/* Forced light gray subtitle color */}
          <p className="text-base sm:text-base mb-8 leading-relaxed max-w-xl mx-auto text-gray-200">
            {t("ctaSubtitle")}
          </p>

          <form
            onSubmit={handleCtaSubmit}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full max-w-md">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="backdrop-blur-md border rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] text-base shadow-inner transition-all bg-white/10 border-white/20 text-white placeholder-gray-300"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[var(--color-brand-primary)] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full text-base transition shadow-lg cursor-pointer flex-shrink-0 w-full sm:w-auto"
              >
                {t("joinUsButton")}
              </motion.button>
            </div>

            {status && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-base font-medium mt-2 ${status === "success" ? "text-emerald-400" : "text-red-400"}`}
              >
                {message}
              </motion.p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
