<template>
  <div id="app" class="min-h-screen transition-colors duration-300" :class="themeClasses">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

const themeClasses = computed(() => ({
  'bg-warm-light text-gray-800': !themeStore.isDark,
  'bg-night-dark text-gray-100': themeStore.isDark
}))
</script>