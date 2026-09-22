export function workspaceRequest({
  resource,
  action = "read",
  id,
  body,
  page = 0,
}) {
  const paths = {
    profile: "/users/me",
    posts: "/posts",
    reports: "/lost-found/reports",
    tags: "/tags",
    categories: "/lost-found/categories",
    locations: "/lost-found/locations",
    unread: "/notifications/unread-count",
  };
  const key = id == null ? "" : encodeURIComponent(id);
  if (action === "read") {
    if (resource === "my-posts" && key) return `/posts/user/${key}`;
    if (paths[resource]) return paths[resource];
    if (resource === "notifications")
      return `/notifications?page=${page}&size=20`;
    if (["claims", "matches"].includes(resource) && key)
      return `/lost-found/reports/${key}/${resource}`;
    if (resource === "post" && key) return `/posts/${key}`;
    if (resource === "answers" && key) return `/posts/answers/${key}`;
  }
  if (action === "save" && resource === "profile")
    return {
      url: "/users/update-user",
      method: "PUT",
      body: { username: body.username, bio: body.bio },
    };
  if (action === "save" && resource === "password")
    return { url: "/users/update-password", method: "PUT", body };
  if (action === "save" && resource === "avatar")
    return { url: "/users/upload-image", method: "PUT", body };
  if (action === "create" && ["posts", "reports"].includes(resource))
    return { url: paths[resource], method: "POST", body };
  if (action === "create" && resource === "image-upload")
    return { url: "/upload/upload-single", method: "POST", body };
  if (action === "create" && resource === "post-images")
    return { url: "/posts/with-images", method: "POST", body };
  if (action === "create" && resource === "claims" && key)
    return { url: `/lost-found/reports/${key}/claims`, method: "POST", body };
  if (resource === "notifications" && action === "read-all")
    return { url: "/notifications/read-all", method: "PATCH" };
  if (resource === "notifications" && action === "mark-read" && key)
    return { url: `/notifications/${key}/read`, method: "PATCH" };
  throw new Error("This action is not available.");
}
export function rows(value) {
  const data = value?.data ?? value;
  if (data == null) return [];
  const result = Array.isArray(data)
    ? data
    : (data.content ?? data.items ?? data.results);
  if (!Array.isArray(result))
    throw new Error("Unexpected list response from the API.");
  return result;
}
export function ownClaims(items, userId) {
  return userId == null
    ? []
    : items.filter((item) => String(item.claimantUserId) === String(userId));
}
export function dateLabel(value, locale) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(locale);
}
export function message(error) {
  if (error?.status === 'FETCH_ERROR') return 'Cannot connect to the server. Please check your connection and try again.';
  if (error?.status === 'TIMEOUT_ERROR') return 'The server took too long to respond. Please try again.';
  return (
    error?.data?.message ||
    error?.error ||
    error?.message ||
    "Unable to complete the request. Please try again."
  );
}
