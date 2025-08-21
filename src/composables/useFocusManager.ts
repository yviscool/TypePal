/**
 * 焦点管理器 - 单一职责：管理输入框焦点
 * 提取自 Practice.vue，消除重复的焦点管理逻辑
 */
import { ref, type Ref } from 'vue'
import { PRACTICE_CONFIG } from '@/core/PracticeConfig'

export interface FocusManagerOptions {
  isPaused: Ref<boolean>
  showSettings: Ref<boolean>
}

export function useFocusManager(
  inputRef: Ref<HTMLInputElement | undefined>,
  options: FocusManagerOptions
) {
  let focusTimeoutId: number | null = null

  const focusInput = (): void => {
    // 清除之前的定时器，避免重复执行
    if (focusTimeoutId) {
      clearTimeout(focusTimeoutId)
      focusTimeoutId = null
    }
    
    const element = inputRef.value
    if (!element || options.isPaused.value || options.showSettings.value) {
      return
    }

    // 检查是否已经聚焦，避免不必要的操作
    if (document.activeElement === element) {
      return
    }
    
    // 使用 requestAnimationFrame 优化DOM操作时机
    requestAnimationFrame(() => {
      if (!options.isPaused.value && !options.showSettings.value && element) {
        element.focus()
        element.setSelectionRange(element.value.length, element.value.length)
      }
    })
  }

  const handlePageClick = (event: Event): void => {
    const target = event.target as HTMLElement

    // 如果点击的是 select 元素或其子元素，不处理
    if (target.tagName === 'SELECT' || target.closest('select')) {
      return
    }

    // 如果设置面板打开，或点击的是设置面板内的元素，不处理
    if (options.showSettings.value || target.closest('.settings-panel')) {
      return
    }

    // 如果当前处于暂停状态，不处理
    if (options.isPaused.value) {
      return
    }

    // 其他情况下聚焦输入框
    focusInput()
  }

  const cleanup = (): void => {
    if (focusTimeoutId) {
      clearTimeout(focusTimeoutId)
      focusTimeoutId = null
    }
  }

  return {
    focusInput,
    handlePageClick,
    cleanup
  }
}