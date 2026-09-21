import { baseApi } from "../../store/api/baseApi";
import { request } from "../../store/api/forumRequest";
import { workspaceRequest, rows } from "./workspaceModel";

const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    workspaceData: builder.query({
      queryFn: async (args, api, options) => {
        try {
          const result = await request(workspaceRequest(args), api, options);
          if (
            !result.error &&
            [
              "posts",
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
