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
  if (action === "save" && resource === "profile") {
    const saveBody = {};
    // Only include fields that are actually provided
    if (body.username !== undefined) saveBody.username = body.username;
    if (body.bio !== undefined) saveBody.bio = body.bio;
    if (body.profileImage !== undefined) saveBody.profileImage = body.profileImage;
    if (body.avatar !== undefined) saveBody.avatar = body.avatar;
    return {
      url: "/users/update-user",
      method: "PUT",
      body: saveBody,
    };
  }
  if (action === "save" && resource === "password")
    return { url: "/users/update-password", method: "PUT", body };
  if (action === "save" && resource === "avatar")
    return { url: "/users/upload-image", method: "PUT", body };
  if (action === "create" && ["posts", "reports"].includes(resource))
    return { url: paths[resource], method: "POST", body };
  if (resource === "posts" && action === "update" && key)
    return { url: `${paths.posts}/${key}`, method: "PUT", body };
  if (resource === "posts" && action === "delete" && key)
    return { url: `${paths.posts}/${key}`, method: "DELETE" };
  if (resource === "reports" && action === "update" && key)
    return { url: `${paths.reports}/${key}`, method: "PUT", body };
  if (resource === "reports" && action === "delete" && key)
    return { url: `${paths.reports}/${key}`, method: "DELETE" };
  if (action === "create" && resource === "image-upload")
    return { url: "/upload/upload-single", method: "POST", body };
  if (action === "create" && resource === "claims" && key)
    return { url: `/lost-found/reports/${key}/claims`, method: "POST", body };
  if (resource === "claims" && ["approve", "reject"].includes(action) && key)
    return { url: `/lost-found/claims/${key}/${action}`, method: "PATCH" };
  if (resource === "matches" && action === "update-status" && key)
    return {
      url: `/lost-found/matches/${key}?status=${encodeURIComponent(body.status)}`,
      method: "PATCH",
    };
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
export function isIncomingClaimNotification(notification) {
  const type = String(notification?.type || "").toUpperCase();
  return type.includes("CLAIM_SUBMITTED") || type.includes("NEW_CLAIM") || type.includes("CLAIM_CREATED") || /new claim/i.test(`${notification?.title || ""} ${notification?.message || notification?.body || ""}`);
}
export function isApprovedClaimNotification(notification) {
  const type = String(notification?.type || "").toUpperCase();
  const status = String(
    notification?.claimStatus ??
      notification?.status ??
      notification?.data?.claimStatus ??
      notification?.data?.status ??
      notification?.metadata?.claimStatus ??
      notification?.metadata?.status ??
      notification?.data?.metadata?.claimStatus ??
      notification?.data?.metadata?.status ??
      "",
  ).toUpperCase();
  return (
    (type.includes("CLAIM") && (type.includes("APPROVED") || type.includes("APPROVE"))) ||
    (type.includes("CLAIM") && status === "APPROVED")
  );
}
export function notificationClaimId(notification) {
  const notificationType = String(notification?.type || "").toUpperCase();
  if (!isIncomingClaimNotification(notification) && !notificationType.includes("CLAIM")) return null;
  const targetType = String(notification?.targetType ?? notification?.data?.targetType ?? notification?.metadata?.targetType ?? "").toUpperCase();
  const typedTargetId = targetType.includes("CLAIM")
    ? notification?.targetId ?? notification?.data?.targetId ?? notification?.metadata?.targetId
    : null;
  const directId = notification?.claimId ??
    notification?.claim?.id ??
    notification?.data?.claimId ??
    notification?.data?.claim?.id ??
    notification?.metadata?.claimId ??
    notification?.metadata?.claim?.id ??
    notification?.data?.metadata?.claimId ??
    notification?.data?.metadata?.claim?.id ??
    typedTargetId;
  if (directId != null && /^\d+$/.test(String(directId))) return String(directId);
  const target = `${notification?.targetUrl || ""} ${notification?.link || ""} ${notification?.body || notification?.message || ""} ${notification?.title || ""}`;
  return target.match(/(?:claims\/|claim(?:[-_ ]?id)?[=/ :#-]+)(\d+)/i)?.[1] ?? null;
}
export function notificationReportId(notification) {
  const targetType = String(notification?.targetType ?? notification?.data?.targetType ?? notification?.metadata?.targetType ?? "").toUpperCase();
  const typedTargetId = targetType.includes("REPORT") || targetType.includes("ITEM")
    ? notification?.targetId ?? notification?.data?.targetId ?? notification?.metadata?.targetId
    : null;
  const directId = notification?.reportId ??
    notification?.report?.id ??
    notification?.itemReportId ??
    notification?.claim?.reportId ??
    notification?.claim?.itemReportId ??
    notification?.data?.reportId ??
    notification?.data?.report?.id ??
    notification?.data?.claim?.reportId ??
    notification?.data?.claim?.itemReportId ??
    notification?.metadata?.reportId ??
    notification?.metadata?.claim?.reportId ??
    notification?.metadata?.claim?.itemReportId ??
    notification?.data?.metadata?.reportId ??
    notification?.data?.metadata?.claim?.reportId ??
    notification?.data?.metadata?.claim?.itemReportId ??
    typedTargetId;
  if (directId != null && /^\d+$/.test(String(directId))) return String(directId);
  const target = `${notification?.targetUrl || ""} ${notification?.link || ""}`;
  return target.match(/\/lost-found\/reports?\/(\d+)/i)?.[1] ?? null;
}
export function dateLabel(value, locale) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(locale);
}
export function message(error) {
  const status = error?.originalStatus ?? error?.status;
  if (status === 413) return 'The server rejected this file because it is too large. Please try a smaller image.';
  if (error?.status === 'PARSING_ERROR') {
    return `The server returned an unexpected response (HTTP ${status}). Please try again or contact support.`;
  }
  if (error?.status === 'FETCH_ERROR') return 'Cannot connect to the server. Please check your connection and try again.';
  if (error?.status === 'TIMEOUT_ERROR') return 'The server took too long to respond. Please try again.';
  return (
    error?.data?.message ||
    error?.error ||
    error?.message ||
    "Unable to complete the request. Please try again."
  );
}

export function ownReports(items, userId) {
  return userId == null ? [] : items.filter(item => item.userId != null && String(item.userId) === String(userId));
}
