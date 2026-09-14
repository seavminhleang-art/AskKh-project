import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FooterComponent from "../Footer/FooterComponet.jsx";
import missionImg from "../../assets/Website/mission.png";
import communityImg from "../../assets/Website/community.jpg";
import visionImg from "../../assets/Website/vision.png";
import Navbar from "../Nav/NavBarComponent.jsx";

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
function IllustrationImage({ src, alt, className = "w-full max-w-sm" }) {
  if (!src) {
    return (
      <div
        className={`${className} aspect-[4/3] rounded-2xl bg-slate-100 border-2 border-dashed border-brand-primary/30 flex items-center justify-center text-slate-400 text-sm`}
      >
        Add image
      </div>
    );
  }
  return <img src={src} alt={alt} className={`${className} object-contain`} />;
}

const NETWORK_IMAGE_SRC = communityImg;
const MISSION_IMAGE_SRC = missionImg;
const VISION_IMAGE_SRC = visionImg;

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
  { num: "01", name: "Srorng Sokcheat", roleLabel: "Senior IT Instructor", role: "Mentor", photo:"./src/assets/Mentor/srorng_sokcheat.jpg", github: "https://github.com/Sokcheatsrorng", telegram: "https://t.me/Sokcheat_srorng" },
  { num: "02", name: "Pech Rattanakmony", roleLabel: "Senior IT Instructor", role: "Mentor", photo: "./src/assets/Mentor/pech_rattanakmony.jpg", github: "https://github.com/aintantony", telegram: "https://t.me/rattanakmony" },
];

const teamLeads = [
  { num: "03", name: "Mom Lisa", roleLabel: "Frontend Developer", role: "Leader", photo: "./src/assets/Team/mom_lisa.jpg", github: "https://github.com/LisaMom", telegram: "https://t.me/lisamom369" },
  { num: "04", name: "Leang Seavminh", roleLabel: "Java Developer", role: "Sub-Lead", photo: "./src/assets/Team/leang_seavminh.jpg", github: "https://github.com/seavminhleang-art", telegram: "https://t.me/puthea_reach" },
];

const teamMembers = [
  { num: "05", name: "Cheakching Lyheng", roleLabel: "Java Developer", role: "Member", photo: "./src/assets/Team/cheakching_lyheng.jpg", github: "https://github.com/lyheng142", telegram: "https://t.me/cclh142" },
  { num: "06", name: "Cheat Chanmoniza", roleLabel: "Frontend Developer", role: "Member", photo: "./src/assets/Team/cheat_chanmoniza.jpg", github: "https://github.com/moniza-Dev", telegram: "https://t.me/chanmoniza_cheat" },
  { num: "07", name: "Hor Tongan", roleLabel: "Java Developer", role: "Member", photo: "./src/assets/Team/hor_tongan.jpg", github: "https://github.com/TongAnWasHere", telegram: "https://t.me/TongAnWasHere" },
  { num: "08", name: "Sroeun Sothearith", roleLabel: "Frontend Developer", role: "Member", photo: "./src/assets/Team/sroeun_sothearith.jpg", github: "https://github.com/Rith857", telegram: "https://t.me/sothearithsroeun" },
  { num: "09", name: "Neang Thana", roleLabel: "Frontend Developer", role: "Member", photo: "./src/assets/Team/neang_thana.jpg", github: "https://github.com/mrrhello894-byte", telegram: "https://t.me/neangthana" },
  { num: "10", name: "Venthan Tharath", roleLabel: "Frontend Developer", role: "Member", photo: "./src/assets/Team/venthan_tharath.jpg", github: "https://github.com/tharath780-commits", telegram: "https://t.me/helterqt" },
];

