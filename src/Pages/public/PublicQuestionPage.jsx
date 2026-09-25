/**
 * PublicQuestionPage
 *
 * A publicly accessible, search-engine crawlable page for a single NEXA question.
 *
 * Route:  /questions/:id            (id-only, backward compatible)
 *         /questions/:id/:slug      (canonical — id + slug)
 *
 * SEO:
 *  - Dynamic <title>, meta description, canonical, OG, Twitter from real API data
 *  - QAPage + Question + Answer JSON-LD structured data
 *  - noIndex = false — fully indexed
 *  - 404 behaviour: renders not-found state (React SPA 404; HTTP always 200 from Vercel)
 *
 * Architecture note:
 *  This page uses the same RTK Query hooks as the rest of the app.
 *  No server-side rendering. Google can crawl it via JavaScript rendering.
 */

import React, { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetPostByIdQuery, useGetAnswersQuery } from "../../features/posts/postApi";
import { usePageSEO } from "../../Components/common/SEO";
import { publicQuestionPath } from "../../utils/slug";

const SITE_ORIGIN = "https://ask-kh-project.vercel.app";

// ─── Helpers ────────────────────────────────────────────────────────────────

function excerpt(text = "", max = 160) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1) + "…";
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function humanDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Build QAPage JSON-LD from real API data.
 * Only includes acceptedAnswer when an answer is explicitly marked accepted.
 */
