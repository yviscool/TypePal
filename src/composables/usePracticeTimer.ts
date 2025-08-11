import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePracticeStore } from '@/stores/practice'

export function usePracticeTimer() {
  const practiceStore = usePracticeStore()
  const { startTime, totalCount } = storeToRefs(practiceStore)
  
  const currentTime = ref(0)
  const timeInterval = ref<number | null>(null)

  const currentWpm = computed(() => {
    if (!startTime.value || currentTime.value === 0 || totalCount.value === 0) return 0
    const minutes = currentTime.value / 60000
    return Math.round(totalCount.value / minutes)
  })

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    if (timeInterval.value) return

    timeInterval.value = setInterval(() => {
      if (startTime.value) {
        currentTime.value = Date.now() - startTime.value
      }
    }, 100) as unknown as number
  }

  const stopTimer = () => {
    if (timeInterval.value) {
      clearInterval(timeInterval.value)
      timeInterval.value = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    currentTime.value = 0
  }

  return {
    currentTime,
    currentWpm,
    formatTime,
    startTimer,
    stopTimer,
    resetTimer
  }
}