function MemberCard({ num, name, roleLabel, role, photo, github, telegram }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden text-center pt-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start px-5">
        <span className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg">{num}</span>
        <div className="grid grid-cols-3 gap-1 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="w-1 h-1 bg-brand-primary/40 rounded-full" />
          ))}
        </div>
      </div>
      <div className="relative w-28 h-28 mx-auto my-6">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-primary/30" />
        <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />
        {photo ? (
          <img src={photo} alt={name} className="absolute inset-1.5 w-[calc(100%-0.75rem)] h-[calc(100%-0.75rem)] rounded-full object-cover border-4 border-white shadow" />
        ) : (
          <div className="absolute inset-1.5 rounded-full bg-slate-200 border-4 border-white shadow flex items-center justify-center">
            
          </div>
        )}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full p-1.5 shadow border border-slate-100"></span>
      </div>
      <h3 className="text-brand-primary font-bold text-lg">{name}</h3>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="w-4 h-px bg-brand-secondary/40" />
        <p className="text-brand-secondary text-xs font-bold uppercase tracking-wide">{roleLabel}</p>
        <span className="w-4 h-px bg-brand-secondary/40" />
      </div>
      <div className="mt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary border border-brand-primary/50 rounded-full px-4 py-1.5">
          <PeopleIcon />
          {role.toUpperCase()}
        </span>
      </div>
      <div className="flex justify-center items-center gap-3 my-5">
        <a href={github || "#"} target={github ? "_blank" : undefined} rel={github ? "noopener noreferrer" : undefined} aria-label="GitHub" className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition">
          <GithubIcon />
        </a>
        <span className="w-px h-5 bg-slate-200" />
        <a href={telegram || "#"} target={telegram ? "_blank" : undefined} rel={telegram ? "noopener noreferrer" : undefined} aria-label="Telegram" className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition">
          <TelegramIcon />
        </a>
      </div>
      <div className="h-3 bg-brand-primary" />
    </div>
  );
}

export default function AboutAskKh() {
  const { t } = useTranslation();
  return (
    <div className="bg-white text-slate-800 antialiased">
      <Navbar/>
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            {t("aboutPage.title")}
          </h1>
          <div className="w-14 h-1 bg-brand-primary rounded-full mt-4 mb-6" />
          <p className="text-slate-500 leading-relaxed max-w-md">
            {t("aboutPage.description")}
          </p>
          <Link to="/community" className="mt-8 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 transition text-white font-medium px-6 py-3 rounded-full">
            {t("aboutPage.communityButton")} <span>→</span>
          </Link>
        </div>
        <div className="flex justify-center">
          <IllustrationImage src={NETWORK_IMAGE_SRC} alt="About AskKh" className="w-full max-w-m" />
        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {t("aboutPage.whyChooseTitle")}
          </h2>
          <p className="text-slate-500 mt-4 leading-relaxed">
            {t("aboutPage.whyChooseDesc")}
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresKeys.map((f) => (
            <div key={f.key} className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
              <div className={`w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center mb-4 bg-white ${f.color === "red" ? "border-brand-secondary/40 text-brand-secondary" : "border-brand-primary/50 text-brand-primary"}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">{t(`${f.key}.title`)}</h3>
              <p className="text-sm text-slate-500 mt-2">{t(`${f.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center order-2 md:order-1">
          <IllustrationImage src={MISSION_IMAGE_SRC} alt="Our Mission" className="w-full max-w-md" />
        </div>
        <div className="order-1 md:order-2">
          <span className="text-brand-primary text-sm font-semibold">{t("aboutPage.missionTitle")}</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">{t("aboutPage.missionTitle")}</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            {t("aboutPage.missionDesc")}
          </p>
          <ul className="space-y-3">
            {Array.isArray(t(missionPointsKey, { returnObjects: true })) ? (
              t(missionPointsKey, { returnObjects: true }).map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-slate-600">{point}</span>
                </li>
              ))
            ) : (
              <li><span className="text-slate-600">{t(missionPointsKey)}</span></li>
            )}
          </ul>
        </div>
      </section>
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-brand-primary text-sm font-semibold">{t("aboutPage.visionTitle")}</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">{t("aboutPage.visionTitle")}</h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              {t("aboutPage.visionDesc")}
            </p>
            <ul className="space-y-3">
              {Array.isArray(t(visionPointsKey, { returnObjects: true })) ? (
                t(visionPointsKey, { returnObjects: true }).map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-slate-600">{point}</span>
                  </li>
                ))
              ) : (
                <li><span className="text-slate-600">{t(visionPointsKey)}</span></li>
              )}
            </ul>
          </div>
          <div className="flex justify-center">
            <IllustrationImage src={VISION_IMAGE_SRC} alt="Our Vision" className="w-full max-w-md" />
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-14">
          {t("aboutPage.mentorsTitle")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {mentors.map((m) => (
            <MemberCard key={m.num} {...m} />
          ))}
        </div>
      </section>
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-center text-2xl font-bold text-slate-900 mb-14">
            {t("aboutPage.teamTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
            {teamLeads.map((m) => (
              <MemberCard key={m.num} {...m} />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((m) => (
              <MemberCard key={m.num} {...m} />
            ))}
          </div>
        </div>
      </section>
      <FooterComponent/>
    </div>
  );
}
