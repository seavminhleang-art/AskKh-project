import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useTheme } from "../../context/ThemeContext.jsx";
import ScrollReveal from "../Animations/ScrollReveal.jsx";

import missionImg from "../../assets/Website/mission.png";
import missionDarkImg from "../../assets/Website/mission_dark.png";
import communityImg from "../../assets/Website/community.png";
import communityDarkImg from "../../assets/Website/community_dark.png";
import visionImg from "../../assets/Website/vision.png";
import visionDarkImg from "../../assets/Website/vision_dark.png";

// ---------- Icons ----------
function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary shrink-0 mt-0.5">
      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
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
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

function TelegramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21.9 3.5L2.4 11.2c-1.2.5-1.2 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.6.4.8.8.8.4 0 .6-.2.8-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.4-1.9-1.5-1.7z" />
    </svg>
  );
}

// ---------- Illustrations ----------
function IllustrationImage({ src, alt, className = "w-full max-w-sm", glow = false }) {
  if (!src) {
    return (
      <div
        className={`${className} aspect-[4/3] rounded-2xl bg-slate-100 border-2 border-dashed border-brand-primary/30 flex items-center justify-center text-slate-400 text-sm`}
      >
        Add image
      </div>
    );
  }
  return (
    <div className={`relative group ${className}`}>
      {glow && (
        <>
          {/* Primary Breathing Glow */}
          <div className="absolute -inset-8 bg-brand-primary/20 blur-3xl rounded-full animate-pulse transition-all duration-1000 group-hover:bg-brand-primary/30 group-hover:blur-2xl" />
          {/* Secondary Atmospheric Aura */}
          <div className="absolute -inset-12 bg-brand-secondary/10 blur-3xl rounded-full animate-pulse [animation-duration:4s] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        </>
      )}
      <img
        src={src}
        alt={alt}
        className={`relative z-10 w-full h-full object-contain transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 ${className.replace('w-full max-w-sm', '')}`}
      />
    </div>
  );
}

