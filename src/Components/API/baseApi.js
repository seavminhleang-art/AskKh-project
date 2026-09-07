import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_ISHOP_URL || "",

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

  tagTypes: ["Profile", "Auth"],

  endpoints: () => ({}),
});

export default baseApi;