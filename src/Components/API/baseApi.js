import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../features/auth/authSlice";

// --- Plain query: attaches the bearer token to every request ---
const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_FORUM_LOST_URL ,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// --- Wrapped query: handles 401 by refreshing the token and retrying once ---
let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (error, token) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    pendingQueue = [];
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if (isRefreshing) {
            // Queue this request until the in-flight refresh resolves
            try {
                await new Promise((resolve, reject) => {
                    pendingQueue.push({ resolve, reject });
                });
                result = await rawBaseQuery(args, api, extraOptions);
            } catch (err) {
                return result;
            }
        } else {
            isRefreshing = true;
            try {
                const refreshResult = await rawBaseQuery(
                    { url: "/auth/refresh", method: "POST" },
                    api,
                    extraOptions
                );

                if (refreshResult.data?.accessToken) {
                    api.dispatch(setCredentials(refreshResult.data));
                    resolveQueue(null, refreshResult.data.accessToken);
                    result = await rawBaseQuery(args, api, extraOptions);
                } else {
                    resolveQueue(refreshResult.error, null);
                    api.dispatch(logout());
                    window.location.href = "/login";
                }
            } finally {
                isRefreshing = false;
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "User",
        "Post",
        "Comment",
        "Tag",
        "Vote",
        "Bookmark",
        "LostFoundReport",
        "LostFoundClaim",
        "LostFoundMatch",
        "LostFoundLocation",
        "LostFoundCategory",
        "Notification",
    ],
    // Feature files inject their own endpoints via baseApi.injectEndpoints()
    endpoints: () => ({}),
});