// ---------- Data Keys ----------
const featuresKeys = [
  { key: "aboutPage.features.askAnswer", color: "blue", icon: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8-1.18 0-2.304-.202-3.335-.568L3 21l1.395-3.72C3.512 16.226 3 14.683 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z" />) },
  { key: "aboutPage.features.lostFound", color: "blue", icon: (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />) },
  { key: "aboutPage.features.smartMatching", color: "red", icon: (<><circle cx="12" cy="12" r="8" strokeWidth="2" /><circle cx="12" cy="12" r="4" strokeWidth="2" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>) },
  { key: "aboutPage.features.trustedCommunity", color: "blue", icon: (<><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 12.5l1.8 1.8L15 10.5" /></>) },
];

const missionPointsKey = "aboutPage.missionPoints";
const visionPointsKey = "aboutPage.visionPoints";

const mentors = [
  { num: "01", name: "aboutPage.members.names.sokcheat", roleLabel: "Senior IT Instructor", role: "aboutPage.members.roles.mentor", photo:"./src/assets/Mentor/srorng_sokcheat.jpg", github: "https://github.com/Sokcheatsrorng", telegram: "https://t.me/Sokcheat_srorng" },
  { num: "02", name: "aboutPage.members.names.rattanakmony", roleLabel: "Senior IT Instructor", role: "aboutPage.members.roles.mentor", photo: "./src/assets/Mentor/pech_rattanakmony.jpg", github: "https://github.com/aintantony", telegram: "https://t.me/rattanakmony" },
];

const teamLeads = [
  { num: "03", name: "aboutPage.members.names.lisa", roleLabel: "Frontend Developer", role: "aboutPage.members.roles.leader", photo: "./src/assets/Team/mom_lisa.jpg", github: "https://github.com/LisaMom", telegram: "https://t.me/lisamom369" },
  { num: "04", name: "aboutPage.members.names.seavminh", roleLabel: "Java Developer", role: "aboutPage.members.roles.subLead", photo: "./src/assets/Team/leang_seavminh.jpg", github: "https://github.com/seavminhleang-art", telegram: "https://t.me/puthea_reach" },
];

const teamMembers = [
  { num: "05", name: "aboutPage.members.names.lyheng", roleLabel: "Java Developer", role: "aboutPage.members.roles.member", photo: "./src/assets/Team/cheakching_lyheng.jpg", github: "https://github.com/lyheng142", telegram: "https://t.me/cclh142" },
  { num: "06", name: "aboutPage.members.names.moniza", roleLabel: "Frontend Developer", role: "aboutPage.members.roles.member", photo: "./src/assets/Team/cheat_chanmoniza.jpg", github: "https://github.com/moniza-Dev", telegram: "https://t.me/chanmoniza_cheat" },
  { num: "07", name: "aboutPage.members.names.tongan", roleLabel: "Java Developer", role: "aboutPage.members.roles.member", photo: "./src/assets/Team/hor_tongan.jpg", github: "https://github.com/TongAnWasHere", telegram: "https://t.me/TongAnWasHere" },
  { num: "08", name: "aboutPage.members.names.sothearith", roleLabel: "Frontend Developer", role: "aboutPage.members.roles.member", photo: "./src/assets/Team/sroeun_sothearith.jpg", github: "https://github.com/Rith857", telegram: "https://t.me/sothearithsroeun" },
  { num: "09", name: "aboutPage.members.names.thana", roleLabel: "Frontend Developer", role: "aboutPage.members.roles.member", photo: "./src/assets/Team/neang_thana.jpg", github: "https://github.com/mrrhello894-byte", telegram: "https://t.me/neangthana" },
  { num: "10", name: "aboutPage.members.names.tharath", roleLabel: "Frontend Developer", role: "aboutPage.members.roles.member", photo: "./src/assets/Team/venthan_tharath.jpg", github: "https://github.com/tharath780-commits", telegram: "https://t.me/helterqt" },
];

function MemberCard({ num, name, roleLabel, role, photo, github, telegram, darkMode }) {
  const { t } = useTranslation();
  return (
    <div className={`group rounded-3xl border shadow-md overflow-hidden text-center pt-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-primary/50 ${darkMode ? "bg-zinc-900 border-zinc-800 hover:shadow-brand-primary/10" : "bg-white border-slate-200 hover:shadow-brand-primary/20"}`}>
      <div className="flex justify-between items-start px-5">
        <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg">{num}</span>
        <div className="grid grid-cols-3 gap-1 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="w-1 h-1 bg-brand-primary/40 rounded-full" />
          ))}
        </div>
      </div>
      <div className="relative w-28 h-28 mx-auto my-6">
        {/* Static background ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-primary/20" />

        {/* Continuous Rotating Gradient Ring */}
        <div
          className="absolute inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 motion-safe:group-hover:animate-spin"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, var(--color-brand-primary) 25%, transparent 50%)`,
            WebkitMaskImage: 'radial-gradient(circle, transparent 65%, black 68%)',
            maskImage: 'radial-gradient(circle, transparent 65%, black 68%)',
          }}
        />

        <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />
        {photo ? (
          <img src={photo} alt={name} className={`relative z-10 absolute inset-1.5 w-[calc(100%-0.75rem)] h-[calc(100%-0.75rem)] rounded-full object-cover border-4 shadow ${darkMode ? "border-zinc-800 ring-4 ring-brand-primary/20" : "border-white"}`} />
        ) : (
          <div className={`relative z-10 absolute inset-1.5 rounded-full border-4 shadow flex items-center justify-center ${darkMode ? "bg-zinc-800 border-zinc-900" : "bg-slate-200 border-white"}`}>
          </div>
        )}
        <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full p-1.5 shadow border ${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"}`}></span>
      </div>
      <h3 className="text-brand-primary font-bold text-lg">{t(name)}</h3>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="w-4 h-px bg-brand-secondary/40" />
        <p className="text-brand-secondary text-xs font-bold uppercase tracking-wide">{roleLabel}</p>
        <span className="w-4 h-px bg-brand-secondary/40" />
      </div>
      <div className="mt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary border border-brand-primary/50 rounded-full px-4 py-1.5">
          <PeopleIcon />
          {t(role).toUpperCase()}
        </span>
      </div>
      <div className="flex justify-center items-center gap-3 my-5">
        <a href={github || "#"} target={github ? "_blank" : undefined} rel={github ? "noopener noreferrer" : undefined} aria-label="GitHub" className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-all duration-300 hover:scale-110">
          <GithubIcon />
        </a>
        <span className={`w-px h-5 ${darkMode ? "bg-zinc-700" : "bg-slate-200"}`} />
        <a href={telegram || "#"} target={telegram ? "_blank" : undefined} rel={telegram ? "noopener noreferrer" : undefined} aria-label="Telegram" className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-all duration-300 hover:scale-110">
          <TelegramIcon />
        </a>
      </div>
      <div className="h-3 bg-brand-primary" />
    </div>
  );
}

