import { Link } from "react-router";

const LAST_UPDATED = "September 12, 2026";

const TERMS_SECTIONS = [
  {
    heading: "About NEXA",
    paragraphs: [
      "NEXA is a community platform designed to help users connect with others, ask and answer questions, exchange information, participate in discussions, and report lost or found items.",
      "By accessing or using NEXA, you agree to these Terms of Service. If you do not agree with these Terms, please do not use the platform.",
    ],
  },
  {
    heading: "Platform features",
    paragraphs: [
      "NEXA provides community features including:",
      "NEXA may provide certain features specifically for members of the ISTAD community, while other features may be available to public users. Some features require an account.",
    ],
    bullets: [
      "Questions and answers",
      "Posts and discussions",
      "Comments and interactions",
      "Search and discovery",
      "User profiles",
      "Community reputation and achievements",
      "Lost and Found reports",
      "Notifications",
      "Moderation and administration features",
    ],
  },
  {
    heading: "Accounts and security",
    paragraphs: [
      "When creating an account, you agree to provide accurate information and keep your login credentials secure. You are responsible for activity performed through your account.",
      "NEXA may suspend accounts that violate these Terms.",
    ],
    bullets: [
      "Impersonate another person",
      "Create accounts using another person's identity",
      "Share your password with unauthorized users",
      "Attempt to gain access to another user's account",
      "Use automated systems to create fake accounts",
    ],
    intro: "You must not:",
  },
  {
    heading: "Account verification",
    paragraphs: [
      "NEXA may identify certain accounts as verified ISTAD members based on information such as an approved institutional email address or another verification method.",
      "A verification badge only indicates that the platform has completed its available verification process. It does not guarantee that every statement made by that user is accurate. Public users may receive a different account status or badge.",
    ],
  },
  {
    heading: "User content and conduct",
    paragraphs: [
      "Users may submit content including questions, answers, comments, posts, images, Lost and Found reports, and profile information. You remain responsible for the content you submit.",
      "NEXA may remove or restrict content that violates these rules.",
    ],
    intro: "You agree not to post content that:",
    bullets: [
      "Is illegal",
      "Threatens or harasses another person",
      "Contains hate speech",
      "Contains intentionally false or misleading information",
      "Violates another person's intellectual property",
      "Publishes private information without permission",
      "Contains malware or malicious links",
      "Promotes spam or fraudulent activity",
      "Attempts to manipulate votes, reputation, or platform systems",
    ],
  },
  {
    heading: "Community information",
    paragraphs: [
      "NEXA allows members to exchange knowledge. Information posted by users represents the views of those users and should not automatically be considered professional advice.",
      "NEXA does not guarantee that answers are complete, correct, or suitable for every situation. For important medical, legal, financial, security, or other professional decisions, users should consult an appropriately qualified professional.",
    ],
  },
  {
    heading: "Lost and Found",
    paragraphs: [
      "NEXA allows users to report lost and found items. Users submitting a report should provide only information necessary to identify or recover the item.",
      "For security reasons, users should avoid publishing sensitive identifying information about found items when that information could be used by someone to falsely claim ownership. NEXA may allow certain identifying details to remain private and be used for ownership verification.",
      "NEXA does not guarantee the recovery of any lost item and does not determine legal ownership of property. Users should arrange item exchanges in a safe location whenever possible.",
    ],
    intro: "Users must not use the Lost and Found feature to:",
    bullets: [
      "Sell stolen property",
      "Falsely claim an item",
      "Misrepresent ownership",
      "Obtain private information about another user",
      "Arrange unsafe or fraudulent transactions",
    ],
  },
  {
    heading: "Reputation and achievements",
    paragraphs: [
      "NEXA may provide likes, votes, badges, reputation points, rankings, or achievements. These features are intended to encourage useful participation.",
      "Users must not manipulate these systems through fake accounts, coordinated voting, automated tools, or other artificial methods. NEXA may adjust or remove reputation or achievements where abuse is detected.",
    ],
  },
  {
    heading: "Moderation",
    paragraphs: [
      "NEXA may use Administrators and Moderators to help maintain the community. Moderation decisions may be based on these Terms, community guidelines, safety considerations, or applicable law.",
    ],
    intro: "They may:",
    bullets: [
      "Review reports",
      "Remove inappropriate content",
      "Restrict certain features",
      "Warn users",
      "Temporarily suspend accounts",
      "Permanently disable accounts",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "The NEXA name, branding, user interface, original graphics, software, and other platform materials may be protected by intellectual-property laws. Users retain ownership of original content they create.",
      "By publishing content on NEXA, you grant NEXA a non-exclusive permission to host, display, reproduce, and technically process that content as necessary to operate the service. This permission ends when the content is deleted, except where retention is required for legal, security, backup, or moderation purposes.",
    ],
  },
  {
    heading: "Availability and liability",
    paragraphs: [
      "We aim to keep NEXA available and reliable, but we do not guarantee uninterrupted operation. Features may occasionally be changed, suspended, or removed for maintenance, security, technical improvements, legal requirements, or platform development.",
      "NEXA provides a community platform and does not control every action or statement made by users. To the extent permitted by applicable law, NEXA is not responsible for losses arising solely from reliance on user-generated information, failed Lost and Found exchanges, unauthorized third-party conduct, or temporary service interruptions.",
      "Nothing in these Terms excludes rights or obligations that cannot legally be excluded under Cambodian law.",
    ],
  },
  {
    heading: "Termination, changes, and governing law",
    paragraphs: [
      "NEXA may restrict or terminate access where a user seriously violates these Terms, repeatedly violates community rules, engages in fraudulent activity, creates security risks, or violates applicable law. Users may also request account deletion.",
      "We may update these Terms as NEXA develops. When significant changes are made, we may notify users through the platform or another appropriate method. Continued use after an updated version becomes effective constitutes acceptance of the updated Terms, where legally permitted.",
      "These Terms are governed by the applicable laws of the Kingdom of Cambodia, unless another law must apply as a matter of mandatory law.",
    ],
  },
];

