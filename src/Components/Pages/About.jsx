import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useTheme } from "../../context/ThemeContext.jsx";
import ScrollReveal from "../Animations/ScrollReveal.jsx";

import missionDarkImg from "../../assets/Website/mission_dark.png";
import communityDarkImg from "../../assets/Website/community_dark.png";
import visionDarkImg from "../../assets/Website/vision_dark.png";

import sokcheatPhoto from "../../assets/Mentor/srorng_sokcheat.jpg";
import rattanakmonyPhoto from "../../assets/Mentor/pech_rattanakmony.jpg";

import lisaPhoto from "../../assets/Team/mom_lisa.jpg";
import seavminhPhoto from "../../assets/Team/leang_seavminh.JPG";
import lyhengPhoto from "../../assets/Team/cheakching_lyheng.jpg";
import monizaPhoto from "../../assets/Team/cheat_chanmoniza.jpg";
import tonganPhoto from "../../assets/Team/hor_tongan.jpg";
import sothearithPhoto from "../../assets/Team/sroeun_sothearith.JPG";
import thanaPhoto from "../../assets/Team/neang_thana.jpg";
import tharathPhoto from "../../assets/Team/venthan_tharath.jpg";

// ---------- Icons ----------

function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary shrink-0 mt-0.5">
      <svg
        className="w-3.5 h-3.5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z"
        />
      </svg>
    </span>
  );
}

function PeopleIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1m13 0h3v-1a3 3 0 00-3-3.85M13 7a4 4 0 11-8 0 4 4 0 018 0zm5 3a3 3 0 100-6 3 3 0 000 6z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.5-3.8-1.5-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10.4 10.4 0 015.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v3c0 .3.2.7.8.6A10.5 10.5 0 0023.5 12c0-6.3-5.2-11.5-11.5-11.5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5.37 24H.39V7.98h4.98V24zM2.88 5.8a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8zM24 24h-4.97v-7.8c0-1.86-.04-4.25-2.59-4.25-2.59 0-2.99 2.02-2.99 4.12V24H8.48V7.98h4.77v2.19h.07c.67-1.26 2.29-2.59 4.71-2.59C23.07 7.58 24 10.9 24 15.21V24z" />
    </svg>
  );
}

// ---------- Illustrations ----------

function IllustrationImage({ src, alt, className = "w-full max-w-sm" }) {
  if (!src) {
    return (
      <div
        className={`${className} aspect-[4/3] rounded-2xl bg-slate-100 border-2 border-dashed border-brand-primary/30 flex items-center justify-center text-slate-400 text-base`}
      >
        Add image
      </div>
    );
  }

  return <img src={src} alt={alt} className={`${className} object-contain`} />;
}

// ---------- Feature Data ----------

const featuresKeys = [
  {
    key: "aboutPage.features.askAnswer",
    color: "blue",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8-1.18 0-2.304-.202-3.335-.568L3 21l1.395-3.72C3.512 16.226 3 14.683 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
  {
    key: "aboutPage.features.lostFound",
    color: "blue",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    ),
  },
  {
    key: "aboutPage.features.smartMatching",
    color: "red",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" strokeWidth="2" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </>
    ),
  },
  {
    key: "aboutPage.features.trustedCommunity",
    color: "blue",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.5 12.5l1.8 1.8L15 10.5"
        />
      </>
    ),
  },
];

const missionPointsKey = "aboutPage.missionPoints";
const visionPointsKey = "aboutPage.visionPoints";

// ---------- Members ----------

const mentors = [
  {
    num: "01",
    name: "aboutPage.members.names.sokcheat",
    roleLabel: "Senior IT Instructor",
    role: "aboutPage.members.roles.mentor",
    photo: sokcheatPhoto,
    github: "https://github.com/Sokcheatsrorng",
    linkedin: "https://www.linkedin.com/in/srorng-sokcheat-09b542341/",
  },
  {
    num: "02",
    name: "aboutPage.members.names.rattanakmony",
    roleLabel: "Senior IT Instructor",
    role: "aboutPage.members.roles.mentor",
    photo: rattanakmonyPhoto,
    github: "https://github.com/aintantony",
    linkedin: "https://www.linkedin.com/in/rattanakmony-pech",
  },
];

