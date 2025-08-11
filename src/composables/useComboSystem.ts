import { ref } from 'vue'

export function useComboSystem() {
  const comboCount = ref(0)
  const showCombo = ref(false)
  const comboTimeout = ref<number | null>(null)

  const incrementCombo = (onSpecialCombo?: (count: number, message: string) => void) => {
    comboCount.value++
    showCombo.value = true

    // 清除之前的超时
    if (comboTimeout.value) {
      clearTimeout(comboTimeout.value)
    }

    // 设置动画效果
    setTimeout(() => {
      showCombo.value = false
    }, 500)

    // 特殊连击里程碑提示
    if (onSpecialCombo) {
      if (comboCount.value === 10) {
        onSpecialCombo(10, '🎉 连击 x10！状态火热！')
      } else if (comboCount.value === 25) {
        onSpecialCombo(25, '🔥 连击 x25！无人能挡！')
      } else if (comboCount.value === 50) {
        onSpecialCombo(50, '⚡ 连击 x50！键盘之神！')
      }
    }
  }

  const resetCombo = () => {
    const previousCount = comboCount.value
    comboCount.value = 0
    showCombo.value = false

    if (comboTimeout.value) {
      clearTimeout(comboTimeout.value)
      comboTimeout.value = null
    }

    return previousCount
  }

  return {
    comboCount,
    showCombo,
    incrementCombo,
    resetCombo
  }
}