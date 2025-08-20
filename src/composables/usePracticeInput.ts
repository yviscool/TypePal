import { ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { usePracticeStore } from '@/stores/practice'

export function usePracticeInput() {
  const practiceStore = usePracticeStore()
  const { 
    currentWord, 
    userInput, 
    settings, 
    currentWordIndex, 
    startTime, 
    totalCount, 
    correctCount 
  } = storeToRefs(practiceStore)

  const errorMessage = ref('')
  const successMessage = ref('')

  const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
  }

  const onInput = (event: Event, onComboIncrement: () => void, onComboReset: () => void, onStartTimer: () => void, onWordComplete?: () => void) => {
    if (!currentWord.value) return

    const target = event.target as HTMLInputElement
    const newValue = target.value

    // 更新 store 中的 userInput
    userInput.value = newValue

    clearMessages()

    // 开始计时
    if (!startTime.value) {
      practiceStore.startPractice()
      onStartTimer()
    }

    // 限制输入长度不超过当前单词长度
    if (newValue.length > currentWord.value.word.length) {
      const trimmedValue = newValue.slice(0, currentWord.value.word.length)
      userInput.value = trimmedValue
      target.value = trimmedValue
      return
    }

    // 检查当前输入的字符是否正确
    if (newValue.length > 0) {
      const currentIndex = newValue.length - 1
      const currentChar = newValue[currentIndex].toLowerCase()
      const expectedChar = currentWord.value.word[currentIndex].toLowerCase()

      if (currentChar !== expectedChar) {
        // 根据练习模式处理错误
        practiceStore.markWordError(currentWordIndex.value)

        if (settings.value.practiceMode === 'hardcore') {
          errorMessage.value = '💥 硬核模式：全部重来！'
          setTimeout(clearMessages, 800)
          practiceStore.resetChapter()
          onComboReset()
        } else if (settings.value.practiceMode === 'strict') {
          errorMessage.value = '⚡ 严格模式：从头开始！'
          setTimeout(clearMessages, 800)
          userInput.value = ''
          onComboReset()
        } else {
          errorMessage.value = '输入错误，请使用退格键修正'
          setTimeout(clearMessages, 1500)
          onComboReset()
        }
      } else {
        // 正确输入，检查是否完成单词
        if (newValue.length === currentWord.value.word.length) {
          const isWordComplete = newValue.toLowerCase() === currentWord.value.word.toLowerCase()

          if (isWordComplete) {
            successMessage.value = '完美！'
            onComboIncrement()

            setTimeout(() => {
              clearMessages()
              completeCurrentWord(onWordComplete)
            }, 250)
          } else {
            if (settings.value.practiceMode === 'normal') {
              errorMessage.value = '单词不完全正确，请检查并修正'
              setTimeout(clearMessages, 1500)
              onComboReset()
            } else {
              errorMessage.value = settings.value.practiceMode === 'hardcore' ? '💥 硬核模式：全部重来！' : '⚡ 严格模式：从头开始！'
              setTimeout(clearMessages, 800)
              if (settings.value.practiceMode === 'hardcore') {
                practiceStore.resetChapter()
              } else {
                userInput.value = ''
              }
              onComboReset()
            }
          }
        }
      }
    }
  }

  const completeCurrentWord = (onWordComplete?: () => void) => {
    if (!currentWord.value) return

    practiceStore.clearWordError(currentWordIndex.value)
    totalCount.value++
    correctCount.value++
    practiceStore.nextWord()
    
    // 单词完成后的回调，用于播放下一个单词的发音
    if (onWordComplete) {
      setTimeout(() => {
        onWordComplete()
      }, 300)
    }
  }

  const onKeydown = (event: KeyboardEvent, isPaused: boolean, onSkipWord: () => void) => {
    if (isPaused) return

    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault()
    }

    if (event.key === 'Backspace') {
      if (settings.value.practiceMode === 'normal') {
        clearMessages()
      } else if (settings.value.loopOnError && errorMessage.value) {
        clearMessages()
      }
    }

    if (event.key === ' ') {
      event.preventDefault()
      onSkipWord()
    }
  }

  return {
    errorMessage,
    successMessage,
    clearMessages,
    onInput,
    onKeydown
  }
}