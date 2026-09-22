import { baseApi } from "../../store/api/baseApi";
import { request } from "../../store/api/forumRequest";
import { workspaceRequest, rows, ownReports } from "./workspaceModel";

const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    workspaceData: builder.query({
      queryFn: async (args, api, options) => {
        try {
          if (args.resource === "my-reports") {
            const userId = api.getState().auth.user?.id;
            if (userId == null) return { error: { status: "CUSTOM_ERROR", error: "Sign in to view your contributions." } };
            const result = await request(workspaceRequest({ resource: "reports" }), api, options);
            if (result.error) return result;
            return { data: ownReports(rows(result.data), userId) };
          }
          if (["my-claims", "my-matches"].includes(args.resource)) {
            return { error: { status: "CUSTOM_ERROR", code: "FEATURE_UNAVAILABLE", error: "Your personal reports and updates are not available yet." } };
          }
          let requestArgs = args;
          if (args.resource === "my-posts") {
            const userId = api.getState().auth.user?.id;
            if (userId == null) return { error: { status: "CUSTOM_ERROR", error: "Sign in to view your contributions." } };
            requestArgs = { ...args, id: userId };
          }
          const result = await request(workspaceRequest(requestArgs), api, options);
          if (
            !result.error &&
            [
              "posts",
              "my-posts",
              "reports",
              "tags",
              "categories",
              "locations",
              "claims",
              "matches",
              "notifications",
              "answers",
            ].includes(args.resource)
          )
            rows(result.data);
          return result;
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
      providesTags: [
        "User",
        "Post",
        "LostFound",
        "Claim",
        "Match",
        "Notification",
        "Tag",
      ],
    }),
    workspaceSave: builder.mutation({
      queryFn: (args, api, options) => {
        try {
          return request(workspaceRequest(args), api, options);
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
      invalidatesTags: (_data, error) =>
        error
          ? []
          : ["User", "Post", "LostFound", "Claim", "Match", "Notification"],
    }),
  }),
});
export const { useWorkspaceDataQuery, useWorkspaceSaveMutation } = workspaceApi;
