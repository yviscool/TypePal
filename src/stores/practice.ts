import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Word {
  word: string
  translation: string
  phonetic?: string
  category: string
  tags: string[]
}

export interface Dictionary {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  words: Word[]
  language: 'en' | 'zh' | 'ja' | 'de' | 'id' | 'hapin' | 'kk'
}

export interface PracticeSettings {
  pronunciation: 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id'
  showTranslation: boolean
  loopOnError: boolean
  dictationMode: boolean
  soundEnabled: boolean
  practiceMode: 'normal' | 'strict' | 'hardcore'
  wordLoopCount: '1' | '3' | '5' | '8' | 'infinite'
}

export const usePracticeStore = defineStore('practice', () => {
  // 状态
  const currentDictionary = ref<Dictionary | null>(null)
  const currentChapter = ref(0)
  const currentWordIndex = ref(0)
  const userInput = ref('')
  const isCompleted = ref(false)
  const startTime = ref<number | null>(null)
  const endTime = ref<number | null>(null)
  
  // 统计数据
  const correctCount = ref(0)
  const totalCount = ref(0)
  const wpm = ref(0)
  const accuracy = ref(100)
  
  // 设置
  const settings = ref<PracticeSettings>({
    pronunciation: 'us',
    showTranslation: true,
    loopOnError: false,
    dictationMode: false,
    soundEnabled: true,
    practiceMode: 'normal',
    wordLoopCount: '1'
  })

  // 计算属性
  const currentChapterWords = computed(() => {
    if (!currentDictionary.value) return []
    const start = currentChapter.value * 20
    const end = Math.min(start + 20, currentDictionary.value.words.length)
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
    
    totalCount.value++
    const isCorrect = userInput.value.trim().toLowerCase() === currentWord.value.word.toLowerCase()
    
    if (isCorrect) {
      correctCount.value++
      nextWord()
      return true
    } else {
      if (!settings.value.loopOnError) {
        nextWord()
      }
      return false
    }
  }

  const nextWord = () => {
    const words = currentChapterWords.value
    if (currentWordIndex.value < words.length - 1) {
      currentWordIndex.value++
      userInput.value = ''
    } else {
      completeChapter()
    }
  }

  const skipWord = () => {
    // 跳过当前单词（用于空格键或其他跳过操作）
    totalCount.value++
    nextWord()
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

  const getPronunciationUrl = (word: string) => {
    const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio='
    
    switch (settings.value.pronunciation) {
      case 'uk':
        return `${pronunciationApi}${word}&type=1`
      case 'us':
        return `${pronunciationApi}${word}&type=2`
      case 'romaji':
        return `${pronunciationApi}${word}&le=jap`
      case 'zh':
        return `${pronunciationApi}${word}&le=zh`
      case 'ja':
        return `${pronunciationApi}${word}&le=jap`
      case 'de':
        return `${pronunciationApi}${word}&le=de`
      case 'hapin':
      case 'kk':
        return `${pronunciationApi}${word}&le=ru` // 有道不支持哈萨克语, 暂时用俄语发音兜底
      case 'id':
        return `${pronunciationApi}${word}&le=id`
      default:
        return ''
    }
  }

  const playPronunciation = (word: string) => {
    if (!settings.value.soundEnabled) return
    
    const url = getPronunciationUrl(word)
    if (url) {
      const audio = new Audio(url)
      audio.play().catch(console.error)
    }
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
    
    // 计算属性
    currentChapterWords,
    currentWord,
    progress,
    
    // 方法
    setDictionary,
    resetChapter,
    nextChapter,
    startPractice,
    submitWord,
    nextWord,
    skipWord,
    completeChapter,
    playPronunciation,
    shuffleCurrentChapter
  }
})