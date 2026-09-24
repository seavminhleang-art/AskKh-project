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
          className="flex items-start gap-2 text-[18px]"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ==================================================
// Policy Section
// ==================================================

function SectionBlock({
  num,
  title,
  paragraphs = [],
  list = [],
  groups = [],
  outro = [],
}) {
  return (
    <article id={`section-${num}`} className="scroll-mt-24">
      <div className="flex items-start gap-4">
        {/* Section Number */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-base font-bold text-white">
          {num}
        </span>

        {/* Section Content */}
        <div className="min-w-0 flex-1">
          <h2 className="mb-3 text-4xl font-bold text-2xl">
            {title}
          </h2>

          {/* Paragraphs */}
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="mb-3 leading-relaxed text-[18px]"
            >
              {paragraph}
            </p>
          ))}

          {/* Main List */}
          {list.length > 0 && <BulletList items={list} />}

          {/* Grouped Lists */}
          {groups.length > 0 && (
            <div className="mb-3 space-y-4">
              {groups.map((group, index) => (
                <div key={index}>
                  <h3 className="mb-2 text-2xl font-semibold text-brand-primary">
                    {group.heading}
                  </h3>

                  <BulletList items={group.items} />
                </div>
              ))}
            </div>
          )}

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
// Privacy Policy Page
// ==================================================

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  usePageSEO({
    title: "Privacy Policy | AskKh",
    description: "Read the AskKh Privacy Policy to learn how we protect, store, and manage member information across our developer and campus platform.",
    keywords: "AskKh privacy, privacy policy Cambodia, data security, developer community privacy",
    canonicalUrl: "https://askkh.com/privacy-policy",
  });

  // ==================================================
  // Transform Translation Data
  // ==================================================

  const sections = useMemo(() => {
    const policySections = t("policyPage.sections", {
      returnObjects: true,
    });

    if (!policySections || typeof policySections !== "object") {
      return [];
    }

    return Object.entries(policySections)
      .map(([num, data]) => ({
        num: Number(num),
        title: data?.title ?? "",
        paragraphs: Array.isArray(data?.paragraphs) ? data.paragraphs : [],
        list: Array.isArray(data?.list) ? data.list : [],
        groups: data?.groups
          ? Object.values(data.groups).map((group) => ({
              heading: group?.heading ?? "",
              items: Array.isArray(group?.items) ? group.items : [],
            }))
          : [],
        outro: Array.isArray(data?.outro) ? data.outro : [],
      }))
      .sort((a, b) => a.num - b.num);
  }, [t]);

  // ==================================================
  // Theme
  // ==================================================

  const heroTheme = darkMode ? "bg-zinc-900" : "bg-brand-primary-light";

  return (
    <main className="site-content min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] antialiased transition-colors duration-300">
      {/* ==================================================
          Hero / Header
      ================================================== */}

      <section className={`${heroTheme} transition-colors duration-300`}>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <ScrollReveal animation="fadeInUp">
            <span className="text-lg font-semibold uppercase tracking-wide text-brand-primary">
              {t("policyPage.legalLabel")}
            </span>

            <h1 className="mt-2 text-5xl font-bold text-[var(--text-main)] md:text-5xl">
              {t("policyPage.title")}
            </h1>

            <p className="mt-3 text-[var(--text-muted)]">
              {t("policyPage.lastUpdated")}
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
            {t("policyPage.intro")}
          </p>
        </ScrollReveal>
      </section>

      {/* ==================================================
          Policy Sections
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
