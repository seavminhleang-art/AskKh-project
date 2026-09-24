import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext.jsx";
import ScrollReveal from "../Animations/ScrollReveal.jsx";

// ==================================================
// Bullet List
// ==================================================

function BulletList({ items = [] }) {
  return (
    <ul className="mb-3 space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-2 text-[var(--text-muted)]"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ==================================================
// Terms Section
// ==================================================

function SectionBlock({ num, title, paragraphs = [], list = [], outro = [] }) {
  return (
    <article id={`section-${num}`} className="scroll-mt-24">
      <div className="flex items-start gap-4">
        {/* Section Number */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-base font-bold text-white">
          {num}
        </span>

        {/* Section Content */}
        <div className="min-w-0 flex-1">
          <h2 className="mb-3 text-3xl font-bold text-[var(--text-main)]">
            {title}
          </h2>

          {/* Paragraphs */}
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="mb-3 leading-relaxed text-[var(--text-muted)]"
            >
              {paragraph}
            </p>
          ))}

          {/* List */}
          {list.length > 0 && <BulletList items={list} />}

          {/* Outro Paragraphs */}
          {outro.map((paragraph, index) => (
            <p
              key={index}
              className="mb-3 leading-relaxed text-[var(--text-muted)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

import { usePageSEO } from "../common/SEO";

// ==================================================
// Terms & Conditions Page
// ==================================================

export default function TermsAndConditions() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  usePageSEO({
    title: "Terms & Conditions | NEXA",
    description:
      "Read the NEXA Terms & Conditions to understand community guidelines, user responsibilities, and service rules.",
    keywords:
      "NEXA terms, terms and conditions, community guidelines Cambodia, user agreement",
    canonicalUrl: "https://ask-kh-project.vercel.app/terms",
  });

  // ==================================================
  // Transform Translation Data
  // ==================================================

  const sections = useMemo(() => {
    const termsSections = t("termsPage.sections", {
      returnObjects: true,
    });

    if (!termsSections || typeof termsSections !== "object") {
      return [];
    }

    return Object.entries(termsSections)
      .map(([num, data]) => ({
        num: Number(num),
        title: data?.title ?? "",
        paragraphs: Array.isArray(data?.paragraphs) ? data.paragraphs : [],
        list: Array.isArray(data?.list) ? data.list : [],
        outro: Array.isArray(data?.outro) ? data.outro : [],
      }))
      .sort((a, b) => a.num - b.num);
  }, [t]);

  // ==================================================
  // Theme
  // ==================================================

  const heroTheme = darkMode ? "bg-zinc-900" : "bg-brand-primary-light";

  // ==================================================
  // Render
  // ==================================================

  return (
    <main className="site-content min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] antialiased transition-colors duration-300">
      {/* ==================================================
          Hero / Header
      ================================================== */}

      <section className={`${heroTheme} transition-colors duration-300`}>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <ScrollReveal animation="fadeInUp">
            <span className="text-base font-semibold uppercase tracking-wide text-brand-primary">
              {t("termsPage.legalLabel")}
            </span>

            <h1 className="mt-2 text-5xl font-bold text-[var(--text-main)] md:text-5xl">
              {t("termsPage.title")}
            </h1>

            <p className="mt-3 text-[var(--text-muted)]">
              {t("termsPage.lastUpdated")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ==================================================
          Introduction
      ================================================== */}

      <section className="mx-auto max-w-4xl px-6 py-12">
        <ScrollReveal animation="fadeInUp">
          <p className="leading-relaxed text-[var(--text-muted)]">
            {t("termsPage.intro")}
          </p>
        </ScrollReveal>
      </section>

      {/* ==================================================
          Terms Sections
      ================================================== */}

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="space-y-10">
          {sections.map((section, index) => (
            <ScrollReveal
              key={section.num}
              animation="fadeInUp"
              delay={index * 50}
            >
              <SectionBlock {...section} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
