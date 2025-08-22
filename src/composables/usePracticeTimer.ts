/**
 * 练习计时器 - 单一职责：管理计时和基于字符数的WPM计算
 */
import { ref, computed, onUnmounted } from 'vue'
import { PRACTICE_CONFIG } from '@/core/PracticeConfig'

export function usePracticeTimer() {
  const currentTime = ref(0)
  const isRunning = ref(false)
  let intervalId: number | null = null
  let practiceStartTime: number | null = null

  const calculateLiveWpm = (typedChars: number): number => {
    if (!practiceStartTime || currentTime.value === 0 || typedChars === 0) {
      return 0
    }
    const minutes = currentTime.value / 60000
    if (minutes === 0) return 0
    // WPM 标准: (总输入字符数 / 5) / 分钟数
    return Math.round((typedChars / 5) / minutes)
  }

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const startTimer = (startTimeValue: number): void => {
    if (isRunning.value || !startTimeValue) return

    practiceStartTime = startTimeValue
    isRunning.value = true
    
    intervalId = window.setInterval(() => {
      if (practiceStartTime) {
        currentTime.value = Date.now() - practiceStartTime
      }
    }, PRACTICE_CONFIG.TIMER_INTERVAL)
  }

  const stopTimer = (): void => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  const resetTimer = (): void => {
    stopTimer()
    practiceStartTime = null
    currentTime.value = 0
  }

  onUnmounted(stopTimer)

  return {
    currentTime: computed(() => currentTime.value),
    isRunning: computed(() => isRunning.value),
    formattedTime: computed(() => formatTime(currentTime.value)),
    calculateLiveWpm,
    startTimer,
    stopTimer,
    resetTimer,
  }
}
