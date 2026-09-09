import React from "react";
import { Link } from "react-router";
import Navbar from "../Nav/NavBarComponent.jsx";
import FooterComponent from "../Footer/FooterComponet.jsx";
import missionImg from "../../assets/Website/mission.png";
import networkImg from "../../assets/Website/network.png";
import visionImg from "../../assets/Website/vision.png";
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

function PersonIcon({ className = "w-12 h-12 text-slate-300" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.6-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
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

// ---------- Illustrations (now real images) ----------
// Fill in the `src` values below (or pass a photo prop) once you have images.
// Until then, this shows a plain placeholder box instead of an SVG icon.
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

const NETWORK_IMAGE_SRC = networkImg;
const MISSION_IMAGE_SRC = missionImg;
const VISION_IMAGE_SRC = visionImg;

// ---------- Data ----------
const features = [
  {
    title: "Ask & Answer",
    desc: "Get help with your questions or share your knowledge with others",
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
    title: "Lost & Found",
    desc: "Report lost or found items and help return them to their owners",
    color: "blue",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7h-3V6a4 4 0 00-8 0v1H6a1 1 0 00-1 1v11a2 2 0 002 2h10a2 2 0 002-2V8a1 1 0 00-1-1zM9 6a3 3 0 016 0v1H9V6z"
      />
    ),
  },
  {
    title: "Smart Matching",
    desc: "Our smart system connects you with the right people and answers faster.",
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
    title: "Trusted Community",
    desc: "Verified users, moderated content, and a respectful place for everyone.",
    color: "blue",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 12.5l1.8 1.8L15 10.5" />
      </>
    ),
  },
];

const missionPoints = [
  "Encourage knowledge sharing and collaboration.",
  "Support academic and personal growth.",
  "Create a positive and respectful online environment.",
];

const visionPoints = [
  "A thriving community of curious and helpful minds.",
  "A platform that inspires learning and innovation.",
  "Bridging knowledge today, building leaders tomorrow.",
];

const mentors = [
  { num: "01", name: "Srorng Sokcheat", roleLabel: "Senior IT Instructor", role: "Mentor", photo:"./src/assets/Mentor/srorng_sokcheat.jpg", github: "https://github.com/Sokcheatsrorng", telegram: "https://t.me/Sokcheat_srorng" },
  { num: "02", name: "Pech Rattanakmony", roleLabel: "Senior IT Instructor", role: "Mentor", photo: "./src/assets/Mentor/pech_rattanakmony.jpg", github: "https://github.com/aintantony", telegram: "https://t.me/rattanakmony" },
];

const teamLeads = [
  { num: "03", name: "Mom Lisa", roleLabel: "Frontend Developer", role: "Leader", photo: "", github: "https://github.com/LisaMom", telegram: "https://t.me/lisamom369" },
  { num: "04", name: "Leang Seavminh", roleLabel: "Java Developer", role: "Sub-Lead", photo: "", github: "https://github.com/seavminhleang-art", telegram: "https://t.me/puthea_reach" },
];

const teamMembers = [
  { num: "05", name: "Cheakching Lyheng", roleLabel: "Java Developer", role: "Member", photo: "", github: "https://github.com/lyheng142", telegram: "https://t.me/cclh142" },
  { num: "06", name: "Cheat Chanmoniza", roleLabel: "Frontend Developer", role: "Member", photo: "", github: "https://github.com/moniza-Dev", telegram: "https://t.me/chanmoniza_cheat" },
  { num: "07", name: "Hor Tongan", roleLabel: "Java Developer", role: "Member", photo: "", github: "https://github.com/TongAnWasHere", telegram: "https://t.me/TongAnWasHere" },
  { num: "08", name: "Sroeun Sothearith", roleLabel: "Frontend Developer", role: "Member", photo: "", github: "https://github.com/Rith857", telegram: "https://t.me/sothearithsroeun" },
  { num: "09", name: "Neang Thana", roleLabel: "Frontend Developer", role: "Member", photo: "", github: "https://github.com/mrrhello894-byte", telegram: "https://t.me/neangthana" },
  { num: "10", name: "Venthan Tharath", roleLabel: "Frontend Developer", role: "Member", photo: "", github: "https://github.com/tharath780-commits", telegram: "https://t.me/helterqt" },
];

