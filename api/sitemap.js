/**
 * api/sitemap.js — Dynamic XML Sitemap (Vercel Serverless Function)
 *
 * Serves /sitemap.xml with:
 *  - Static public pages (home, community/qa, lost-found, leaderboard, about, etc.)
 *  - Dynamic public question pages (/questions/:id/:slug) fetched from the NEXA API
 *
 * Question pages are included only if postTypeId === 1 (questions, not answers).
 * Private/dashboard/admin pages are NEVER included.
 *
 * Cache: 1 hour (max-age=3600) to keep question list fresh without hammering the API.
 */

const SITE_ORIGIN = "https://ask-kh-project.vercel.app";
const API_BASE = "https://forum-istad-api.cheat.casa/api/v1";
const TODAY = new Date().toISOString().slice(0, 10);

/** Static pages that are always in the sitemap */
const STATIC_URLS = [
  { loc: `${SITE_ORIGIN}/`,                    lastmod: TODAY, changefreq: "daily",   priority: "1.0" },
  { loc: `${SITE_ORIGIN}/community/qa`,         lastmod: TODAY, changefreq: "hourly",  priority: "0.9" },
  { loc: `${SITE_ORIGIN}/community/lost-found`, lastmod: TODAY, changefreq: "hourly",  priority: "0.9" },
  { loc: `${SITE_ORIGIN}/leaderboard`,          lastmod: TODAY, changefreq: "daily",   priority: "0.8" },
  { loc: `${SITE_ORIGIN}/about`,                lastmod: TODAY, changefreq: "weekly",  priority: "0.7" },
  { loc: `${SITE_ORIGIN}/terms`,                lastmod: TODAY, changefreq: "monthly", priority: "0.4" },
  { loc: `${SITE_ORIGIN}/privacy-policy`,       lastmod: TODAY, changefreq: "monthly", priority: "0.4" },
];

/**
 * Convert a post title to a URL-safe ASCII slug.
 * Same logic as src/utils/slug.js — duplicated here because edge functions
 * cannot import from the Vite/React source tree.
 */
function toSlug(title = "") {
  if (!title) return "";
  let slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) {
    slug = title
      .replace(/[^\x20-\x7E]/g, " ")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (slug.length > 80) {
    slug = slug.slice(0, 80).replace(/-[^-]*$/, "");
  }
  return slug;
}

function questionUrl(post) {
  const slug = toSlug(post.title || "");
  const base = `${SITE_ORIGIN}/questions/${post.id}`;
  return slug ? `${base}/${slug}` : base;
}

function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod || TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/** Fetch all public questions from the NEXA API */
async function fetchQuestions() {
  try {
    const res = await fetch(`${API_BASE}/posts`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Handle both array and paginated response shapes
    const data = json?.data ?? json;
    let posts = Array.isArray(data)
      ? data
      : data?.content ?? data?.items ?? data?.results ?? [];
    // Only include actual questions (postTypeId === 1), not answers (postTypeId === 2)
    return posts.filter(
      (p) => p.id && (p.postTypeId === 1 || p.postTypeId == null)
    );
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  const questions = await fetchQuestions();

  const questionEntries = questions.map((post) => {
    const lastmod = post.updatedAt || post.creationDate
      ? new Date(post.updatedAt || post.creationDate).toISOString().slice(0, 10)
      : TODAY;
    return urlEntry({
      loc: questionUrl(post),
      lastmod,
      changefreq: "weekly",
      priority: "0.8",
    });
  });

  const staticEntries = STATIC_URLS.map(urlEntry);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticEntries.join("\n")}
${questionEntries.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
