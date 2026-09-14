import React from "react";
import Navbar from "../Nav/NavBarComponent.jsx";
import FooterComponent from "../Footer/FooterComponet.jsx";

// ---------- Data ----------
// Each section has paragraphs, an optional bullet list, and an optional
// nested sub-list layout for "Information We Collect" (grouped sub-headings).
const sections = [
  {
    num: 1,
    title: "Information We Collect",
    paragraphs: ["Depending on how the system is used, we may collect:"],
    groups: [
      {
        heading: "Account Information",
        items: ["Name", "Email address", "Password information", "Account role", "Verification status"],
      },
      {
        heading: "Lost & Found Information",
        items: [
          "Item title",
          "Category",
          "Description",
          "Date",
          "Location",
          "Photos",
          "Item type",
          "Report scope",
          "Item status",
        ],
      },
      {
        heading: "Claim Information",
        items: [
          "Claim description",
          "Hidden identifying details provided during verification",
          "Claim status",
          "Return confirmation",
        ],
      },
      {
        heading: "Activity Information",
        items: [
          "Posts created by the user",
          "Claims submitted by the user",
          "Successfully returned items",
          "Contribution badges",
          "Notifications and system activity",
        ],
      },
    ],
    outro: [
      "For ISTAD-scope items, authorized staff may also record information needed to identify the person who collects an item.",
    ],
  },
  {
    num: 2,
    title: "How We Use Information",
    paragraphs: ["We use collected information to:"],
    list: [
      "Create and manage user accounts",
      "Verify ISTAD membership",
      "Publish and manage lost and found reports",
      "Search and filter items",
      "Match lost items with found items",
      "Process and verify claims",
      "Support item returns",
      "Send notifications",
      "Prevent spam and misuse",
      "Moderate reports",
      "Manage user accounts",
      "Generate system statistics and reports",
      "Improve the platform",
    ],
  },
  {
    num: 3,
    title: "Public Information",
    paragraphs: [
      "Information included in a published lost or found report may be visible to other users depending on the report scope and system settings.",
      "Users should not include unnecessary personal information in public descriptions.",
      "The system is designed to prevent contact details from being publicly posted through free-text fields.",
    ],
  },
  {
    num: 4,
    title: "Hidden Identifying Information",
    paragraphs: [
      "When a user reports a found item, the system may store a hidden identifying detail.",
      "This information is not displayed publicly and is used to help verify whether a claimant is likely to be the rightful owner.",
      "The hidden identifying detail should only be used for the claim verification process.",
    ],
  },
  {
    num: 5,
    title: "Contact Information",
    paragraphs: [
      "Contact information is protected during the claim process.",
      "Where applicable, the system only reveals contact information after a claim has been approved.",
      "Users should not attempt to bypass this process by publishing or requesting private contact information through inappropriate methods.",
    ],
  },
  {
    num: 6,
    title: "Location Information",
    paragraphs: [
      "The platform may collect location information provided in lost and found reports.",
      "For ISTAD reports, locations may include building, floor, and room.",
      "For public reports, users may provide a map location or free-text location.",
      "Users should avoid entering private addresses or unnecessary personal location information.",
    ],
  },
  {
    num: 7,
    title: "Photos and User Content",
    paragraphs: [
      "Users may upload photos of lost or found items.",
      "Users should only upload photos that are relevant to the report and should avoid including unnecessary personal information, identification documents, passwords, or other sensitive information.",
      "Users are responsible for the content they upload.",
    ],
  },
  {
    num: 8,
    title: "Information Sharing",
    paragraphs: [
      "User information may be accessible to authorized administrators, moderators, or ISTAD staff when necessary to operate the platform, moderate content, verify claims, or support item handover.",
      "The platform does not intentionally make private claim information publicly available.",
      "Information may also be disclosed when required to comply with applicable laws or legitimate institutional requirements.",
    ],
  },
  {
    num: 9,
    title: "Data Security",
    paragraphs: [
      "We take reasonable measures to protect user information from unauthorized access, modification, disclosure, or loss.",
      "However, no online system can guarantee complete security. Users should protect their passwords and avoid sharing their account credentials.",
    ],
  },
  {
    num: 10,
    title: "Data Retention",
    paragraphs: [
      "Lost and found reports normally remain active for up to 30 days unless extended according to the system rules.",
      "Expired reports may be moved to an archive for administrative purposes.",
      "Records related to claims, returns, moderation, and administration may be retained as necessary for system operation and record management.",
    ],
  },
  {
    num: 11,
    title: "Notifications",
    paragraphs: [
      "The system may use users' email addresses and account information to send important notifications, including:",
    ],
    list: [
      "Potential matches",
      "New claims",
      "Claim approval or rejection",
      "Expiration reminders",
      "Other important system messages",
    ],
  },
  {
    num: 12,
    title: "User Rights",
    paragraphs: [
      "Depending on applicable rules and system functionality, users may be able to:",
    ],
    list: [
      "Review their account information",
      "Edit their own profile information",
      "Edit their own reports",
      "Delete their own reports",
      "Review their claims",
      "Request assistance regarding their personal information",
    ],
    outro: [
      "Users may contact the system administrator if they have questions about their information.",
    ],
  },
  {
    num: 13,
    title: "Children's and Young Users' Privacy",
    paragraphs: [
      "Users should only create accounts and use the platform in accordance with the applicable age requirements and institutional rules.",
      "The platform should not be used to intentionally collect unnecessary personal information from children.",
    ],
  },
  {
    num: 14,
    title: "Changes to This Privacy Policy",
    paragraphs: [
      "This Privacy Policy may be updated when system features, privacy practices, or applicable requirements change.",
      "The latest version will be made available through the platform.",
    ],
  },
  {
    num: 15,
    title: "Contact",
    paragraphs: [
      "For questions, concerns, or requests related to privacy, users should contact the system administrator through the contact information provided on the platform.",
    ],
  },
];

// ---------- Reusable pieces ----------
function BulletList({ items }) {
  return (
    <ul className="space-y-2 mb-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-slate-600">
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
          <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>

          {paragraphs.map((p, i) => (
            <p key={i} className="text-slate-600 leading-relaxed mb-3">
              {p}
            </p>
          ))}

          {list && <BulletList items={list} />}

          {groups && (
            <div className="space-y-4 mb-3">
              {groups.map((g, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-brand-primary mb-2">
                    {g.heading}
                  </h3>
                  <BulletList items={g.items} />
                </div>
              ))}
            </div>
          )}

          {outro.map((p, i) => (
            <p key={i} className="text-slate-600 leading-relaxed mb-3">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function PrivacyPolicy() {
  return (
    <div className="bg-white text-slate-800 antialiased">
      <Navbar />

      {/* HERO */}
      <section className="bg-brand-primary-light">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="text-brand-primary text-sm font-semibold uppercase tracking-wide">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mt-3">Last Updated: September 2026</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-slate-600 leading-relaxed">
          This Privacy Policy explains how our Lost &amp; Found platform collects,
          uses, stores, and protects information when users access and use the
          system.
        </p>
      </section>

      {/* SECTIONS */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="space-y-10">
          {sections.map((s) => (
            <SectionBlock key={s.num} {...s} />
          ))}
        </div>
      </section>

      <FooterComponent />
    </div>
  );
}
