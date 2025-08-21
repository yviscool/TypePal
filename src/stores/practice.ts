import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// 单词接口定义
export interface Word {
  word: string // 单词文本
  translation: string // 翻译
  phonetic?: string // 音标（可选）
  category: string // 分类
  tags: string[] // 标签数组
}

// 词典接口定义
export interface Dictionary {
  id: string // 词典唯一标识
  name: string // 词典名称
  description: string // 词典描述
  category: string // 词典分类
  tags: string[] // 词典标签
  words: Word[] // 单词列表
  language: 'en' | 'zh' | 'ja' | 'de' | 'id' | 'hapin' | 'kk' // 语言类型
}

// 练习设置接口定义
export interface PracticeSettings {
  pronunciation: 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id' // 发音类型
  showTranslation: boolean // 是否显示翻译
  loopOnError: boolean // 错误时是否循环
  dictationMode: boolean // 听写模式
  soundEnabled: boolean // 是否启用声音
  practiceMode: 'normal' | 'strict' | 'hardcore' // 练习模式
  wordLoopCount: '1' | '3' | '5' | '8' | 'infinite' // 单词循环次数
  comboEffectsLevel: 'none' | 'simple' | 'gorgeous' // 连击特效级别
}

// 单词状态类型定义
// 未触及 | 当前 | 已完成 | 已跳过 | 错误
export type WordStatus = 'untouched' | 'current' | 'completed' | 'skipped' | 'error' 

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
      // 更新新的当前单词状态
      updateWordStatusCache(currentWordIndex.value)
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

  // 音频对象池，避免频繁创建销毁
  const audioPool = new Map<string, HTMLAudioElement>()
  const maxPoolSize = 10

  const playPronunciation = (word: string) => {
    if (!settings.value.soundEnabled) return
    
    const url = getPronunciationUrl(word)
    if (!url) return

    // 尝试从池中获取音频对象
    let audio = audioPool.get(url)
    
    if (!audio) {
      // 池中没有，创建新的音频对象
      audio = new Audio(url)
      audio.volume = 0.8
      audio.preload = 'metadata' // 只预加载元数据，不预加载音频内容
      
      // 如果池未满，加入池中
      if (audioPool.size < maxPoolSize) {
        audioPool.set(url, audio)
      }
    }
    
    // 重置播放位置并播放
    audio.currentTime = 0
    audio.play().catch(console.error)
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
    playPronunciation,
    getPronunciationUrl,
    shuffleCurrentChapter,
    markWordError,
    clearWordError
  }
})