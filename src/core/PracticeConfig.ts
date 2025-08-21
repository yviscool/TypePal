/**
 * 练习配置管理 - 单一职责：管理所有配置常量和规则
 * 消除硬编码，提供类型安全的配置访问
 */
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

export type PracticeMode = keyof typeof PRACTICE_CONFIG.MODE_MESSAGES
export type LanguageCode = keyof typeof PRACTICE_CONFIG.LANGUAGE_MAPPING

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
}