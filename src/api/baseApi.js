import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout, setAccessToken } from '@/redux/slices/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    )

    if (refreshResult.data?.accessToken) {
      api.dispatch(setAccessToken(refreshResult.data.accessToken))
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
      window.location.assign('/login')
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Profile', 'Users', 'Posts', 'Comments', 'Tags',
    'LostFound', 'Notifications', 'Moderation', 'Dashboard',
  ],
  endpoints: () => ({}),
})
