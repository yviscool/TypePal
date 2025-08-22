/**
 * 练习配置管理 - 单一职责：管理所有配置常量和规则
 * 消除硬编码，提供类型安全的配置访问
 */
import type { PracticeMode } from '@/types/practice'
import type { TypingSoundVariant } from '@/types/sound'

export const PRACTICE_CONFIG = {
  // 章节配置
  WORDS_PER_CHAPTER: 20,
  
  // 时间配置
  TIMER_INTERVAL: 100, // ms
  
  // 延迟配置
  RESET_DELAY: 50,
  WORD_COMPLETE_CALLBACK_DELAY: 100,
  
  // 消息持续时间
  MESSAGE_DURATION: {
    SUCCESS: 250,
    ERROR: 1500,
    INFO: 2000,
    COMBO_BREAK: 1500
  },
  
  // 音频配置
  AUDIO_POOL_SIZE: 10,
  AUDIO_VOLUME: 0.8,
  
  // 打字音效配置
  TYPING_SOUNDS: {
    ENABLED_DEFAULT: false,
    DEFAULT_VARIANT: 'Default' as TypingSoundVariant,
    VARIANTS: [
      'Default',
      'Cherry MX Blues',
      'Cherry MX Browns',
      'Cherry MX Blacks',
      'Gateron Black Inks',
      'Gateron Red Inks',
      'Holy Pandas',
      'NovelKeys Creams',
      'Kailh Box Navies',
      'Alpacas',
      'Turquoise Tealios',
      'Topre',
      'SKCM Blue Alps',
      'Buckling Spring'
    ] as TypingSoundVariant[]
  },
  
  // 焦点管理
  FOCUS_RETRY_DELAY: 16, // 一帧的时间
  
  // 练习模式消息
  MODE_MESSAGES: {
    hardcore: '💥 硬核模式：全部重来！',
    strict: '⚡ 严格模式：从头开始！',
    normal: '输入错误，请使用退格键修正'
  } as const,
  
  // 发音 API 配置
  PRONUNCIATION_API: 'https://dict.youdao.com/dictvoice?audio=',
  
  // 语言映射
  LANGUAGE_MAPPING: {
    uk: '&type=1',
    us: '&type=2',
    romaji: '&le=jap',
    zh: '&le=zh',
    ja: '&le=jap',
    de: '&le=de',
    hapin: '&le=ru', // 有道不支持哈萨克语，使用俄语兜底
    kk: '&le=ru',
    id: '&le=id'
  } as const
} as const

export type LanguageCode = keyof typeof PRACTICE_CONFIG.LANGUAGE_MAPPING

export const DEFAULT_SETTINGS = {
  pronunciation: 'us' as LanguageCode,
  showTranslation: true,
  loopOnError: false,
  dictationMode: false,
  soundEnabled: true,
  typingSound: true,  // 默认启用打字音效
  typingSoundVariant: 'Default' as TypingSoundVariant,
  practiceMode: 'normal' as PracticeMode,
  wordLoopCount: '1',
  comboEffectsLevel: 'gorgeous'
} as const

/**
 * 配置验证器
 */
export class ConfigValidator {
  public static validateWordLoopCount(count: string): boolean {
    return ['1', '3', '5', '8', 'infinite'].includes(count)
  }
  
  public static validatePracticeMode(mode: string): mode is PracticeMode {
    return mode in PRACTICE_CONFIG.MODE_MESSAGES
  }
  
  public static validateLanguageCode(code: string): code is LanguageCode {
    return code in PRACTICE_CONFIG.LANGUAGE_MAPPING
  }
  
  public static validateTypingSoundVariant(variant: string): variant is TypingSoundVariant {
    return PRACTICE_CONFIG.TYPING_SOUNDS.VARIANTS.includes(variant as TypingSoundVariant)
  }
}
