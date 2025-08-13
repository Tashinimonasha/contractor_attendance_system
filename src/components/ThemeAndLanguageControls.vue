<template>
  <v-btn icon @click="themeStore.toggleTheme()">
    <v-icon>{{ themeStore.isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
    <v-tooltip activator="parent" location="bottom">Toggle Theme</v-tooltip>
  </v-btn>

  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>mdi-translate</v-icon>
        <v-tooltip activator="parent" location="bottom">Change Language</v-tooltip>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(lang, code) in languageStore.languages"
        :key="code"
        @click="languageStore.setLanguage(code)"
      >
        <v-list-item-title>
          {{ lang.label }}
          <v-icon v-if="languageStore.currentLanguageCode === code" color="primary">mdi-check</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { useThemeStore } from '../stores/theme';
import { useLanguageStore } from '../stores/language';

const themeStore = useThemeStore();
const languageStore = useLanguageStore();
</script>