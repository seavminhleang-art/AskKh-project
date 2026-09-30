import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "./userApi";

const CACHE_KEY = "askkh:community-members";

function normalizeMembers(response) {
  const data = response?.data ?? response;
  const members = Array.isArray(data)
    ? data
    : data?.users ?? data?.content ?? data?.items ?? data?.results ?? [];
  return members
    .filter((member) => member && (member.id != null || member.userId != null))
    .slice(0, 3)
    .map((member) => ({
      id: member.id,
      userId: member.userId,
      displayName: member.displayName,
      fullName: member.fullName,
      username: member.username,
      name: member.name,
      profileImage: member.profileImage,
      profileImageUrl: member.profileImageUrl,
      avatar: member.avatar,
      photoURL: member.photoURL,
      image: member.image,
    }));
}

function readCachedMembers() {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function usePlatformMembers() {
  const { data } = useSearchUsersQuery("");
  const [cachedMembers, setCachedMembers] = useState(readCachedMembers);
  const fetchedMembers = normalizeMembers(data);

  useEffect(() => {
    if (!fetchedMembers.length) return;
    setCachedMembers(fetchedMembers);
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedMembers));
    } catch {
      // The community avatars still render from the live query if storage is unavailable.
    }
  }, [data]);

  return fetchedMembers.length ? fetchedMembers : cachedMembers;
}