const teamLeads = [
  {
    num: "03",
    name: "aboutPage.members.names.lisa",
    roleLabel: "Frontend Developer",
    role: "aboutPage.members.roles.leader",
    photo: lisaPhoto,
    github: "https://github.com/LisaMom",
    linkedin: "https://www.linkedin.com/in/mom-lisa-70b453417/",
  },
  {
    num: "04",
    name: "aboutPage.members.names.seavminh",
    roleLabel: "Java Developer",
    role: "aboutPage.members.roles.subLead",
    photo: seavminhPhoto,
    github: "https://github.com/seavminhleang-art",
    linkedin: "https://www.linkedin.com/in/leang-seavminh-824106438/",
  },
];

const teamMembers = [
  {
    num: "05",
    name: "aboutPage.members.names.lyheng",
    roleLabel: "Java Developer",
    role: "aboutPage.members.roles.member",
    photo: lyhengPhoto,
    github: "https://github.com/lyheng142",
    linkedin: "https://www.linkedin.com/in/cheakching-lyheng-983b41431/",
  },
  {
    num: "06",
    name: "aboutPage.members.names.moniza",
    roleLabel: "Frontend Developer",
    role: "aboutPage.members.roles.member",
    photo: monizaPhoto,
    github: "https://github.com/moniza-Dev",
    linkedin: "https://www.linkedin.com/in/mo-nizachan-a400aa438/",
  },
  {
    num: "07",
    name: "aboutPage.members.names.tongan",
    roleLabel: "Java Developer",
    role: "aboutPage.members.roles.member",
    photo: tonganPhoto,
    github: "https://github.com/TongAnWasHere",
    linkedin: "https://kh.linkedin.com/in/tongan-hor-b99bbb338",
  },
  {
    num: "08",
    name: "aboutPage.members.names.sothearith",
    roleLabel: "Frontend Developer",
    role: "aboutPage.members.roles.member",
    photo: sothearithPhoto,
    github: "https://github.com/Rith857",
    linkedin: "https://www.linkedin.com/in/sroeun-sothearith-a63189438/",
  },
  {
    num: "09",
    name: "aboutPage.members.names.thana",
    roleLabel: "Frontend Developer",
    role: "aboutPage.members.roles.member",
    photo: thanaPhoto,
    github: "https://github.com/mrrhello894-byte",
    linkedin: "https://www.linkedin.com/in/neang-thana-803b16437/",
  },
  {
    num: "10",
    name: "aboutPage.members.names.tharath",
    roleLabel: "Frontend Developer",
    role: "aboutPage.members.roles.member",
    photo: tharathPhoto,
    github: "https://github.com/tharath780-commits",
    linkedin: "https://www.linkedin.com/in/វ៉ែនថាន-ថារ័ត្ន-8163063b7/",
  },
];

// ---------- Member Card ----------

