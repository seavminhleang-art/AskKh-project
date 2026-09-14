import React from "react";
import Navbar from "../Nav/NavBarComponent.jsx";
import FooterComponent from "../Footer/FooterComponet.jsx";

// ---------- Data ----------
// Each section is either a list of plain paragraphs, a bullet list, or both.
// `paragraphs` renders before the list (if any), `list` renders as bullet points,
// `outro` renders after the list.
const sections = [
  {
    num: 1,
    title: "Acceptance of Terms",
    paragraphs: [
      "By registering, logging in, posting an item, submitting a claim, or using any feature of the system, you agree to these Terms & Conditions. If you do not agree with these terms, please do not use the platform.",
    ],
  },
  {
    num: 2,
    title: "User Accounts",
    paragraphs: [
      "Users must provide accurate information when creating an account. Users are responsible for keeping their account information secure and must not share their account with others.",
      "The system supports different user roles, including:",
    ],
    list: ["Administrator", "Moderator", "ISTAD Member", "Public User"],
    outro: [
      "ISTAD members may be automatically verified when registering with an approved ISTAD email address. Public users may receive an unverified status.",
    ],
  },
  {
    num: 3,
    title: "Lost and Found Reports",
    paragraphs: [
      "Users may create reports for lost or found items. Reports may include:",
    ],
    list: [
      "Item title",
      "Category",
      "Description",
      "Date",
      "Location",
      "Photo",
      "Report scope",
      "Item status",
    ],
    outro: [
      "Users must provide truthful and accurate information. Users must not intentionally create fake, misleading, or fraudulent reports.",
      "Users are responsible for the content of their own reports and may edit or delete their own posts where the system allows.",
    ],
  },
  {
    num: 4,
    title: "Report Scope and Locations",
    paragraphs: ["Users must select the appropriate report scope:"],
    list: [
      "ISTAD: For items related to or located within the institute.",
      "Public: For items located in public areas or outside the institute.",
    ],
    outro: [
      "ISTAD reports may use structured locations such as building, floor, and room. Public reports may use a map location or free-text location.",
      "Users should avoid publishing sensitive personal information in location descriptions.",
    ],
  },
  {
    num: 5,
    title: "Claims and Verification",
    paragraphs: [
      "Users who believe they own a found item may submit a claim.",
      "A claimant may be required to provide a hidden identifying detail that was recorded by the finder. This information is used to help verify ownership.",
      "The finder may approve or reject a claim based on the information provided.",
      "Each user is limited to three failed claim attempts per item. Users must not repeatedly submit false claims or attempt to obtain property that does not belong to them.",
      "Contact information may only be revealed after an appropriate claim has been approved.",
    ],
  },
  {
    num: 6,
    title: "Item Return and Handover",
    paragraphs: [
      "Users may confirm when an item has been successfully returned.",
      "For ISTAD-scope items, authorized ISTAD staff may record that an item is being held at the institute office and may record the claimant's identity when the item is collected.",
      "Users should cooperate honestly during the handover process.",
    ],
  },
  {
    num: 7,
    title: "Prohibited Activities",
    paragraphs: ["Users must not use the platform to:"],
    list: [
      "Submit fake lost or found reports",
      "Make fraudulent claims",
      "Misrepresent ownership of an item",
      "Harass, threaten, or abuse other users",
      "Spam the platform",
      "Publish inappropriate or illegal content",
      "Share another person's private contact information publicly",
      "Attempt to bypass claim or verification controls",
      "Use the platform for purposes unrelated to lost and found services",
    ],
  },
  {
    num: 8,
    title: "Content Moderation",
    paragraphs: [
      "Public-scope reports may be reviewed by moderators before publication.",
      "Users may report suspicious or inappropriate content. Posts that receive multiple flags may be automatically hidden and reviewed by moderators or administrators.",
      "Moderators and administrators may remove content that violates these Terms & Conditions.",
    ],
  },
  {
    num: 9,
    title: "Posting Limits",
    paragraphs: [
      "To reduce spam and misuse, each user may create a maximum of five posts per day.",
      "The system may restrict posting privileges when unusual or abusive activity is detected.",
    ],
  },
  {
    num: 10,
    title: "Post Expiration",
    paragraphs: [
      "Lost and found reports automatically expire after 30 days.",
      "Users may receive a reminder before expiration and may extend an eligible post once.",
      "Expired reports are moved to an archive. Administrators may manage archived items, including marking items as donated or disposed of according to applicable procedures.",
    ],
  },
  {
    num: 11,
    title: "Notifications and Matching",
    paragraphs: ["The system may send email and in-app notifications regarding:"],
    list: [
      "Potential item matches",
      "New claims",
      "Approved or rejected claims",
      "Expiring posts",
      "Other important account or item activities",
    ],
    outro: [
      "Automatic matching is provided as an assistance feature. A suggested match does not guarantee that two reports refer to the same item.",
      "Users must verify ownership before completing a return.",
    ],
  },
  {
    num: 12,
    title: "Badges and Contributions",
    paragraphs: [
      "The platform may award contribution badges based on successfully returned items.",
      "Badges are intended to recognize positive contributions and do not represent ownership, authority, or official certification.",
    ],
  },
  {
    num: 13,
    title: "Administrator Rights",
    paragraphs: ["Administrators may:"],
    list: [
      "Manage user accounts",
      "Manage categories",
      "Manage ISTAD locations",
      "Review reports and claims",
      "Moderate content",
      "View system statistics",
      "Export system records",
      "Archive or manage expired records",
    ],
    outro: [
      "Administrators may restrict or suspend accounts that violate these Terms & Conditions.",
    ],
  },
  {
    num: 14,
    title: "System Availability",
    paragraphs: [
      "We aim to keep the platform available and functioning properly. However, temporary interruptions may occur because of maintenance, technical problems, updates, or other circumstances.",
      "The platform does not guarantee that every lost item will be found or returned.",
    ],
  },
  {
    num: 15,
    title: "Changes to These Terms",
    paragraphs: [
      "These Terms & Conditions may be updated when the system, features, or rules change. Updated terms will be made available through the platform.",
      "Continued use of the platform after changes means that the user accepts the updated terms.",
    ],
  },
  {
    num: 16,
    title: "Contact",
    paragraphs: [
      "If you have questions, concerns, or reports about these Terms & Conditions, please contact the system administrator through the contact information provided on the platform.",
    ],
  },
];

// ---------- Reusable pieces ----------
function SectionBlock({ num, title, paragraphs = [], list, outro = [] }) {
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

          {list && (
            <ul className="space-y-2 mb-3">
              {list.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
export default function TermsAndConditions() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-slate-500 mt-3">Last Updated: September 2026</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-slate-600 leading-relaxed">
          Welcome to our Lost &amp; Found platform. By creating an account or using
          this system, you agree to follow these Terms &amp; Conditions. These terms
          are designed to keep the platform safe, reliable, and useful for all
          users.
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
