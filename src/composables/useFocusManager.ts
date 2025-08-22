/**
 * 焦点管理器 - 单一职责：管理输入框焦点
 * 经过重构，更健壮、API更清晰
 */
import { type Ref } from 'vue'

// 定义组件必须暴露的接口
interface InputExposingComponent {
  inputRef: HTMLInputElement | null
}

export function useFocusManager(
  componentRef: Ref<InputExposingComponent | null>,
  isPaused: Ref<boolean>,
  showSettings: Ref<boolean>
) {
  const focusInput = (): void => {
    // Guard 1: Component might not be rendered yet (due to v-if)
    if (!componentRef.value) {
      return
    }
    
    const inputElement = componentRef.value.inputRef
    
    // Guard 2: Input element might not be available yet
    if (!inputElement) {
        return
    }

    // Guard 3: Check conditions before focusing
    if (isPaused.value || showSettings.value) {
      return
    }

    // Guard 4: Avoid re-focusing if already focused
    if (document.activeElement === inputElement) {
      return
    }

    // Use requestAnimationFrame to ensure focus happens after any pending DOM updates
    requestAnimationFrame(() => {
      // Double-check conditions inside rAF as state might have changed
      if (componentRef.value && !isPaused.value && !showSettings.value) {
        const el = componentRef.value.inputRef
        if (el) {
          el.focus()
        }
      }
    })
  }

  const handlePageClick = (event: Event): void => {
    const target = event.target as HTMLElement

    // Do not focus if clicking on interactive elements
    if (target.closest('button, a, select, input, [role="button"]')) {
      return
    }

    // Do not focus if settings panel is open or was clicked
    if (showSettings.value || target.closest('.settings-panel')) {
      return
    }

    focusInput()
  }

  return {
    focusInput,
    handlePageClick,
  }
}
