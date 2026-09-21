import { FORUM_API_BASE_URL } from "@/config/forumApi";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/Components/Firebase/firebase";

const rawRequest = fetchBaseQuery({
  baseUrl: FORUM_API_BASE_URL,
  timeout: 15000,
  prepareHeaders: async (headers, { getState }) => {
    const token = auth.currentUser
      ? await auth.currentUser.getIdToken()
      : getState().auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Keep backend authorization failures visible without clearing the Firebase session.
export async function request(args, api, options) {
  try {
    let response = await rawRequest(args, api, options);
    if (response.error?.status === 401 && auth.currentUser) {
      await auth.currentUser.getIdToken(true);
      response = await rawRequest(args, api, options);
    }
    return response;
  } catch (error) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: error.message || "Unable to authenticate the API request.",
      },
    };
  }
}
