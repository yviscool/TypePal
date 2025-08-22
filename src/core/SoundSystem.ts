/**
 * 声音系统 - 单一职责：管理所有声音效果
 * 包括发音和打字音效
 */
import { PRACTICE_CONFIG, type LanguageCode } from './PracticeConfig'

export interface SoundOptions {
  volume?: number
  rate?: number
}

export class SoundSystem {
  private audioPool = new Map<string, HTMLAudioElement>()
  private readonly maxPoolSize = PRACTICE_CONFIG.AUDIO_POOL_SIZE
  private volume: number = PRACTICE_CONFIG.AUDIO_VOLUME
  private enabled = true
  private typingSoundEnabled = false
  private typingSoundVariant = 'Default'

  /**
   * 播放单词发音
   * @param word 要发音的单词
   * @param language 语言代码
   * @param options 可选配置
   */
  public playPronunciation(word: string, language: LanguageCode, options?: SoundOptions): void {
    if (!this.enabled) return
    
    const url = this.getPronunciationUrl(word, language)
    if (!url) return

    this.playAudio(url, options)
  }

  /**
   * 播放打字音效
   * @param type 音效类型
   * @param options 可选配置
   */
  public playTypingSound(type: 'keypress' | 'correct' | 'error', options?: SoundOptions): void {
    if (!this.enabled || !this.typingSoundEnabled) return
    
    let soundPath: string
    
    switch (type) {
      case 'keypress':
        soundPath = `/sounds/key-sound/${this.typingSoundVariant}.mp3`
        // 对于默认音效，使用 wav 格式
        if (this.typingSoundVariant === 'Default') {
          soundPath = '/sounds/key-sound/Default.wav'
        }
        break
      case 'correct':
        soundPath = '/sounds/correct.wav'
        break
      case 'error':
        soundPath = '/sounds/beep.wav'
        break
    }
    
    this.playAudio(soundPath, options)
  }

  /**
   * 设置声音系统状态
   * @param enabled 是否启用声音
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * 设置打字音效状态
   * @param enabled 是否启用打字音效
   */
  public setTypingSoundEnabled(enabled: boolean): void {
    this.typingSoundEnabled = enabled
  }

  /**
   * 设置打字音效变体
   * @param variant 音效变体名称
   */
  public setTypingSoundVariant(variant: string): void {
    this.typingSoundVariant = variant
  }

  /**
   * 设置音量
   * @param volume 音量值 (0-1)
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * 获取发音URL
   * @param word 单词
   * @param language 语言代码
   * @returns 发音URL
   */
  private getPronunciationUrl(word: string, language: LanguageCode): string {
    const langParam = PRACTICE_CONFIG.LANGUAGE_MAPPING[language]
    if (!langParam) return ''
    
    return `${PRACTICE_CONFIG.PRONUNCIATION_API}${encodeURIComponent(word)}${langParam}`
  }

  /**
   * 播放音频
   * @param url 音频URL
   * @param options 可选配置
   */
  private playAudio(url: string, options?: SoundOptions): void {
    // 尝试从池中获取音频对象
    let audio = this.audioPool.get(url)
    
    if (!audio) {
      // 池中没有，创建新的音频对象
      audio = new Audio(url)
      audio.preload = 'auto'
      
      // 如果池未满，加入池中
      if (this.audioPool.size < this.maxPoolSize) {
        this.audioPool.set(url, audio)
      }
    }
    
    // 应用选项
    audio.volume = options?.volume ?? this.volume
    if (options?.rate && audio.playbackRate !== undefined) {
      audio.playbackRate = options.rate
    }
    
    // 重置播放位置并播放
    audio.currentTime = 0
    audio.play().catch(console.error)
  }
}