const PRIVACY_SECTIONS = [
  {
    heading: "Our approach to privacy",
    paragraphs: [
      "NEXA respects user privacy and aims to collect only the information reasonably necessary to operate the platform. This Privacy Policy explains what information may be collected, why it is used, and the choices available to users.",
    ],
  },
  {
    heading: "Information we may collect",
    paragraphs: [
      "When you register, we may collect:",
      "We should never store passwords in readable plain text.",
      "We may process content such as questions, answers, comments, Lost and Found reports, uploaded images, tags, profile information, and reports sent to moderators.",
      "A Lost and Found report may contain an item name, category, description, date, general location, photograph, and lost/found status. Certain identifying information may be intentionally kept private to help verify ownership.",
      "NEXA may automatically receive information such as IP address, browser type, device type, login timestamps, security logs, basic usage activity, and error logs. This information may be used for security, debugging, and service improvement.",
    ],
    bullets: [
      "Name",
      "Username",
      "Email address",
      "Profile image",
      "Password in securely hashed form",
      "Account role",
      "Verification status",
    ],
  },
  {
    heading: "How we use information",
    paragraphs: ["We may use personal information to:"],
    bullets: [
      "Create and manage accounts",
      "Authenticate users",
      "Verify eligible ISTAD members",
      "Display profiles and user contributions",
      "Enable questions, answers and comments",
      "Operate Lost and Found features",
      "Provide notifications",
      "Improve search and recommendations",
      "Prevent abuse and fraud",
      "Moderate content",
      "Protect account security",
      "Diagnose technical problems",
      "Comply with applicable legal obligations",
    ],
  },
  {
    heading: "Public and private information",
    paragraphs: [
      "Information you intentionally post publicly may be visible to other users. This may include your username, profile picture, questions, answers, comments, public Lost and Found reports, reputation, and achievements. Do not publish information you want to remain private.",
      "Information such as passwords, private verification information, hidden Lost and Found identifiers, and certain account-security information should not be publicly displayed. Access should be limited to systems or authorized personnel that require it.",
    ],
  },
  {
    heading: "Sharing information",
    paragraphs: [
      "NEXA does not sell users' personal information. Information may be shared when reasonably necessary with:",
      "Service providers should receive only the information necessary to perform their function.",
    ],
    bullets: [
      "Service providers supporting hosting, authentication, databases, email, analytics, or security",
      "Authorized NEXA administrators or moderators",
      "Government authorities where legally required",
      "Security professionals where necessary to investigate serious abuse or security incidents",
    ],
  },
  {
    heading: "Cookies and similar technologies",
    paragraphs: [
      "NEXA may use cookies, local storage, or similar technologies to keep users logged in, remember preferences, support theme or language settings, protect sessions, and improve platform functionality.",
      "Where legally required, users should be given appropriate information or choices concerning non-essential tracking technologies.",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "NEXA should use reasonable technical and organizational safeguards, such as password hashing, secure authentication, access controls, HTTPS encryption, database protections, session security, administrative access restrictions, and security monitoring.",
      "No internet-based system can guarantee absolute security.",
    ],
  },
  {
    heading: "Retention",
    paragraphs: [
      "NEXA should retain information only for as long as reasonably necessary for providing the service, maintaining security, resolving disputes, preventing abuse, and fulfilling legal obligations.",
      "Deleted information may remain temporarily in backups or security records before being permanently removed.",
    ],
  },
  {
    heading: "Your choices and requests",
    paragraphs: [
      "Subject to applicable law and technical limitations, users may be able to:",
      "Requests can be submitted through [privacy contact email].",
      "Users may request deletion of their account. Some information may need to be retained where necessary for security, fraud prevention, dispute resolution, moderation history, or legal compliance. Where appropriate, public contributions may instead be anonymized.",
    ],
    bullets: [
      "Update profile information",
      "Edit or delete their own posts",
      "Delete Lost and Found reports",
      "Change account preferences",
      "Request account deletion",
      "Request information about their stored personal data",
      "Request correction of inaccurate information",
    ],
  },
  {
    heading: "External services and international processing",
    paragraphs: [
      "NEXA may rely on external services such as hosting providers, authentication providers, analytics tools, email services, or cloud databases. Those providers may process information according to their own terms and privacy policies. NEXA should review such providers before integrating them.",
      "Some technical service providers may process information outside Cambodia. Where this occurs, NEXA should use reasonable safeguards and comply with applicable Cambodian requirements concerning data handling and transfers.",
    ],
  },
  {
    heading: "Children's privacy",
    paragraphs: [
      "NEXA should not intentionally collect personal information from users who are below the minimum age permitted under applicable law without the required authorization or consent. If the platform is later intentionally made available to younger students, additional safeguards should be implemented.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "We may update this Privacy Policy when our platform, technology, or legal obligations change. The latest version will be published with an updated effective date.",
      "For privacy questions or requests: NEXA Privacy Team. Email: privacy@nexa.com. Operator: Nexa Development Team. Country: Kingdom of Cambodia.",
    ],
  },
];

