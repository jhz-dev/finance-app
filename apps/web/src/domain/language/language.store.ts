import { create } from 'zustand';
import i18n from '@/lib/i18n';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: i18n.language,
  setLanguage: (language) => {
    i18n.changeLanguage(language);
    set({ language });
  },
}));
