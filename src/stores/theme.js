import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTheme } from 'vuetify';

export const useThemeStore = defineStore('theme', () => {
  const theme = useTheme();
  const isDark = ref(false);

  function toggleTheme() {
    isDark.value = !isDark.value;
    theme.global.name.value = isDark.value ? 'myCustomDarkTheme' : 'myCustomLightTheme';
  }

  return { isDark, toggleTheme };
});