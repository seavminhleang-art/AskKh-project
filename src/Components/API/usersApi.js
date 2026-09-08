import { baseApi } from "../../api/baseApi";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /users/me
        getCurrentUser: builder.query({
            query: () => "/users/me",
            providesTags: ["User"],
        }),

        // GET /users/{userId}
        getUserById: builder.query({
            query: (userId) => `/users/${userId}`,
            providesTags: (result, error, userId) => [{ type: "User", id: userId }],
        }),

        // GET /users/email/{email}
        getUserByEmail: builder.query({
            query: (email) => `/users/email/${encodeURIComponent(email)}`,
        }),

        // GET /users/search?query=
        searchUsers: builder.query({
            query: (query) => ({
                url: "/users/search",
                params: { query },
            }),
            providesTags: ["User"],
        }),

        // PUT /users/update-user
        updateUser: builder.mutation({
            query: (body) => ({
                url: "/users/update-user",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["User"],
        }),

        // PUT /users/update-password
        updatePassword: builder.mutation({
            query: (body) => ({
                url: "/users/update-password",
                method: "PUT",
                body,
            }),
        }),

        // PUT /users/upload-image  (multipart)
        uploadUserImage: builder.mutation({
            query: (formData) => ({
                url: "/users/upload-image",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["User"],
        }),

        // DELETE /users/{userId}
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCurrentUserQuery,
    useGetUserByIdQuery,
    useGetUserByEmailQuery,
    useSearchUsersQuery,
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useUploadUserImageMutation,
    useDeleteUserMutation,
} = usersApi;