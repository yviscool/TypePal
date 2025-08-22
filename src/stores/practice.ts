import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { DictionaryPayload, DictWord } from '@/types/dictionary'
import type { PracticeSettings, WordStatus } from '@/types/practice'
import { PRACTICE_CONFIG, DEFAULT_SETTINGS } from '@/core/PracticeConfig'
import { SoundSystem } from '@/core/SoundSystem'

export const usePracticeStore = defineStore('practice', () => {
  // --- 核心状态 ---
  const currentDictionary = ref<DictionaryPayload | null>(null)
  const currentChapter = ref(0)
  const currentWordIndex = ref(0)
  const userInput = ref('')
  const isCompleted = ref(false)
  const startTime = ref<number | null>(null)
  const endTime = ref<number | null>(null)
  const correctCount = ref(0)
  const errorCount = ref(0)
  const totalTypedChars = ref(0)
  const comboCount = ref(0)
  const message = ref<{ type: 'error' | 'success' | 'info', text: string } | null>(null)

  // --- 设置 ---
  const settings = ref<PracticeSettings>({ ...DEFAULT_SETTINGS })

  // --- 单词状态跟踪 ---
  const wordCompletionCounts = ref(new Map<number, number>())
  const skippedWords = ref(new Set<number>())
  const errorWords = ref(new Set<number>())

  // --- 核心系统 ---
  const soundSystem = new SoundSystem()
  let messageTimeout: number | null = null

  // 同步音效设置到 SoundSystem
  function syncSoundSettings() {
    soundSystem.setEnabled(settings.value.soundEnabled)
    soundSystem.setTypingSoundEnabled(settings.value.typingSound)
    soundSystem.setTypingSoundVariant(settings.value.typingSoundVariant)
  }

  // 初始化音效设置
  syncSoundSettings()

  // 监听设置变化，实时同步到音效系统
  watch([
    () => settings.value.soundEnabled,
    () => settings.value.typingSound,
    () => settings.value.typingSoundVariant
  ], () => {
    syncSoundSettings()
  })

  // --- 计算属性 ---
  const availableChapters = computed(() => {
    if (!currentDictionary.value) return []
    const words = currentDictionary.value.words
    const chapterSize = PRACTICE_CONFIG.WORDS_PER_CHAPTER
    const chapters = []
    for (let i = 0; i < words.length; i += chapterSize) {
        chapters.push(words.slice(i, i + chapterSize))
    }
    return chapters
  })

  const currentChapterWords = computed(() => {
    if (!currentDictionary.value) return []
    const start = currentChapter.value * PRACTICE_CONFIG.WORDS_PER_CHAPTER
    const end = start + PRACTICE_CONFIG.WORDS_PER_CHAPTER
    return currentDictionary.value.words.slice(start, end)
  })

  const currentWord = computed(() => currentChapterWords.value[currentWordIndex.value] || null)

  const currentWordLoopProgress = computed(() => {
    const requiredCompletions = settings.value.wordLoopCount === 'infinite' 
      ? Infinity 
      : parseInt(settings.value.wordLoopCount, 10)
    const currentCompletions = wordCompletionCounts.value.get(currentWordIndex.value) || 0
    
    return {
      current: currentCompletions,
      required: requiredCompletions,
      isInfinite: settings.value.wordLoopCount === 'infinite'
    }
  })

  // --- 监听器：当单词改变时自动播放发音 ---
  watch(currentWord, (newWord, oldWord) => {
    // 直接使用 watch 传递的新值 (newWord)，避免时序问题和对外部 currentWord 的依赖
    if (newWord && settings.value.soundEnabled) {
      // 在听写模式下，立即播放新单词发音
      if (settings.value.dictationMode) {
        soundSystem.playPronunciation(newWord.word, settings.value.pronunciation)
      }
      // 在普通模式下，只有当单词真正发生变化时（不是初始化），才播放新单词发音
      else if (oldWord && oldWord.word !== newWord.word) {
        soundSystem.playPronunciation(newWord.word, settings.value.pronunciation)
      }
    }
  })

  const progress = computed(() => {
    const totalWords = currentChapterWords.value.length
    if (totalWords === 0) return 0
    return Math.round((currentWordIndex.value / totalWords) * 100)
  })

  const wpm = computed(() => {
    if (!startTime.value || totalTypedChars.value === 0) return 0
    const timeInMinutes = (Date.now() - startTime.value) / 60000
    return Math.round((totalTypedChars.value / 5) / timeInMinutes)
  })

  const accuracy = computed(() => {
    const total = correctCount.value + errorCount.value
    if (total === 0) return 100
    return Math.round((correctCount.value / total) * 100)
  })

  // --- 监听器：同步设置到声音系统 ---
  watch(settings, (newSettings) => {
    if (newSettings) {
      soundSystem.setEnabled(newSettings.soundEnabled)
      soundSystem.setTypingSoundEnabled(newSettings.typingSound)
      soundSystem.setTypingSoundVariant(newSettings.typingSoundVariant)
    }
  }, { deep: true, immediate: true })

  // --- 核心业务逻辑 ---
  function startPractice() {
    if (!startTime.value) {
      startTime.value = Date.now()
    }
  }

  function setDictionary(dictionary: DictionaryPayload) {
    currentDictionary.value = dictionary
    resetPractice()
  }

  // --- 私有辅助函数 ---
  function _setMessage(type: 'error' | 'success' | 'info', text: string, duration = 2000) {
    message.value = { type, text }
    if (messageTimeout) clearTimeout(messageTimeout)
    messageTimeout = window.setTimeout(() => {
        message.value = null
    }, duration)
  }

  function handleInput(newInputValue: string): 'correct' | 'incorrect' | 'incomplete' | 'completed' {
    userInput.value = newInputValue
    if (!currentWord.value) return 'incomplete'

    // 首次输入时启动计时器
    startPractice()
    soundSystem.playTypingSound('keypress')

    const expectedWord = currentWord.value.word
    
    // 1. 完全匹配
    if (newInputValue === expectedWord) {
      processCorrectWord()
      return 'correct'
    }

    // 2. 输入错误 (与期望的字符不匹配)
    if (!expectedWord.startsWith(newInputValue)) {
      comboCount.value = 0
      errorWords.value.add(currentWordIndex.value)
      soundSystem.playTypingSound('error')
      _setMessage('error', PRACTICE_CONFIG.MODE_MESSAGES[settings.value.practiceMode])
      
      // 严格/硬核模式下重置
      if (settings.value.practiceMode !== 'normal') {
        errorCount.value++
        if (settings.value.practiceMode === 'hardcore') {
          // 延迟重置以播放声音和显示消息
          setTimeout(() => resetPractice(), 100)
        } else { // 'strict'
          userInput.value = ''
        }
      }
      return 'incorrect'
    }
    
    // 3. 输入正确但未完成
    errorWords.value.delete(currentWordIndex.value) // 清除之前的错误标记
    return 'incomplete'
  }

  function processCorrectWord() {
    correctCount.value++
    comboCount.value++
    totalTypedChars.value += currentWord.value?.word.length || 0
    soundSystem.playTypingSound('correct')
    _setMessage('success', '正确!', 1200)

    // 检查是否需要循环练习
    const currentCompletions = (wordCompletionCounts.value.get(currentWordIndex.value) || 0) + 1
    wordCompletionCounts.value.set(currentWordIndex.value, currentCompletions)
    
    const requiredCompletions = settings.value.wordLoopCount === 'infinite' 
      ? Infinity 
      : parseInt(settings.value.wordLoopCount, 10)

    if (currentCompletions < requiredCompletions) {
      // 继续循环当前单词
      userInput.value = ''
      // 在普通模式下，循环时播放当前单词发音
      if (settings.value.soundEnabled && !settings.value.dictationMode && currentWord.value) {
        playPronunciation()
      }
    } else {
      // 移动到下一个单词
      moveToNextWord()
    }
  }

  function previousWord() {
    if (currentWordIndex.value > 0) {
        currentWordIndex.value--
        userInput.value = ''
        comboCount.value = 0
        errorWords.value.delete(currentWordIndex.value)
    }
  }

  function moveToNextWord() {
    if (currentWordIndex.value < currentChapterWords.value.length - 1) {
      currentWordIndex.value++
      userInput.value = ''
    } else {
      completeChapter()
    }
  }

  function skipWord() {
    if (isCompleted.value) return
    comboCount.value = 0
    errorCount.value++ // 跳过计为一次错误
    skippedWords.value.add(currentWordIndex.value)
    soundSystem.playTypingSound('error')
    moveToNextWord()
  }

  function completeChapter() {
    endTime.value = Date.now()
    isCompleted.value = true
  }

  function resetPractice() {
    currentWordIndex.value = 0
    userInput.value = ''
    isCompleted.value = false
    startTime.value = null
    endTime.value = null
    correctCount.value = 0
    errorCount.value = 0
    totalTypedChars.value = 0
    comboCount.value = 0
    message.value = null
    wordCompletionCounts.value.clear()
    skippedWords.value.clear()
    errorWords.value.clear()
  }

  function nextChapter() {
    if (!currentDictionary.value) return
    const totalChapters = Math.ceil(currentDictionary.value.words.length / PRACTICE_CONFIG.WORDS_PER_CHAPTER)
    if (currentChapter.value < totalChapters - 1) {
      currentChapter.value++
      resetPractice()
      // 确保消息系统也被重置
      if (messageTimeout) {
        clearTimeout(messageTimeout)
        messageTimeout = null
      }
      message.value = null
    } else {
      // 如果是最后一章，重新开始第一章
      currentChapter.value = 0
      resetPractice()
      if (messageTimeout) {
        clearTimeout(messageTimeout)
        messageTimeout = null
      }
      message.value = null
    }
  }

  function shuffleCurrentChapter() {
    if (!currentDictionary.value) return
    const words = currentChapterWords.value
    // Fisher-Yates shuffle
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]]
    }
  }

  function playPronunciation() {
    if (currentWord.value) {
      soundSystem.playPronunciation(currentWord.value.word, settings.value.pronunciation)
    }
  }

  // --- 辅助函数 ---
  const getWordStatus = (index: number): WordStatus => {
    if (index === currentWordIndex.value && !isCompleted.value) return 'current'
    
    const requiredCompletions = settings.value.wordLoopCount === 'infinite' 
      ? 1 
      : parseInt(settings.value.wordLoopCount, 10)
    
    if ((wordCompletionCounts.value.get(index) || 0) >= requiredCompletions) {
      return 'completed'
    }
    if (skippedWords.value.has(index)) return 'skipped'
    if (errorWords.value.has(index)) return 'error'
    return 'untouched'
  }

  return {
    // State & Getters
    userInput,
    currentWord,
    currentChapterWords,
    isCompleted,
    progress,
    accuracy,
    wpm,
    currentWordIndex,
    currentChapter,
    currentDictionary,
    settings,
    startTime,
    endTime,
    correctCount,
    errorCount,
    totalTypedChars,
    comboCount,
    message,
    availableChapters,
    currentWordLoopProgress,

    // Actions
    setDictionary,
    handleInput,
    skipWord,
    previousWord,
    resetPractice,
    nextChapter,
    shuffleCurrentChapter,
    playPronunciation,
    getWordStatus
  }
})