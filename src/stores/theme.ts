import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    // 保存到本地存储
    localStorage.setItem('typepal-theme', isDark.value ? 'dark' : 'light')
  }

  // 初始化主题
  const initTheme = () => {
    const saved = localStorage.getItem('typepal-theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      // 检测系统主题偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
})