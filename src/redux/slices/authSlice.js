import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
  admin: JSON.parse(localStorage.getItem('admin') || 'null'),
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, admin } = action.payload
      state.accessToken = accessToken
      state.admin = admin ?? state.admin
      state.isAuthenticated = true
      localStorage.setItem('accessToken', accessToken)
      if (admin) localStorage.setItem('admin', JSON.stringify(admin))
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    logout: (state) => {
      state.accessToken = null
      state.admin = null
      state.isAuthenticated = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('admin')
    },
  },
})

export const { setCredentials, setAccessToken, logout } = authSlice.actions
export default authSlice.reducer
