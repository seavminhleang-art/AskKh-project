export function normalizeTag(value) {
  return value.normalize("NFC").trim().replace(/^#+/, "").replace(/\s+/gu, "_").toLowerCase();
}

export function matchingTags(tags, input) {
  const name = normalizeTag(input);
  return tags.filter(tag => normalizeTag(tag.tagName).includes(name))
    .sort((a, b) => Number(normalizeTag(b.tagName).startsWith(name)) - Number(normalizeTag(a.tagName).startsWith(name)) || (b.count || 0) - (a.count || 0));
}

export async function resolveTag(name, tags, create, reload) {
  const existing = tags.find(tag => normalizeTag(tag.tagName) === name);
  if (existing) return existing;
  try {
    const response = await create(name).unwrap();
    const tag = response?.data ?? response;
    if (tag?.id == null || typeof tag.tagName !== "string") throw new Error("Invalid tag response.");
    return tag;
  } catch (error) {
    if (error.status === 409) {
      const refreshed = await reload();
      const match = refreshed.find(tag => normalizeTag(tag.tagName) === name);
      if (match) return match;
    }
    throw error;
  }
}
