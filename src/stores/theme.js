import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTheme } from 'vuetify';

export const useThemeStore = defineStore('theme', () => {
  const theme = useTheme();
  const isDark = ref(false);

  function toggleTheme() {
    isDark.value = !isDark.value;
    // Using the recommended method to change themes
    theme.global.name.value = isDark.value ? 'dark' : 'light';
  }

  return { isDark, toggleTheme };
});