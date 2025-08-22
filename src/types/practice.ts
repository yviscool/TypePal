/**
 * 练习相关类型定义 - 统一管理所有练习相关的类型
 * 确保类型安全和一致性
 */
import { SupportedLanguage } from './dictionary'

// 基础单词接口
export interface Word {
  word: string
  translation: string
  phonetic?: string
  category: string
  tags: string[]
}

// 词典接口
export interface Dictionary {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  words: Word[]
  language: SupportedLanguage
}

// 发音语言类型
export type PronunciationLanguage = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id'

// 练习模式枚举
export type PracticeMode = 'normal' | 'strict' | 'hardcore'

// 连击特效级别
export type ComboEffectLevel = 'none' | 'simple' | 'gorgeous'

// 单词循环次数类型
export type WordLoopCount = '1' | '3' | '5' | '8' | 'infinite'

// 练习设置接口
export interface PracticeSettings {
  pronunciation: PronunciationLanguage
  showTranslation: boolean
  loopOnError: boolean
  dictationMode: boolean
  soundEnabled: boolean
  practiceMode: PracticeMode
  wordLoopCount: WordLoopCount
  comboEffectsLevel: ComboEffectLevel
}

// 单词状态类型
export type WordStatus = 'untouched' | 'current' | 'completed' | 'skipped' | 'error'

// 练习统计接口
export interface PracticeStatistics {
  correctCount: number
  totalCount: number
  wpm: number
  accuracy: number
  startTime: number | null
  endTime: number | null
}

// 单词循环进度接口
export interface WordLoopProgress {
  current: number
  required: number
  isInfinite: boolean
}

// 章节信息接口
export interface ChapterInfo {
  index: number
  words: Word[]
  totalWords: number
  completedWords: number
  progress: number
}

// 练习事件类型
export interface PracticeEvents {
  onWordComplete: (word: Word) => void
  onWordSkip: (word: Word) => void
  onWordError: (word: Word, error: string) => void
  onChapterComplete: (stats: PracticeStatistics) => void
  onPracticeStart: () => void
  onPracticeReset: () => void
}

// 输入验证结果
export interface InputValidationResult {
  isValid: boolean
  isComplete: boolean
  errorPosition?: number
  expectedChar?: string
  actualChar?: string
}
