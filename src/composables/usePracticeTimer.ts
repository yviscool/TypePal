/**
 * 重构后的练习计时器 - 单一职责：管理练习时间和WPM计算
 * 修复类型安全问题，优化性能计算
 */
import { ref, computed, onUnmounted } from 'vue'
import { PRACTICE_CONFIG } from '@/core/PracticeConfig'

export interface TimerState {
  startTime: number | null
  currentTime: number
  isRunning: boolean
}

export function usePracticeTimer() {
  const state = ref<TimerState>({
    startTime: null,
    currentTime: 0,
    isRunning: false
  })
  
  let intervalId: number | null = null

  const currentWpm = computed(() => {
    if (!state.value.startTime || state.value.currentTime === 0) return 0
    
    const minutes = state.value.currentTime / 60000
    if (minutes === 0) return 0
    
    // 这里需要从外部传入 totalCount，或者通过参数传递
    // 为了保持单一职责，WPM计算应该基于传入的数据
    return 0 // 占位符，实际使用时需要传入单词数
  })

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const calculateWpm = (totalWords: number): number => {
    if (!state.value.startTime || state.value.currentTime === 0 || totalWords === 0) {
      return 0
    }
    
    const minutes = state.value.currentTime / 60000
    return Math.round(totalWords / minutes)
  }

  const startTimer = (shouldPause?: () => boolean): void => {
    if (intervalId !== null) return

    state.value.isRunning = true
    intervalId = window.setInterval(() => {
      if (state.value.startTime && (!shouldPause || !shouldPause())) {
        state.value.currentTime = Date.now() - state.value.startTime
      }
    }, PRACTICE_CONFIG.TIMER_INTERVAL)
  }

  const stopTimer = (): void => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    state.value.isRunning = false
  }

  const resetTimer = (): void => {
    stopTimer()
    state.value.startTime = null
    state.value.currentTime = 0
  }

  const initializeTimer = (): void => {
    if (!state.value.startTime) {
      state.value.startTime = Date.now()
    }
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stopTimer()
  })

  return {
    // 状态
    currentTime: computed(() => state.value.currentTime),
    isRunning: computed(() => state.value.isRunning),
    
    // 方法
    formatTime,
    calculateWpm,
    startTimer,
    stopTimer,
    resetTimer,
    initializeTimer
  }
}