function MemberCard({
  num,
  name,
  roleLabel,
  role,
  photo,
  github,
  linkedin,
  darkMode,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`rounded-3xl shadow-md overflow-hidden text-center pt-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
        darkMode
          ? "bg-zinc-900 hover:shadow-brand-primary/10"
          : "bg-white hover:shadow-brand-primary/20"
      }`}
    >
      <div className="flex justify-between items-start px-5">
        <span className="bg-brand-primary text-white text-base font-bold px-3 py-1.5 rounded-lg">
          {num}
        </span>

        <div className="grid grid-cols-3 gap-1 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="w-1 h-1 bg-brand-primary/40 rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="relative w-40 h-40 mx-auto my-5">
        <div
          className="about-photo-orbit absolute inset-1 rounded-full border-2 border-dashed border-brand-primary/30"
          aria-hidden="true"
        >
          <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />

          <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />

          <span
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow border ${
              darkMode
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-slate-100"
            }`}
          />
        </div>

        {photo ? (
          <img
            src={photo}
            alt={t(name)}
            className={`absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-full object-cover object-center border-4 shadow ${
              darkMode ? "border-zinc-800" : "border-white"
            }`}
          />
        ) : (
          <div
            className={`absolute inset-2 rounded-full border-4 shadow flex items-center justify-center ${
              darkMode
                ? "bg-zinc-800 border-zinc-900"
                : "bg-slate-200 border-white"
            }`}
          />
        )}
      </div>

      <h3 className="text-brand-primary font-bold text-lg">{t(name)}</h3>

      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="w-4 h-px bg-brand-secondary/40" />

        <p className="text-brand-secondary text-base font-bold uppercase tracking-wide">
          {roleLabel}
        </p>

        <span className="w-4 h-px bg-brand-secondary/40" />
      </div>

      <div className="mt-4">
        <span className="inline-flex items-center gap-1.5 text-lg font-bold text-brand-primary border border-brand-primary/50 rounded-full px-4 py-1.5">
          <PeopleIcon />
          {t(role).toUpperCase()}
        </span>
      </div>

      <div className="flex justify-center items-center gap-3 my-5">
        <a
          href={github || "#"}
          target={github ? "_blank" : undefined}
          rel={github ? "noopener noreferrer" : undefined}
          aria-label="GitHub"
          className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-all duration-300 hover:scale-110"
        >
          <GithubIcon />
        </a>

        <span
          className={`w-px h-5 ${darkMode ? "bg-zinc-700" : "bg-slate-200"}`}
        />

        {linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(name)} — LinkedIn`}
            className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#004182] transition-all duration-300 hover:scale-110"
          >
            <LinkedInIcon />
          </a>
        ) : (
          <span
            role="link"
            aria-disabled="true"
            aria-label={`${t(name)} — LinkedIn`}
            className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center opacity-40"
          >
            <LinkedInIcon />
          </span>
        )}
      </div>

      <div className="h-3 bg-brand-primary" />
    </div>
  );
}

import { usePageSEO } from "../common/SEO";

// ---------- About Page ----------

