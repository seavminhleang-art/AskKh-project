import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'askkh_theme';

export const getSystemTheme = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getInitialMode = () => {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('nexa_theme');
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
};

export const applyThemeToDocument = (mode) => {
  if (typeof document === 'undefined') return;
  const effectiveTheme = mode === 'system' ? getSystemTheme() : mode;
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const initialMode = getInitialMode();
applyThemeToDocument(initialMode);

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: initialMode, // 'light' | 'dark' | 'system'
  },
  reducers: {
    setTheme: (state, action) => {
      const newMode = action.payload;
      if (newMode === 'light' || newMode === 'dark' || newMode === 'system') {
        state.mode = newMode;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, newMode);
          localStorage.setItem('nexa_theme', newMode);
        }
        applyThemeToDocument(newMode);
      }
    },
    toggleTheme: (state) => {
      // Cycles: light -> dark -> system -> light
      let nextMode = 'dark';
      if (state.mode === 'light') nextMode = 'dark';
      else if (state.mode === 'dark') nextMode = 'system';
      else nextMode = 'light';

      state.mode = nextMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, nextMode);
        localStorage.setItem('nexa_theme', nextMode);
      }
      applyThemeToDocument(nextMode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
