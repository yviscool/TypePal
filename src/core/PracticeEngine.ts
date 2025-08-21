/**
 * 练习引擎核心 - 单一职责：管理练习流程
 * 遵循命令模式和状态机模式
 */
import type { Word, PracticeSettings, WordStatus } from '@/types/practice'

export interface PracticeState {
  currentWordIndex: number
  userInput: string
  isCompleted: boolean
  startTime: number | null
  endTime: number | null
}

export interface PracticeStats {
  correctCount: number
  totalCount: number
  wpm: number
  accuracy: number
}

export class PracticeEngine {
  private state: PracticeState
  private stats: PracticeStats
  private words: Word[]
  private settings: PracticeSettings
  private wordCompletionCounts = new Map<number, number>()
  private wordStatuses = new Map<number, WordStatus>()
  private skippedWords = new Set<number>()
  private errorWords = new Set<number>()

  constructor(words: Word[], settings: PracticeSettings) {
    this.words = words
    this.settings = settings
    this.state = this.createInitialState()
    this.stats = this.createInitialStats()
  }

  private createInitialState(): PracticeState {
    return {
      currentWordIndex: 0,
      userInput: '',
      isCompleted: false,
      startTime: null,
      endTime: null
    }
  }

  private createInitialStats(): PracticeStats {
    return {
      correctCount: 0,
      totalCount: 0,
      wpm: 0,
      accuracy: 100
    }
  }

  // 核心业务逻辑方法
  public processInput(input: string): InputResult {
    const currentWord = this.getCurrentWord()
    if (!currentWord) return { type: 'no-word' }

    this.state.userInput = input
    this.startPracticeIfNeeded()

    if (input.length === 0) {
      return { type: 'empty-input' }
    }

    return this.validateInput(input, currentWord)
  }

  public getCurrentWord(): Word | null {
    return this.words[this.state.currentWordIndex] || null
  }

  public getProgress(): number {
    if (this.words.length === 0) return 0
    return (this.state.currentWordIndex / this.words.length) * 100
  }

  public getWordStatus(index: number): WordStatus {
    if (index === this.state.currentWordIndex) return 'current'
    if (this.skippedWords.has(index)) return 'skipped'
    if (this.errorWords.has(index)) return 'error'
    
    const completionCount = this.wordCompletionCounts.get(index) || 0
    const requiredCount = this.settings.wordLoopCount === 'infinite' ? 1 : parseInt(this.settings.wordLoopCount)
    
    if (completionCount >= requiredCount) return 'completed'
    return 'untouched'
  }

  public getState(): PracticeState {
    return { ...this.state }
  }

  public getSettings(): PracticeSettings {
    return { ...this.settings }
  }

  public getStatistics(): PracticeStats {
    return { ...this.stats }
  }

  public getWordLoopProgress(): { current: number; required: number; isInfinite: boolean } {
    const currentCount = this.wordCompletionCounts.get(this.state.currentWordIndex) || 0
    const requiredCount = this.settings.wordLoopCount === 'infinite' ? Infinity : parseInt(this.settings.wordLoopCount)
    
    return {
      current: currentCount,
      required: requiredCount,
      isInfinite: this.settings.wordLoopCount === 'infinite'
    }
  }

  public startPractice(): void {
    this.startPracticeIfNeeded()
  }

  public completeCurrentWord(): void {
    const currentIndex = this.state.currentWordIndex
    
    // 清除错误状态
    this.errorWords.delete(currentIndex)
    
    // 增加统计
    this.stats.totalCount++
    this.stats.correctCount++
    
    // 增加完成次数
    const currentCount = this.wordCompletionCounts.get(currentIndex) || 0
    this.wordCompletionCounts.set(currentIndex, currentCount + 1)
    
    // 检查是否需要继续循环当前单词
    const requiredCount = this.settings.wordLoopCount === 'infinite' ? Infinity : parseInt(this.settings.wordLoopCount)
    
    if (currentCount + 1 < requiredCount) {
      // 需要继续练习当前单词，只清空输入
      this.state.userInput = ''
      return
    }
    
    // 移动到下一个单词
    this.nextWord()
  }

  public skipCurrentWord(): void {
    const currentIndex = this.state.currentWordIndex
    
    // 标记为跳过状态
    this.skippedWords.add(currentIndex)
    this.stats.totalCount++
    
    // 移动到下一个单词
    this.nextWord()
  }

  public markWordError(wordIndex: number): void {
    this.errorWords.add(wordIndex)
  }

  public clearWordError(wordIndex: number): void {
    this.errorWords.delete(wordIndex)
  }

  public clearInput(): void {
    this.state.userInput = ''
  }

  public resetChapter(): void {
    this.reset()
  }

  public completeChapter(): void {
    this.state.endTime = Date.now()
    this.state.isCompleted = true
    this.calculateStats()
  }

  public reset(): void {
    this.state = this.createInitialState()
    this.stats = this.createInitialStats()
    this.wordCompletionCounts.clear()
    this.wordStatuses.clear()
    this.skippedWords.clear()
    this.errorWords.clear()
  }

  private nextWord(): void {
    if (this.state.currentWordIndex < this.words.length - 1) {
      this.state.currentWordIndex++
      this.state.userInput = ''
    } else {
      this.completeChapter()
    }
  }

  private startPracticeIfNeeded(): void {
    if (!this.state.startTime) {
      this.state.startTime = Date.now()
    }
  }

  private validateInput(input: string, word: Word): InputResult {
    const isComplete = input.length === word.word.length
    const isCorrect = input.toLowerCase() === word.word.toLowerCase()

    if (isComplete) {
      return isCorrect 
        ? { type: 'word-complete', word }
        : { type: 'word-incorrect', word }
    }

    // 检查当前字符是否正确
    const currentChar = input[input.length - 1].toLowerCase()
    const expectedChar = word.word[input.length - 1].toLowerCase()
    
    return currentChar === expectedChar
      ? { type: 'char-correct' }
      : { type: 'char-incorrect', expectedChar, actualChar: currentChar }
  }

  private calculateStats(): void {
    if (!this.state.startTime || !this.state.endTime) return
    
    const timeInMinutes = (this.state.endTime - this.state.startTime) / 60000
    this.stats.wpm = Math.round(this.stats.correctCount / timeInMinutes)
    this.stats.accuracy = this.stats.totalCount > 0 
      ? Math.round((this.stats.correctCount / this.stats.totalCount) * 100) 
      : 100
  }
}

export type InputResult = 
  | { type: 'no-word' }
  | { type: 'empty-input' }
  | { type: 'char-correct' }
  | { type: 'char-incorrect'; expectedChar: string; actualChar: string }
  | { type: 'word-complete'; word: Word }
  | { type: 'word-incorrect'; word: Word }