export default function AboutNexa() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();

  usePageSEO({
    title: "About Us | NEXA — Cambodian Developer Ecosystem",
    description:
      "Learn about NEXA (Network, Explore, eXchange, Assist) — Cambodia's premier developer and student platform. Discover our mission, vision, campus asset recovery, and team.",
    keywords:
      "About NEXA, Cambodian developer platform, ISTAD mentors, student developers Cambodia, tech community Phnom Penh",
    canonicalUrl: "https://ask-kh-project.vercel.app/about",
  });

  return (
    <div className="shared-theme shared-page about-page site-content bg-[var(--bg-main)] text-[var(--text-main)] antialiased transition-colors duration-300">
      {/* ---------- Hero / Introduction ---------- */}

      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <ScrollReveal animation="fadeInUp">
          <div className="no-transition">
            <h1 className="text-5xl font-bold text-[var(--text-main)]">
              <Trans
                t={t}
                i18nKey="aboutPage.title"
                components={{
                  brand: <span className="text-brand-primary" />,
                }}
              />
            </h1>

            <div className="w-14 h-1 bg-brand-primary rounded-full mt-4 mb-6" />

            <p className="text-lg leading-relaxed max-w-md">
              {t("aboutPage.description")}
            </p>

            <Link
              to="/community/qa"
              className="mt-8 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 transition text-white font-medium px-6 py-3 rounded-full active:scale-95 transition-transform duration-200"
            >
              {t("aboutPage.communityButton")}
              <span>→</span>
            </Link>
          </div>
        </ScrollReveal>

        <div className="flex justify-center">
          <ScrollReveal animation="scaleIn" delay={200}>
            <IllustrationImage
              src={communityDarkImg}
              alt="About NEXA"
              className="w-full max-w-md animate-float"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ---------- Why Choose NEXA ---------- */}

      <section className="bg-[var(--bg-secondary)] py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center px-6">
          <ScrollReveal animation="fadeInUp">
            <h2 className="text-5xl font-bold text-[var(--text-main)]">
              <Trans
                t={t}
                i18nKey="aboutPage.whyChooseTitle"
                components={{
                  brand: <span className="text-brand-primary" />,
                }}
              />
            </h2>

            <p className="text-lg mt-4 leading-relaxed">
              {t("aboutPage.whyChooseDesc")}
            </p>
          </ScrollReveal>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresKeys.map((feature, index) => (
            <ScrollReveal
              key={feature.key}
              animation="fadeInUp"
              delay={index * 100}
            >
              <div className="bg-[var(--bg-card)] rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center mb-4 bg-[var(--bg-card)] ${
                    feature.color === "red"
                      ? "border-brand-secondary/40 text-brand-secondary"
                      : "border-brand-primary/50 text-brand-primary"
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {feature.icon}
                  </svg>
                </div>

                <h3 className="font-semibold text-[var(--text-main)] text-2xl">
                  {t(`${feature.key}.title`)}
                </h3>

                <p className="text-lg mt-2">{t(`${feature.key}.desc`)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ---------- Mission ---------- */}

      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center order-2 md:order-1">
          <ScrollReveal animation="scaleIn">
            <IllustrationImage
              src={missionDarkImg}
              alt="Our Mission"
              className="w-full max-w-md animate-float"
            />
          </ScrollReveal>
        </div>

        <div className="order-1 md:order-2">
          <ScrollReveal animation="fadeInUp">
            <span className="text-brand-primary text-base font-semibold">
              {t("aboutPage.missionTitle")}
            </span>

            <h2 className="text-5xl font-bold text-[var(--text-main)] mt-2 mb-4">
              {t("aboutPage.missionTitle")}
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              {t("aboutPage.missionDesc")}
            </p>

            <ul className="space-y-3">
              {Array.isArray(t(missionPointsKey, { returnObjects: true })) ? (
                t(missionPointsKey, { returnObjects: true }).map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckIcon />

                    <span className="text-lg">{point}</span>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-lg">{t(missionPointsKey)}</span>
                </li>
              )}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------- Vision ---------- */}

      <section className="bg-[var(--bg-secondary)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="no-transition">
            <ScrollReveal animation="fadeInUp">
              <span className="text-brand-primary text-base font-semibold">
                {t("aboutPage.visionTitle")}
              </span>

              <h2 className="text-5xl font-bold text-[var(--text-main)] mt-2 mb-4">
                {t("aboutPage.visionTitle")}
              </h2>

              <p className="text-lg leading-relaxed mb-6">
                {t("aboutPage.visionDesc")}
              </p>

              <ul className="space-y-3">
                {Array.isArray(t(visionPointsKey, { returnObjects: true })) ? (
                  t(visionPointsKey, { returnObjects: true }).map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckIcon />

                      <span className="text-lg">{point}</span>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="text-lg">{t(visionPointsKey)}</span>
                  </li>
                )}
              </ul>
            </ScrollReveal>
          </div>

          <div className="flex justify-center">
            <ScrollReveal animation="scaleIn" delay={200}>
              <IllustrationImage
                src={visionDarkImg}
                alt="Our Vision"
                className="w-full max-w-md animate-float"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ---------- Mentors ---------- */}

      <section className="max-w-6xl mx-auto px-6 py-20">
        <ScrollReveal animation="fadeInUp">
          <h2 className="text-center text-5xl font-bold text-[var(--text-main)] mb-14">
            <Trans
              t={t}
              i18nKey="aboutPage.mentorsTitle"
              components={{
                brand: <span className="text-brand-primary" />,
              }}
            />
          </h2>

          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {mentors.map((member) => (
              <MemberCard key={member.num} {...member} darkMode={darkMode} />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ---------- Team ---------- */}

      <section className="bg-[var(--bg-secondary)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <ScrollReveal animation="fadeInUp">
            <h2 className="text-center text-5xl font-bold text-[var(--text-main)] mb-14">
              <Trans
                t={t}
                i18nKey="aboutPage.teamTitle"
                components={{
                  brand: <span className="text-brand-primary" />,
                }}
              />
            </h2>

            {/* Team Leads */}
            <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
              {teamLeads.map((member) => (
                <MemberCard key={member.num} {...member} darkMode={darkMode} />
              ))}
            </div>

            {/* Team Members */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <MemberCard key={member.num} {...member} darkMode={darkMode} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