function buildQAJsonLd({ post, answers, canonicalUrl }) {
  const answerList = (answers || []).map((a) => ({
    "@type": "Answer",
    text: (a.body || "").slice(0, 2000),
    dateCreated: formatDate(a.creationDate || a.createdAt),
    author: a.ownerDisplayName
      ? { "@type": "Person", name: a.ownerDisplayName }
      : undefined,
    upvoteCount: a.score ?? 0,
  })).filter((a) => a.text.length > 0);

  const accepted = (answers || []).find(
    (a) => a.isAccepted || a.accepted || a.acceptedAnswer
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": `${canonicalUrl}#qapage`,
    url: canonicalUrl,
    name: post.title,
    description: excerpt(post.body, 200),
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      name: "NEXA",
      url: SITE_ORIGIN,
    },
    mainEntity: {
      "@type": "Question",
      "@id": `${canonicalUrl}#question`,
      name: post.title,
      text: (post.body || "").slice(0, 2000),
      dateCreated: formatDate(post.creationDate || post.createdAt),
      author: post.ownerDisplayName
        ? { "@type": "Person", name: post.ownerDisplayName }
        : undefined,
      upvoteCount: post.score ?? 0,
      answerCount: answerList.length,
      ...(accepted
        ? {
            acceptedAnswer: {
              "@type": "Answer",
              text: (accepted.body || "").slice(0, 2000),
              dateCreated: formatDate(accepted.creationDate || accepted.createdAt),
              author: accepted.ownerDisplayName
                ? { "@type": "Person", name: accepted.ownerDisplayName }
                : undefined,
              upvoteCount: accepted.score ?? 0,
            },
          }
        : {}),
      suggestedAnswer: accepted
        ? answerList.filter(
            (a) => a.text !== (accepted.body || "").slice(0, 2000)
          )
        : answerList,
    },
  };

  return schema;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PublicQuestionPage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  const postQuery = useGetPostByIdQuery(id, { skip: !id });
  const answersQuery = useGetAnswersQuery(id, { skip: !id });

  const post = postQuery.data?.data ?? postQuery.data;
  const answers = useMemo(() => {
    const raw = answersQuery.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    const d = raw.data ?? raw;
    if (Array.isArray(d)) return d;
    return d?.content ?? d?.items ?? d?.results ?? [];
  }, [answersQuery.data]);

  // Derive canonical path with slug
  const canonicalPath = post
    ? publicQuestionPath(id, post.title)
    : `/questions/${id}`;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath}`;

  // Redirect to canonical slug URL if slug is wrong or missing and post is loaded
  React.useEffect(() => {
    if (!post || postQuery.isLoading) return;
    const expectedSlug = publicQuestionPath(id, post.title).split("/")[3] || "";
    if (expectedSlug && slug !== expectedSlug) {
      navigate(canonicalPath, { replace: true });
    }
  }, [post, id, slug, canonicalPath, navigate, postQuery.isLoading]);

  // JSON-LD structured data
  const structuredData = useMemo(() => {
    if (!post) return null;
    return buildQAJsonLd({ post, answers, canonicalUrl });
  }, [post, answers, canonicalUrl]);

  // Dynamic SEO — from real API data
  usePageSEO({
    title: post?.title
      ? `${post.title} | NEXA Questions`
      : "Question | NEXA",
    description: post?.body
      ? excerpt(post.body, 160)
      : "View this community question and answers on NEXA — Cambodia's developer Q&A platform.",
    keywords: post?.tagResponses?.length
      ? post.tagResponses.map((t) => t.tagName).join(", ") +
        ", NEXA, Cambodia developer, programming Q&A"
      : "NEXA, programming Q&A, Cambodia developer community",
    canonicalUrl,
    type: "article",
    publishedTime: formatDate(post?.creationDate || post?.createdAt),
    modifiedTime: formatDate(post?.updatedAt),
    author: post?.ownerDisplayName || "NEXA Community",
    tags: post?.tagResponses?.map((t) => t.tagName) || [],
    noIndex: false,
    structuredData,
  });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (postQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-gray-500 dark:text-zinc-400 text-base animate-pulse">
          Loading question…
        </p>
      </div>
    );
  }

  // ── Not found / error ──────────────────────────────────────────────────────
  if (postQuery.isError || (!postQuery.isLoading && !post)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
          Question not found
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 text-base text-center max-w-sm">
          This question may have been removed or the link may be incorrect.
        </p>
        <Link
          to="/community/qa"
          className="mt-2 rounded-xl bg-blue-600 px-5 py-2.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Browse all questions
        </Link>
      </div>
    );
  }

  const tags = post?.tagResponses?.map((t) => t.tagName) || [];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-base text-gray-500 dark:text-zinc-400"
        >
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/community/qa" className="hover:text-blue-600 transition-colors">
            Q&amp;A Community
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-slate-300 truncate max-w-[200px]">
            {post.title}
          </span>
        </nav>

        {/* Question */}
        <article
          itemScope
          itemType="https://schema.org/Question"
          className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 mb-6"
        >
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/community/qa`}
                  className="inline-block rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-base font-medium px-3 py-1 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            itemProp="name"
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50 mb-4 leading-snug"
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-base text-gray-500 dark:text-zinc-400 mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
            <span>
              Asked by{" "}
              <strong className="text-gray-700 dark:text-slate-300">
                {post.ownerDisplayName || "Community member"}
              </strong>
            </span>
            {post.creationDate && (
              <time
                dateTime={formatDate(post.creationDate)}
                className="text-gray-400 dark:text-zinc-500"
              >
                {humanDate(post.creationDate)}
              </time>
            )}
            <span>{post.viewCount ?? 0} views</span>
            <span>{post.score ?? 0} votes</span>
          </div>

          {/* Body */}
          <div
            itemProp="text"
            className="text-base text-gray-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap"
          >
            {post.body}
          </div>

          {/* Code snippet */}
          {post.codeSnippet && (
            <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-base text-slate-100">
              <code>{post.codeSnippet}</code>
            </pre>
          )}

          {/* Images */}
          {post.imageUrls?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {post.imageUrls.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Question attachment"
                  className="max-h-80 max-w-full rounded-xl object-contain border border-gray-100 dark:border-zinc-800"
                />
              ))}
            </div>
          )}
        </article>

        {/* Answers */}
        <section aria-label="Community Answers">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-4">
            {answers.length === 0
              ? "No answers yet"
              : `${answers.length} ${answers.length === 1 ? "Answer" : "Answers"}`}
          </h2>

          {answersQuery.isLoading && (
            <p className="text-gray-400 dark:text-zinc-500 text-base animate-pulse">
              Loading answers…
            </p>
          )}

          {answers.map((answer, idx) => (
            <article
              key={answer.id ?? idx}
              itemScope
              itemType="https://schema.org/Answer"
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 mb-4"
            >
              <div className="flex items-start gap-4">
                {/* Vote count */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <span
                    itemProp="upvoteCount"
                    className="text-lg font-bold text-gray-600 dark:text-zinc-300"
                  >
                    {answer.score ?? 0}
                  </span>
                  <span className="text-base text-gray-400 dark:text-zinc-500">
                    votes
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {(answer.isAccepted || answer.accepted) && (
                    <span className="inline-block mb-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Accepted Answer
                    </span>
                  )}
                  <div
                    itemProp="text"
                    className="text-base text-gray-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap"
                  >
                    {answer.body}
                  </div>
                  {answer.codeSnippet && (
                    <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-base text-slate-100">
                      <code>{answer.codeSnippet}</code>
                    </pre>
                  )}
                  <p className="mt-3 text-base text-gray-400 dark:text-zinc-500">
                    <span itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">
                        {answer.ownerDisplayName || "Community member"}
                      </span>
                    </span>
                    {answer.creationDate && (
                      <>
                        {" · "}
                        <time dateTime={formatDate(answer.creationDate)}>
                          {humanDate(answer.creationDate)}
                        </time>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {/* CTA to join & answer */}
          <div className="mt-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-6 text-center">
            <p className="text-base text-gray-700 dark:text-slate-300 mb-3">
              Know the answer? Join NEXA and help the community!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Join NEXA
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-blue-300 dark:border-blue-700 px-5 py-2.5 text-base font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                Sign in to answer
              </Link>
            </div>
          </div>
        </section>

        {/* Back link */}
        <div className="mt-8">
          <Link
            to="/community/qa"
            className="text-base text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Browse all Q&amp;A
          </Link>
        </div>
      </div>
    </div>
  );
}
