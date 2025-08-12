import { ref, computed } from 'vue'
import type { PracticeSettings } from '@/stores/practice'

export function useComboSystem(settings?: () => PracticeSettings) {
  const comboCount = ref(0)
  const showCombo = ref(false)
  const comboTimeout = ref<number | null>(null)

  // 根据设置决定特效级别
  const effectsLevel = computed(() => {
    return settings ? settings().comboEffectsLevel : 'simple'
  })

  const shouldShowEffects = computed(() => {
    return effectsLevel.value !== 'none'
  })

  const incrementCombo = (onSpecialCombo?: (count: number, message: string) => void) => {
    comboCount.value++
    
    // 只有在启用特效时才显示动画
    if (shouldShowEffects.value) {
      showCombo.value = true

      // 清除之前的超时
      if (comboTimeout.value) {
        clearTimeout(comboTimeout.value)
      }

      // 设置动画效果
      setTimeout(() => {
        showCombo.value = false
      }, 500)
    }

    // 特殊连击里程碑提示（根据特效级别显示不同消息）
    if (onSpecialCombo && shouldShowEffects.value) {
      if (effectsLevel.value === 'gorgeous') {
        // 华丽版本的连击提示
        if (comboCount.value === 10) {
          onSpecialCombo(10, '🎉 连击 x10！状态火热！')
        } else if (comboCount.value === 25) {
          onSpecialCombo(25, '🔥 连击 x25！无人能挡！')
        } else if (comboCount.value === 50) {
          onSpecialCombo(50, '⚡ 连击 x50！键盘之神！')
        }
      } else if (effectsLevel.value === 'simple') {
        // 简约版本的连击提示
        if (comboCount.value === 10) {
          onSpecialCombo(10, `连击 x${comboCount.value}`)
        } else if (comboCount.value === 25) {
          onSpecialCombo(25, `连击 x${comboCount.value}`)
        } else if (comboCount.value === 50) {
          onSpecialCombo(50, `连击 x${comboCount.value}`)
        }
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