import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import en from '../locales/en.json';
import si from '../locales/si.json';
import ta from '../locales/ta.json';

export const useLanguageStore = defineStore('language', () => {
  const languages = { en, si, ta };
  const currentLanguageCode = ref('en'); // Default language

  const setLanguage = (langCode) => {
    if (languages[langCode]) {
      currentLanguageCode.value = langCode;
    }
  };

  const t = computed(() => {
    return (key) => {
      const keys = key.split('.');
      let value = languages[currentLanguageCode.value];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key; // Return key if not found
      }
      return value;
    };
  });
  
  const currentLanguageLabel = computed(() => languages[currentLanguageCode.value]?.label || "English");

  return { currentLanguageCode, setLanguage, t, languages, currentLanguageLabel };
});