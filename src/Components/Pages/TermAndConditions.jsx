import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext.jsx";
import ScrollReveal from "../Animations/ScrollReveal.jsx";

function SectionBlock({ num, title, paragraphs = [], list, outro = [] }) {
  return (
    <div id={`section-${num}`} className="scroll-mt-24">
      <div className="flex items-start gap-4">
        <span className="shrink-0 w-9 h-9 rounded-full bg-brand-primary text-white text-sm font-bold flex items-center justify-center">
          {num}
        </span>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-3">{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[var(--text-muted)] leading-relaxed mb-3">
              {p}
            </p>
          ))}
          {list && (
            <ul className="space-y-2 mb-3">
              {list.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[var(--text-muted)]">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {outro.map((p, i) => (
            <p key={i} className="text-[var(--text-muted)] leading-relaxed mb-3">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TermsAndConditions() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  const sections = Object.entries(t("termsPage.sections", { returnObjects: true })).map(([num, data]) => ({
    num: parseInt(num),
    title: data.title,
    paragraphs: data.paragraphs,
    list: data.list,
    outro: data.outro
  }));

  return (
    <div className="site-content bg-[var(--bg-main)] text-[var(--text-main)] antialiased transition-colors duration-300">
      <section className={`${darkMode ? "bg-zinc-900" : "bg-brand-primary-light"} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <ScrollReveal animation="fadeInUp">
            <span className="text-brand-primary text-sm font-semibold uppercase tracking-wide">
              {t("termsPage.legalLabel")}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mt-2">
              {t("termsPage.title")}
            </h1>
            <p className="text-[var(--text-muted)] mt-3">{t("termsPage.lastUpdated")}</p>
          </ScrollReveal>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <ScrollReveal animation="fadeInUp">
          <p className="text-[var(--text-muted)] leading-relaxed">
            {t("termsPage.intro")}
          </p>
        </ScrollReveal>
      </section>
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="space-y-10">
          {sections.map((s, index) => (
            <ScrollReveal key={s.num} animation="fadeInUp" delay={index * 50}>
              <SectionBlock {...s} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
