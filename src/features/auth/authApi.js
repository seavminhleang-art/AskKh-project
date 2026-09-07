import { baseApi } from '../../store/api/baseApi';
import { setCredentials, logout as logoutAction } from './authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.accessToken) {
            dispatch(
              setCredentials({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: {
                  id: data.userId,
                  displayName: data.displayName,
                  email: data.email,
                },
              })
            );
          }
        } catch {
          // Handled by component error state
        }
      },
      invalidatesTags: ['User'],
    }),
    refreshToken: builder.mutation({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    logoutApi: builder.mutation({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body: body || {},
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logoutAction());
        }
      },
      invalidatesTags: ['User', 'Bookmark', 'Notification'],
    }),
    verifyEmail: builder.mutation({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body, // { token }
      }),
    }),
    resendVerification: builder.mutation({
      query: (body) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body, // { email }
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body, // { email }
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body, // { token, newPassword, confirmPassword }
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutApiMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;
