import baseApi from "./baseApi.js";

export const profileApi =
  baseApi.injectEndpoints({
    endpoints: (
      builder,
    ) => ({
      userProfile:
        builder.query({
          query: () =>
            "/users/me",

          providesTags: [
            "Profile",
          ],
        }),
    }),
  });

export const {
  useUserProfileQuery,
} = profileApi;