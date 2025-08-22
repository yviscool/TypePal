import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { Word, Dictionary, PracticeSettings, WordStatus } from '@/types/practice'
import { SoundSystem } from '@/core/SoundSystem'
import type { TypingSoundVariant } from '@/types/sound'
import { PRACTICE_CONFIG } from '@/core/PracticeConfig'

// 创建全局声音系统实例
const soundSystem = new SoundSystem()

export const usePracticeStore = defineStore('practice', () => {
  // 状态
  const currentDictionary = ref<Dictionary | null>(null)
  const currentChapter = ref(0)
  const currentWordIndex = ref(0)
  const userInput = ref('')
  const isCompleted = ref(false)
  const startTime = ref<number | null>(null)
  const endTime = ref<number | null>(null)
  
  // 单词循环计数状态
  const wordCompletionCounts = ref<Map<number, number>>(new Map())
  
  // 单词状态跟踪
  const wordStatuses = ref<Map<number, WordStatus>>(new Map())
  const skippedWords = ref<Set<number>>(new Set())
  const errorWords = ref<Set<number>>(new Set())
  
  // 统计数据
  const correctCount = ref(0)
  const totalCount = ref(0)
  const wpm = ref(0)
  const accuracy = ref(100)
  
  // 声音设置
  const typingSoundEnabled = ref<boolean>(PRACTICE_CONFIG.TYPING_SOUNDS.ENABLED_DEFAULT)
  const typingSoundVariant = ref<TypingSoundVariant>(PRACTICE_CONFIG.TYPING_SOUNDS.DEFAULT_VARIANT)
  
  // 设置
  const settings = ref<PracticeSettings>({
    pronunciation: 'us',
    showTranslation: true,
    loopOnError: false,
    dictationMode: false,
    soundEnabled: true,
    practiceMode: 'normal',
    wordLoopCount: '1',
    comboEffectsLevel: 'gorgeous'
  })
  
  // 初始化声音系统
  onMounted(() => {
    soundSystem.setEnabled(settings.value.soundEnabled)
    soundSystem.setTypingSoundEnabled(typingSoundEnabled.value)
    soundSystem.setTypingSoundVariant(typingSoundVariant.value)
  })

  // 计算属性
  const currentChapterWords = computed(() => {
    if (!currentDictionary.value) return []
    const start = currentChapter.value * PRACTICE_CONFIG.WORDS_PER_CHAPTER
    const end = Math.min(start + PRACTICE_CONFIG.WORDS_PER_CHAPTER, currentDictionary.value.words.length)
    return currentDictionary.value.words.slice(start, end)
  })

  const currentWord = computed(() => {
    const words = currentChapterWords.value
    return words[currentWordIndex.value] || null
  })

  const progress = computed(() => {
    const words = currentChapterWords.value
    if (words.length === 0) return 0
    return (currentWordIndex.value / words.length) * 100
  })

  const currentWordLoopProgress = computed(() => {
    const currentCount = wordCompletionCounts.value.get(currentWordIndex.value) || 0
    const requiredCount = settings.value.wordLoopCount === 'infinite' ? Infinity : parseInt(settings.value.wordLoopCount)
    return {
      current: currentCount,
      required: requiredCount,
      isInfinite: settings.value.wordLoopCount === 'infinite'
    }
  })

  // 获取单词状态（直接函数，确保子组件使用时能读取到最新的响应式数据）
  const getWordStatus = (index: number): WordStatus => {
    if (index === currentWordIndex.value) return 'current'

    const completionCount = wordCompletionCounts.value.get(index) || 0
    const requiredCount =
      settings.value.wordLoopCount === 'infinite' ? 1 : parseInt(settings.value.wordLoopCount)

    if (completionCount >= requiredCount) return 'completed'
    if (skippedWords.value.has(index)) return 'skipped'
    if (errorWords.value.has(index)) return 'error'
    return 'untouched'
  }

  // 方法
  const setDictionary = (dictionary: Dictionary) => {
    currentDictionary.value = dictionary
    resetChapter()
  }

  const resetChapter = () => {
    currentWordIndex.value = 0
    userInput.value = ''
    isCompleted.value = false
    correctCount.value = 0
    totalCount.value = 0
    startTime.value = null
    endTime.value = null
    wordCompletionCounts.value.clear()
    wordStatuses.value.clear()
    skippedWords.value.clear()
    errorWords.value.clear()
  }

  const nextChapter = () => {
    if (!currentDictionary.value) return
    const maxChapters = Math.ceil(currentDictionary.value.words.length / 20)
    if (currentChapter.value < maxChapters - 1) {
      currentChapter.value++
      resetChapter()
    }
  }

  const startPractice = () => {
    if (!startTime.value) {
      startTime.value = Date.now()
    }
  }

  const submitWord = () => {
    if (!currentWord.value) return false
    
    const isCorrect = userInput.value.trim().toLowerCase() === currentWord.value.word.toLowerCase()
    
    if (isCorrect) {
      // 只有正确时才增加统计
      correctCount.value++
      totalCount.value++
      nextWord()
      return true
    } else {
      // 错误时也要增加总数（用于准确率计算）
      totalCount.value++
      if (!settings.value.loopOnError) {
        nextWord()
      }
      return false
    }
  }

  const nextWord = () => {
    const words = currentChapterWords.value
    const currentIndex = currentWordIndex.value
    
    // 获取当前单词的完成次数
    const currentCount = wordCompletionCounts.value.get(currentIndex) || 0
    const requiredCount = settings.value.wordLoopCount === 'infinite' ? Infinity : parseInt(settings.value.wordLoopCount)
    
    // 增加当前单词的完成次数
    wordCompletionCounts.value.set(currentIndex, currentCount + 1)
    
    // 清理当前单词的跳过和错误状态（因为已经正确完成）
    skippedWords.value.delete(currentIndex)
    errorWords.value.delete(currentIndex)
    
    
    // 检查是否需要继续循环当前单词
    if (currentCount + 1 < requiredCount) {
      // 需要继续练习当前单词，只清空输入
      userInput.value = ''
      return
    }
    
    // 当前单词已完成所需次数，移动到下一个单词
    if (currentWordIndex.value < words.length - 1) {
      currentWordIndex.value++
      userInput.value = ''
    } else {
      completeChapter()
    }
  }

  const skipWord = () => {
    // 标记当前单词为跳过状态
    skippedWords.value.add(currentWordIndex.value)
    
    // 移动到下一个单词（不增加完成计数）
    // 注意：统计已在 Practice.vue 中处理，这里不重复统计
    const words = currentChapterWords.value
    if (currentWordIndex.value < words.length - 1) {
      currentWordIndex.value++
      userInput.value = ''
    } else {
      completeChapter()
    }
  }

  // 标记单词错误状态
  const markWordError = (wordIndex: number) => {
    errorWords.value.add(wordIndex)
  }

  // 清除单词错误状态（当单词被正确完成时）
  const clearWordError = (wordIndex: number) => {
    errorWords.value.delete(wordIndex)
  }

  const completeChapter = () => {
    endTime.value = Date.now()
    isCompleted.value = true
    calculateStats()
  }

  const calculateStats = () => {
    if (!startTime.value || !endTime.value) return
    
    const timeInMinutes = (endTime.value - startTime.value) / 60000
    const wordsTyped = correctCount.value
    wpm.value = Math.round(wordsTyped / timeInMinutes)
    accuracy.value = totalCount.value > 0 ? Math.round((correctCount.value / totalCount.value) * 100) : 100
  }

  // 声音相关方法
  const playPronunciation = (word: string) => {
    if (!settings.value.soundEnabled || !word) return
    soundSystem.playPronunciation(word, settings.value.pronunciation)
  }
  
  const playTypingSound = (type: 'keypress' | 'correct' | 'error') => {
    if (!settings.value.soundEnabled || !typingSoundEnabled.value) return
    soundSystem.playTypingSound(type)
  }
  
  // 设置声音状态
  const setSoundEnabled = (enabled: boolean) => {
    settings.value.soundEnabled = enabled
    soundSystem.setEnabled(enabled)
  }
  
  const setTypingSoundEnabled = (enabled: boolean) => {
    typingSoundEnabled.value = enabled
    soundSystem.setTypingSoundEnabled(enabled)
  }
  
  const setTypingSoundVariant = (variant: TypingSoundVariant) => {
    typingSoundVariant.value = variant
    soundSystem.setTypingSoundVariant(variant)
  }

  const shuffleCurrentChapter = () => {
    if (!currentDictionary.value) return
    
    // 获取当前章节的单词
    const start = currentChapter.value * 20
    const end = Math.min(start + 20, currentDictionary.value.words.length)
    const chapterWords = [...currentDictionary.value.words.slice(start, end)]
    
    // Fisher-Yates 洗牌算法
    for (let i = chapterWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chapterWords[i], chapterWords[j]] = [chapterWords[j], chapterWords[i]]
    }
    
    // 更新词典中的单词顺序
    currentDictionary.value.words.splice(start, end - start, ...chapterWords)
    
    // 重置当前练习状态
    resetChapter()
  }

  return {
    // 状态
    currentDictionary,
    currentChapter,
    currentWordIndex,
    userInput,
    isCompleted,
    startTime,
    endTime,
    correctCount,
    totalCount,
    wpm,
    accuracy,
    settings,
    typingSoundEnabled,
    typingSoundVariant,
    
    // 计算属性
    currentChapterWords,
    currentWord,
    progress,
    currentWordLoopProgress,
    getWordStatus,
    
    // 方法
    setDictionary,
    resetChapter,
    nextChapter,
    startPractice,
    submitWord,
    nextWord,
    skipWord,
    completeChapter,
    shuffleCurrentChapter,
    markWordError,
    clearWordError,
    
    // 声音相关方法
    playPronunciation,
    playTypingSound,
    setSoundEnabled,
    setTypingSoundEnabled,
    setTypingSoundVariant
  }
})