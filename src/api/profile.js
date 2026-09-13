import { baseApi } from './baseApi'

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['Profile'],
    }),
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Profile', id: userId }],
    }),
    getUserByEmail: builder.query({
      query: (email) => `/users/email/${email}`,
    }),
    searchUsers: builder.query({
      query: (params) => ({ url: '/users/search', params }),
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: (body) => ({ url: '/users/update-user', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
    updatePassword: builder.mutation({
      query: (body) => ({ url: '/users/update-password', method: 'PUT', body }),
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({ url: '/users/upload-image', method: 'PUT', body: formData }),
      invalidatesTags: ['Profile'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({ url: `/users/${userId}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useGetMeQuery,
  useGetUserByIdQuery,
  useGetUserByEmailQuery,
  useSearchUsersQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useUploadImageMutation,
  useDeleteUserMutation,
} = profileApi
