import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext.jsx";
import ScrollReveal from "../Animations/ScrollReveal.jsx";

function BulletList({ items }) {
  return (
    <ul className="space-y-2 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-[var(--text-muted)]">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionBlock({ num, title, paragraphs = [], list, groups, outro = [] }) {
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
          {list && <BulletList items={list} />}
          {groups && (
            <div className="space-y-4 mb-3">
              {groups.map((g, i) => (
                <div key={i}>
                  <h3 className="text-lg font-semibold text-brand-primary mb-2">
                    {g.heading}
                  </h3>
                  <BulletList items={g.items} />
                </div>
              ))}
            </div>
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

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  // Transform the i18n object into the format expected by SectionBlock
  const sections = Object.entries(t("policyPage.sections", { returnObjects: true })).map(([num, data]) => ({
    num: parseInt(num),
    title: data.title,
    paragraphs: data.paragraphs,
    list: data.list,
    groups: data.groups ? Object.values(data.groups).map(g => ({ heading: g.heading, items: g.items })) : null,
    outro: data.outro
  }));

  return (
    <div className="site-content bg-[var(--bg-main)] text-[var(--text-main)] antialiased transition-colors duration-300">
      <section className={`${darkMode ? "bg-zinc-900" : "bg-brand-primary-light"} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <ScrollReveal animation="fadeInUp">
            <span className="text-brand-primary text-sm font-semibold uppercase tracking-wide">
              {t("policyPage.legalLabel")}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mt-2">
              {t("policyPage.title")}
            </h1>
            <p className="text-[var(--text-muted)] mt-3">{t("policyPage.lastUpdated")}</p>
          </ScrollReveal>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-12">
        <ScrollReveal animation="fadeInUp">
          <p className="text-[var(--text-muted)] leading-relaxed">
            {t("policyPage.intro")}
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