// ---------- Reusable card ----------
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
        {/* dashed outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-primary/30" />
        {/* side dots */}
        <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-brand-primary" />

        {photo ? (
          <img
            src={photo}
            alt={name}
            className="absolute inset-1.5 w-[calc(100%-0.75rem)] h-[calc(100%-0.75rem)] rounded-full object-cover border-4 border-white shadow"
          />
        ) : (
          <div className="absolute inset-1.5 rounded-full bg-slate-200 border-4 border-white shadow flex items-center justify-center">
            <PersonIcon />
          </div>
        )}

        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full p-1.5 shadow border border-slate-100">
          
        </span>
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
        <a
          href={github || "#"}
          target={github ? "_blank" : undefined}
          rel={github ? "noopener noreferrer" : undefined}
          aria-label="GitHub"
          className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition"
        >
          <GithubIcon />
        </a>
        <span className="w-px h-5 bg-slate-200" />
        <a
          href={telegram || "#"}
          target={telegram ? "_blank" : undefined}
          rel={telegram ? "noopener noreferrer" : undefined}
          aria-label="Telegram"
          className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition"
        >
          <TelegramIcon />
        </a>
      </div>

      <div className="h-3 bg-brand-primary" />
    </div>
  );
}

// ---------- Page ----------
export default function AboutAskKh() {
  return (
    <div className="bg-white text-slate-800 antialiased">
      <Navbar/>
      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            About <span className="text-brand-primary">AskKh</span>
          </h1>
          <div className="w-14 h-1 bg-brand-primary rounded-full mt-4 mb-6" />
          <p className="text-slate-500 leading-relaxed max-w-md">
            AskKh is a knowledge-sharing platform built for the ISTAD community and beyond. We
            connect people through questions, answers, and real-time discussions.
          </p>
          <Link
            to="/#qa"
            className="mt-8 inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 transition text-white font-medium px-6 py-3 rounded-full"
          >
            Be Part of Our Community <span>→</span>
          </Link>
        </div>
        <div className="flex justify-center">
          <IllustrationImage src={NETWORK_IMAGE_SRC} alt="About AskKh" className="w-full max-w-m" />
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Why Choose <span className="text-brand-primary">AskKh?</span>
          </h2>
          <p className="text-slate-500 mt-4 leading-relaxed">
            We believe knowledge grows when people share. AskKh was created to solve real
            problems faced by students and the ISTAD community.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition"
            >
              <div
                className={`w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center mb-4 bg-white ${
                  f.color === "red" ? "border-brand-secondary/40 text-brand-secondary" : "border-brand-primary/50 text-brand-primary"
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center order-2 md:order-1">
          <IllustrationImage src={MISSION_IMAGE_SRC} alt="Our Mission" className="w-full max-w-md" />
        </div>
        <div className="order-1 md:order-2">
          <span className="text-brand-primary text-sm font-semibold">MISSION</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">Our Mission</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            To empower the ISTAD community by providing an open, collaborative, and reliable
            platform where everyone can ask, learn, and grow together.
          </p>
          <ul className="space-y-3">
            {missionPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-slate-600">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-brand-primary text-sm font-semibold">VISION</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">Our Vision</h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              To become the leading knowledge hub for ISTAD and a trusted platform that connects
              people, ideas, and opportunities for a better future.
            </p>
            <ul className="space-y-3">
              {visionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-slate-600">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <IllustrationImage src={VISION_IMAGE_SRC} alt="Our Vision" className="w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* MENTORS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-14">
          OUR <span className="text-brand-primary">MENTORS</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {mentors.map((m) => (
            <MemberCard key={m.num} {...m} />
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-center text-2xl font-bold text-slate-900 mb-14">
            OUR <span className="text-brand-primary">TEAM</span>
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
