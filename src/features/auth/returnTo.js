const COMMUNITY_LOST_FOUND_PATH = "/community/lost-found";

export function claimReturnPath(reportId) {
  const id = String(reportId ?? "").trim();
  return id
    ? `${COMMUNITY_LOST_FOUND_PATH}?claim=${encodeURIComponent(id)}`
    : COMMUNITY_LOST_FOUND_PATH;
}

export function loginReturnPath(search = "") {
  const returnTo = new URLSearchParams(search).get("returnTo");

  // Only allow the public lost-and-found page. This prevents a login URL from
  // being used to redirect someone to an unrelated site after sign-in.
  return returnTo?.startsWith(COMMUNITY_LOST_FOUND_PATH) ? returnTo : null;
}