export default function AboutAskKh() {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  return (
    <div className="bg-[var(--bg-main)] text-[var(--text-main)] antialiased transition-colors duration-300">
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <ScrollReveal animation="fadeInUp">
          <div className="no-transition">
            <h1 className="text-4xl font-bold text-[var(--text-main)]">
              <Trans
                t={t}
                i18nKey="aboutPage.title"
                components={{ brand: <span className="text-brand-primary" /> }}
              />
            </h1>
            <div className="w-14 h-1 bg-brand-primary rounded-full mt-4 mb-6" />
            <p className="text-[var(--text-muted)] leading-relaxed max-w-md">
              {t("aboutPage.description")}
            </p>
            <Link to="/community" className="mt-8 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 transition text-white font-medium px-6 py-3 rounded-full active:scale-95 transition-transform duration-200">
              {t("aboutPage.communityButton")} <span>→</span>
            </Link>
          </div>
        </ScrollReveal>
        <div className="flex justify-center">
          <ScrollReveal animation="scaleIn" delay={200}>
            <IllustrationImage
              src={darkMode ? communityDarkImg : communityImg}
              alt="About AskKh"
              className="w-full max-w-m animate-float"
              glow={darkMode}
            />
          </ScrollReveal>
        </div>
      </section>
      <section className="bg-[var(--bg-secondary)] py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center px-6">
          <ScrollReveal animation="fadeInUp">
            <h2 className="text-3xl font-bold text-[var(--text-main)]">
              <Trans
                t={t}
                i18nKey="aboutPage.whyChooseTitle"
                components={{ brand: <span className="text-brand-primary" /> }}
              />
            </h2>
            <p className="text-[var(--text-muted)] mt-4 leading-relaxed">
              {t("aboutPage.whyChooseDesc")}
            </p>
          </ScrollReveal>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresKeys.map((f, index) => (
            <ScrollReveal key={f.key} animation="fadeInUp" delay={index * 100}>
              <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-[var(--border-color)]">
                <div className={`w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center mb-4 bg-[var(--bg-card)] ${f.color === "red" ? "border-brand-secondary/40 text-brand-secondary" : "border-brand-primary/50 text-brand-primary"}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--text-main)]">{t(`${f.key}.title`)}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-2">{t(`${f.key}.desc`)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center order-2 md:order-1">
          <ScrollReveal animation="scaleIn">
            <IllustrationImage
              src={darkMode ? missionDarkImg : missionImg}
              alt="Our Mission"
              className="w-full max-w-md animate-float"
              glow={darkMode}
            />
          </ScrollReveal>
        </div>
        <div className="order-1 md:order-2">
          <ScrollReveal animation="fadeInUp">
            <span className="text-brand-primary text-sm font-semibold">{t("aboutPage.missionTitle")}</span>
            <h2 className="text-3xl font-bold text-[var(--text-main)] mt-2 mb-4">{t("aboutPage.missionTitle")}</h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              {t("aboutPage.missionDesc")}
            </p>
            <ul className="space-y-3">
              {Array.isArray(t(missionPointsKey, { returnObjects: true })) ? (
                t(missionPointsKey, { returnObjects: true }).map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-[var(--text-muted)]">{point}</span>
                  </li>
                ))
              ) : (
                <li><span className="text-[var(--text-muted)]">{t(missionPointsKey)}</span></li>
              )}
            </ul>
          </ScrollReveal>
        </div>
      </section>
      <section className="bg-[var(--bg-secondary)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="no-transition">
            <ScrollReveal animation="fadeInUp">
              <span className="text-brand-primary text-sm font-semibold">{t("aboutPage.visionTitle")}</span>
              <h2 className="text-3xl font-bold text-[var(--text-main)] mt-2 mb-4">{t("aboutPage.visionTitle")}</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                {t("aboutPage.visionDesc")}
              </p>
              <ul className="space-y-3">
                {Array.isArray(t(visionPointsKey, { returnObjects: true })) ? (
                  t(visionPointsKey, { returnObjects: true }).map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-[var(--text-muted)]">{point}</span>
                    </li>
                  ))
                ) : (
                  <li><span className="text-[var(--text-muted)]">{t(visionPointsKey)}</span></li>
                )}
              </ul>
            </ScrollReveal>
          </div>
          <div className="flex justify-center">
            <ScrollReveal animation="scaleIn" delay={200}>
              <IllustrationImage
                src={darkMode ? visionDarkImg : visionImg}
                alt="Our Vision"
                className="w-full max-w-md animate-float"
                glow={darkMode}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <ScrollReveal animation="fadeInUp">
          <h2 className="text-center text-2xl font-bold text-[var(--text-main)] mb-14">
            <Trans
              t={t}
              i18nKey="aboutPage.mentorsTitle"
              components={{ brand: <span className="text-brand-primary" /> }}
            />
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {mentors.map((m) => (
              <MemberCard key={m.num} {...m} darkMode={darkMode} />
            ))}
          </div>
        </ScrollReveal>
      </section>
      <section className="bg-[var(--bg-secondary)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <ScrollReveal animation="fadeInUp">
            <h2 className="text-center text-2xl font-bold text-[var(--text-main)] mb-14">
              <Trans
              t={t}
              i18nKey="aboutPage.teamTitle"
              components={{ brand: <span className="text-brand-primary" /> }}
            />
            </h2>
            <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
              {teamLeads.map((m) => (
                <MemberCard key={m.num} {...m} darkMode={darkMode} />
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((m) => (
                <MemberCard key={m.num} {...m} darkMode={darkMode} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
