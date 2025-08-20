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
  },
  getCurrentWordInfo?: () => {
    currentWord: { word: string } | null
    userInput: string
  }
) {
  // 防止章节切换后立即处理键盘事件的标志
  let isTransitioning = false
  
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

    // Enter键 - 在章节完成时进入下一章（全局处理）
    if (event.key === 'Enter' && state.isCompleted) {
      event.preventDefault()
      event.stopPropagation()
      if (handlers.onNextChapterOnComplete && !isTransitioning) {
        isTransitioning = true
        // 使用 setTimeout 确保状态更新完成后再处理后续逻辑
        setTimeout(() => {
          handlers.onNextChapterOnComplete?.()
          // 延迟重置转换标志，确保章节切换完全完成
          setTimeout(() => {
            isTransitioning = false
          }, 100)
        }, 0)
      }
      return
    }

    // Tab键 - 跳过当前单词
    if (event.key === 'Tab' && !state.showSettings && !state.isPaused) {
      handlers.onSkipWord()
      event.preventDefault()
      return
    }

    // 空格键 - 需要检查是否应该输入空格字符
    if (event.key === ' ' && !state.showSettings && !state.isPaused) {
      // 如果有获取当前单词信息的函数，检查是否需要输入空格
      if (getCurrentWordInfo) {
        const wordInfo = getCurrentWordInfo()
        if (wordInfo.currentWord && wordInfo.userInput.length < wordInfo.currentWord.word.length) {
          const expectedChar = wordInfo.currentWord.word[wordInfo.userInput.length]
          if (expectedChar === ' ') {
            // 当前位置需要输入空格，不跳过单词
            return
          }
        }
      }
      
      // 只有在不是输入状态时才跳过单词
      if (!isInputFocused) {
        handlers.onSkipWord()
        event.preventDefault()
      }
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
    if (!state.isPaused && !state.showSettings && !state.isCompleted && handlers.onFocusInput && !isTransitioning) {
      setTimeout(() => {
        if (!state.isPaused && !state.showSettings && !state.isCompleted && !isTransitioning) {
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