import { onMounted, onUnmounted, nextTick } from 'vue'

export interface KeyboardShortcutHandlers {
  onToggleSettings: () => void
  onTogglePause: () => void
  onSkipWord: () => void
  onNextChapter: () => void
  onPlayPronunciation: () => void
  onResetChapter: () => void
  onToggleDictation: () => void
  onToggleTranslation: () => void
  onNextChapterOnComplete?: () => void
  onFocusInput?: () => void
}

export function useKeyboardShortcuts(
  handlers: KeyboardShortcutHandlers,
  getState: () => {
    showSettings: boolean
    isPaused: boolean
    isCompleted: boolean
    availableChaptersLength: number
    currentChapter: number
  }
) {
  const handleKeydown = (event: KeyboardEvent) => {
    const state = getState()
    const isInputFocused = event.target instanceof HTMLInputElement
    const isSpecialKey = ['Escape', 'Tab'].includes(event.key)

    // 如果正在输入且不是特殊键，不处理快捷键
    if (isInputFocused && !isSpecialKey && !event.altKey) {
      return
    }

    // Esc键 - 暂停/继续或关闭设置
    if (event.key === 'Escape') {
      if (state.showSettings) {
        handlers.onToggleSettings()
      } else {
        handlers.onTogglePause()
      }
      event.preventDefault()
      return
    }

    // Enter键 - 在章节完成时进入下一章
    if (event.key === 'Enter' && state.isCompleted) {
      event.preventDefault()
      if (handlers.onNextChapterOnComplete) {
        handlers.onNextChapterOnComplete()
      }
      return
    }

    // Tab键 - 跳过当前单词
    if (event.key === 'Tab' && !state.showSettings && !state.isPaused) {
      handlers.onSkipWord()
      event.preventDefault()
      return
    }

    // Alt + 字母键组合
    if (event.altKey && !event.ctrlKey && !event.metaKey) {
      const key = event.key.toLowerCase()

      switch (key) {
        case 's':
          handlers.onToggleSettings()
          event.preventDefault()
          break

        case 'c':
          if (!state.showSettings && state.availableChaptersLength > 1) {
            handlers.onNextChapter()
          }
          event.preventDefault()
          break

        case 'p':
          if (!state.showSettings) {
            handlers.onPlayPronunciation()
          }
          event.preventDefault()
          break

        case 'r':
          if (!state.showSettings) {
            handlers.onResetChapter()
          }
          event.preventDefault()
          break

        case 'd':
          if (!state.showSettings) {
            handlers.onToggleDictation()
          }
          event.preventDefault()
          break

        case 't':
          if (!state.showSettings) {
            handlers.onToggleTranslation()
          }
          event.preventDefault()
          break
      }
      return
    }

    // 确保输入框始终聚焦（仅在练习状态下）
    if (!state.isPaused && !state.showSettings && handlers.onFocusInput) {
      setTimeout(() => {
        if (!state.isPaused && !state.showSettings) {
          handlers.onFocusInput?.()
        }
      }, 50)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    handleKeydown
  }
}