import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'askkh_lang';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'EN';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'EN' || saved === 'KH') {
    return saved;
  }
  return 'EN';
};

const initialLang = getInitialLanguage();

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang === 'KH' ? 'km' : 'en';
}

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    current: initialLang, // 'EN' | 'KH'
  },
  reducers: {
    setLanguage: (state, action) => {
      const newLang = action.payload === 'KH' ? 'KH' : 'EN';
      state.current = newLang;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newLang);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang === 'KH' ? 'km' : 'en';
      }
    },
    toggleLanguage: (state) => {
      const nextLang = state.current === 'EN' ? 'KH' : 'EN';
      state.current = nextLang;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, nextLang);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = nextLang === 'KH' ? 'km' : 'en';
      }
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
