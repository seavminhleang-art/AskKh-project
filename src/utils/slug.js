/**
 * Converts a post title into a URL-safe slug.
 *
 * Strategy:
 *  - Attempt Unicode NFKD + ASCII-only strip (covers Latin, accented chars).
 *  - If the result is empty (e.g. pure Khmer title like "តើ Java គឺជាអ្វី?"),
 *    keep only the Latin parts of the title (like "Java") and slug those.
 *  - If still empty, fall back to the empty string so callers can use id-only URLs.
 *
 * Examples:
 *   "What is Java?"            → "what-is-java"
 *   "How to use React Hooks?"  → "how-to-use-react-hooks"
 *   "តើ Java គឺជាអ្វី?"       → "java"
 *   "純粋なタイトル"            → ""  (id-only fallback)
 */
export function toSlug(title = "") {
  if (!title) return "";

  // Step 1: NFKD normalize + strip non-ASCII
  let slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")  // remove combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")   // keep only letters, digits, spaces, hyphens
    .trim()
    .replace(/\s+/g, "-")             // spaces → hyphens
    .replace(/-+/g, "-")              // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");         // trim leading/trailing hyphens

  // Step 2: If slug is empty (e.g. pure Khmer), try extracting Latin parts only
  if (!slug) {
    slug = title
      .replace(/[^\x20-\x7E]/g, " ") // keep only printable ASCII
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Limit to 80 chars, ending cleanly on a word boundary
  if (slug.length > 80) {
    slug = slug.slice(0, 80).replace(/-[^-]*$/, "");
  }

  return slug;
}

/**
 * Builds the canonical public URL for a question.
 * Always includes the ID for stability; slug is optional for readability.
 *
 * Examples:
 *   publicQuestionPath(42, "What is Java?")  → "/questions/42/what-is-java"
 *   publicQuestionPath(42, "តើ Java?")       → "/questions/42/java"
 *   publicQuestionPath(42, "純粋なタイトル")  → "/questions/42"
 */
export function publicQuestionPath(id, title = "") {
  const slug = toSlug(title);
  return slug ? `/questions/${id}/${slug}` : `/questions/${id}`;
}
