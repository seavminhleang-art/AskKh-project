import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  mobileSidebarOpen: false,
  theme: localStorage.getItem('theme') || 'light',
  density: localStorage.getItem('density') || 'comfortable',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', String(state.sidebarCollapsed))
    },
    openMobileSidebar: (state) => {
      state.mobileSidebarOpen = true
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    setDensity: (state, action) => {
      state.density = action.payload
      localStorage.setItem('density', action.payload)
    },
  },
})

export const { toggleSidebar, openMobileSidebar, closeMobileSidebar, setTheme, setDensity } = uiSlice.actions
export default uiSlice.reducer
