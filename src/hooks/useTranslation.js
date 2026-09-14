import { useLanguage } from './useLanguage';

export function useTranslation() {
  const { language, setLanguage, toggleLanguage, t, isKhmer } = useLanguage();

  return {
    t,
    lang: language === 'km' ? 'KH' : 'EN',
    language,
    isKhmer,
    setLang: (newLang) => setLanguage(newLang === 'KH' || newLang === 'km' ? 'km' : 'en'),
    setLanguage,
    toggleLang: toggleLanguage,
    toggleLanguage,
  };
}

export default useTranslation;
