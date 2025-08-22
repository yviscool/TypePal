/**
 * 声音系统相关类型定义
 */

/** 声音选项接口 */
export interface SoundOptions {
  /** 音量 (0-1) */
  volume?: number
  /** 播放速率 */
  rate?: number
}

/** 打字音效类型 */
export type TypingSoundType = 'keypress' | 'correct' | 'error'

/** 打字音效变体 */
export type TypingSoundVariant = 
  | 'Default'
  | 'Cherry MX Blues'
  | 'Cherry MX Browns'
  | 'Cherry MX Blacks'
  | 'Gateron Black Inks'
  | 'Gateron Red Inks'
  | 'Holy Pandas'
  | 'NovelKeys Creams'
  | 'Kailh Box Navies'
  | 'Alpacas'
  | 'Turquoise Tealios'
  | 'Topre'
  | 'SKCM Blue Alps'
  | 'Buckling Spring'