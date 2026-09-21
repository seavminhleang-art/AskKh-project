import { FORUM_API_BASE_URL } from '@/config/forumApi';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: FORUM_API_BASE_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,

  tagTypes: [
    "Auth",
    "Bookmark",
    "LostFoundClaim",
    "LostFoundMatch",
    "LostFoundReport",
    "Notification",
    "Post",
    "Profile",
    "Tag",
    "User",
    "Vote",
  ],

  endpoints: () => ({}),
});

export default baseApi;
export { baseApi };
