import { baseApi } from '../../store/api/baseApi';
import { updateUser as updateStoreUser } from '../auth/authSlice';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(updateStoreUser(data));
          }
        } catch {
          // Ignore
        }
      },
    }),
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    searchUsers: builder.query({
      query: (query) => `/users/search?query=${encodeURIComponent(query || '')}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: '/users/update-user',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(userData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(updateStoreUser(data));
          }
        } catch {
          // Ignore
        }
      },
    }),
    uploadProfileImage: builder.mutation({
      query: (fileData) => {
        // fileData can be FormData or an object
        const body = fileData instanceof FormData ? fileData : (() => {
          const fd = new FormData();
          fd.append('file', fileData);
          return fd;
        })();
        return {
          url: '/users/upload-image',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['User'],
    }),
    updatePassword: builder.mutation({
      query: (passwords) => ({
        url: '/users/update-password',
        method: 'PUT',
        body: passwords, // { oldPassword, newPassword, confirmPassword }
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetUserByIdQuery,
  useSearchUsersQuery,
  useUpdateUserMutation,
  useUploadProfileImageMutation,
  useUpdatePasswordMutation,
} = userApi;

export default userApi;
