import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HeroSection({ darkMode }) {
  const { t } = useTranslation();
  const [emailInput, setEmailInput] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setSubscribeStatus("error");
      setSubscribeMessage(t("emailError"));
      return;
    }

    setSubscribeStatus("success");
    setSubscribeMessage(t("emailSuccess", { email: emailInput }));
    setEmailInput("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16 relative z-10 font-[family-name:var(--font-brand)] text-center py-12 md:py-16"
    >
      <h1 className="relative text-3xl md:text-5xl font-bold text-[var(--home-primary-text)] mb-2">
        {t("heroTitle1")}
      </h1>
      <h2 className="relative text-2xl md:text-3xl font-semibold text-[var(--home-secondary-text)] mb-4">
        {t("heroTitle2")}
      </h2>

      <p className={`relative max-w-xl mx-auto mb-6 leading-relaxed ${
        darkMode ? "text-slate-300" : "text-[#333333]"
      }`}>
        {t("heroDescription")}
      </p>

      <form onSubmit={handleSubscribe} className="relative flex flex-col items-center justify-center gap-2 mb-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full max-w-md">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className={`rounded-full px-5 py-2.5 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-secondary)] backdrop-blur-sm transition-all text-sm ${
              darkMode
                ? "bg-zinc-900/90 text-white placeholder-slate-400"
                : "bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[var(--color-brand-primary)] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--color-brand-primary-dark)] transition cursor-pointer w-full sm:w-auto text-sm whitespace-nowrap"
          >
            {t("joinUsButton")}
          </motion.button>
        </div>

        {subscribeStatus && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-medium mt-1 ${subscribeStatus === "success" ? "text-[var(--color-brand-accent)]" : "text-[var(--home-secondary-text)]"}`}
          >
            {subscribeMessage}
          </motion.p>
        )}
      </form>

      <div className="relative flex justify-center items-center gap-2">
        <div className="flex -space-x-2">
          <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user1" className={`w-8 h-8 rounded-full border-2 shadow-sm ${darkMode ? "border-zinc-900" : "border-white"}`} />
          <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="user2" className={`w-8 h-8 rounded-full border-2 shadow-sm ${darkMode ? "border-zinc-900" : "border-white"}`} />
          <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="user3" className={`w-8 h-8 rounded-full border-2 shadow-sm ${darkMode ? "border-zinc-900" : "border-white"}`} />
        </div>
        <span className={`ml-2 text-sm font-medium ${darkMode ? "text-slate-400" : "text-[#555555]"}`}>
          {t("communityEngagement")}
        </span>
      </div>
    </motion.section>
  );
}