const DOCUMENTS = {
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    intro: "Please read these Terms carefully before using NEXA.",
    sections: TERMS_SECTIONS,
    contact:
      "Questions regarding these Terms can be sent to NEXA Team at privacy@nexa.com. Organization: Nexa Development Team. Location: Cambodia.",
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro:
      "This policy explains how NEXA may collect, use, and protect information.",
    sections: PRIVACY_SECTIONS,
    contact:
      "For privacy questions or requests, contact NEXA Privacy Team at privacy@nexa.com.",
  },
};

export default function LegalPage({ documentType }) {
  const document = DOCUMENTS[documentType];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 sm:px-8 sm:py-12">
      <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-14">
        <Link
          to="/"
          className="inline-flex rounded-lg px-1 text-lg font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          ← Back to website
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          <p className="text-lg font-semibold uppercase tracking-[0.18em] text-blue-700">
            {document.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {document.title}
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            {document.intro}
          </p>

          <p className="mt-4 text-lg font-medium text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-slate-950">
                {section.heading}
              </h2>

              <div className="mt-3 space-y-3 text-[18px] leading-7 text-slate-700 sm:text-base">
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.intro && <p>{section.intro}</p>}

                {section.bullets && (
                  <ul className="list-disc space-y-1 pl-6 marker:text-blue-600">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl bg-slate-50 p-5 text-lg leading-6 text-slate-600">
          {document.contact}
        </aside>
      </article>
    </main>
  );
}
