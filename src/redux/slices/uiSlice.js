import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  sidebarMobileOpen: false,
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
    setSidebarMobileOpen: (state, action) => {
      state.sidebarMobileOpen = action.payload
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

export const { toggleSidebar, setSidebarMobileOpen, setTheme, setDensity } = uiSlice.actions
export default uiSlice.reducer
